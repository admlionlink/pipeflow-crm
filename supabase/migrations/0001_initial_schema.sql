-- ============================================================
-- PipeFlow CRM — Migration 0001: Initial Schema
-- ============================================================

-- ─── Enums ───────────────────────────────────────────────────

CREATE TYPE member_role AS ENUM ('admin', 'member');
CREATE TYPE plan AS ENUM ('free', 'pro');
CREATE TYPE lead_status AS ENUM ('novo', 'contatado', 'qualificado', 'negociando', 'convertido', 'perdido');
CREATE TYPE deal_stage AS ENUM ('novo', 'contatado', 'qualificado', 'negociando', 'convertido', 'perdido');
CREATE TYPE activity_type AS ENUM ('call', 'email', 'meeting', 'note');

-- ─── Trigger: updated_at automático ──────────────────────────

CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ─── Tabelas ──────────────────────────────────────────────────

-- workspaces: unidade de multi-tenancy (empresa / conta)
CREATE TABLE workspaces (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  slug       TEXT NOT NULL UNIQUE,
  plan       plan NOT NULL DEFAULT 'free',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER set_workspaces_updated_at
  BEFORE UPDATE ON workspaces
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- workspace_members: relação N:N users ↔ workspaces com papel
CREATE TABLE workspace_members (
  workspace_id UUID        NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id      UUID        NOT NULL REFERENCES auth.users(id)  ON DELETE CASCADE,
  role         member_role NOT NULL DEFAULT 'member',
  joined_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (workspace_id, user_id)
);

CREATE INDEX idx_workspace_members_user_id ON workspace_members(user_id);

-- workspace_invites: convites por e-mail (link com token único)
CREATE TABLE workspace_invites (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID        NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  email        TEXT        NOT NULL,
  role         member_role NOT NULL DEFAULT 'member',
  token        TEXT        NOT NULL UNIQUE,
  expires_at   TIMESTAMPTZ NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_workspace_invites_workspace_id ON workspace_invites(workspace_id);
CREATE INDEX idx_workspace_invites_token        ON workspace_invites(token);

-- leads: contatos / oportunidades no CRM
CREATE TABLE leads (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID        NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name            TEXT        NOT NULL,
  email           TEXT        NOT NULL,
  phone           TEXT,
  company         TEXT,
  position        TEXT,
  status          lead_status NOT NULL DEFAULT 'novo',
  estimated_value NUMERIC(12, 2),
  notes           TEXT,
  owner_id        UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_leads_workspace_id ON leads(workspace_id);
CREATE INDEX idx_leads_owner_id     ON leads(owner_id);
CREATE INDEX idx_leads_status       ON leads(workspace_id, status);

CREATE TRIGGER set_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- deals: negócios no pipeline Kanban
CREATE TABLE deals (
  id           UUID       PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID       NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  lead_id      UUID       REFERENCES leads(id) ON DELETE SET NULL,
  title        TEXT       NOT NULL,
  stage        deal_stage NOT NULL DEFAULT 'novo',
  value        NUMERIC(12, 2),
  owner_id     UUID       REFERENCES auth.users(id) ON DELETE SET NULL,
  due_date     DATE,
  notes        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_deals_workspace_id ON deals(workspace_id);
CREATE INDEX idx_deals_lead_id      ON deals(lead_id);
CREATE INDEX idx_deals_stage        ON deals(workspace_id, stage);

CREATE TRIGGER set_deals_updated_at
  BEFORE UPDATE ON deals
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- activities: timeline de interações com leads
CREATE TABLE activities (
  id           UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID          NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  lead_id      UUID          NOT NULL REFERENCES leads(id)      ON DELETE CASCADE,
  type         activity_type NOT NULL,
  title        TEXT          NOT NULL,
  description  TEXT,
  author_id    UUID          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  extra_data   JSONB,
  created_at   TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX idx_activities_workspace_id ON activities(workspace_id);
CREATE INDEX idx_activities_lead_id      ON activities(lead_id);

-- subscriptions: plano Stripe por workspace (1:1)
CREATE TABLE subscriptions (
  id                     UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id           UUID        NOT NULL UNIQUE REFERENCES workspaces(id) ON DELETE CASCADE,
  stripe_customer_id     TEXT,
  stripe_subscription_id TEXT        UNIQUE,
  status                 TEXT        NOT NULL DEFAULT 'trialing',
  plan                   plan        NOT NULL DEFAULT 'free',
  current_period_end     TIMESTAMPTZ,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER set_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ─── Trigger: criador do workspace vira admin automaticamente ─

CREATE OR REPLACE FUNCTION handle_workspace_created()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO workspace_members (workspace_id, user_id, role)
  VALUES (NEW.id, auth.uid(), 'admin');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_workspace_created
  AFTER INSERT ON workspaces
  FOR EACH ROW EXECUTE FUNCTION handle_workspace_created();
