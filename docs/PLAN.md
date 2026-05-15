# PLAN.md — Plano de Execução do PipeFlow CRM

Plano executável dividido em milestones, derivado do briefing técnico em [../CLAUDE.md](../CLAUDE.md) e dos requisitos em [PRD.md](PRD.md).

**Estratégia**: construir em quatro fases, **interface primeiro, backend depois**.

1. **Fase 1 — Setup**: scaffold + design system.
2. **Fase 2 — Interface (UI-first com mock data)**: todas as telas navegáveis com dados em memória.
3. **Fase 3 — Backend (Supabase + integrações)**: substituir mocks por persistência real, fatia por fatia.
4. **Fase 4 — Monetização & Deploy**: Stripe completo, polimento, acessibilidade, deploy.

## Convenções de Trabalho

- **Branches**: `feat/mNN-slug-curto` (ex.: `feat/m02-landing-page`). Hotfixes: `fix/descricao`.
- **Commits**: [Conventional Commits](https://www.conventionalcommits.org/) — `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, `style:`.
- **PRs**: cada milestone = 1 PR. Mergeado em `main` antes do próximo começar. Squash merge recomendado.
- **Definition of Done por milestone**:
  - [ ] Todas as entregas do checklist marcadas.
  - [ ] `npm run lint` passa sem warnings.
  - [ ] `npm run typecheck` passa.
  - [ ] `npm run build` passa.
  - [ ] Fluxo testado manualmente no browser (golden path + 1 edge case).
  - [ ] PR mergeado em `main`.

## Workflow por Milestone

```
1. git checkout main && git pull
2. git checkout -b feat/mNN-slug
3. Implementar entregas do checklist (commits pequenos durante o trabalho)
4. Rodar lint + typecheck + build localmente
5. git push -u origin feat/mNN-slug
6. Abrir PR descrevendo entregas e linkando o milestone
7. Merge em main → próximo milestone
```

---

## Fase 1 — Setup

### M01 — Project Setup, Tooling & Design System

- **Branch**: `feat/m01-setup`
- **Objetivo**: bootar o projeto Next.js 14 com toda a base técnica (TS strict, Tailwind, shadcn/ui com tema custom laranja/coral dark-first) e tooling de qualidade.
- **Entregas**:
  - [ ] `npx create-next-app@latest` (App Router, TS, Tailwind, src/, ESLint, alias `@/`).
  - [ ] Estrutura de pastas conforme [CLAUDE.md](../CLAUDE.md): `app/`, `components/ui`, `components/features`, `lib/`, `server/`, `hooks/`, `types/`, `styles/`.
  - [ ] Prettier configurado + script `format` (2 espaços, aspas simples, trailing commas).
  - [ ] `shadcn/ui` inicializado com tema customizado (tokens HSL para laranja `#F97316`, coral, âmbar, esmeralda, vermelho).
  - [ ] Dark mode como padrão via `next-themes`, com toggle.
  - [ ] Fontes **Inter** + **JetBrains Mono** via `next/font`.
  - [ ] `globals.css` com tokens do design system (cores, espaçamentos, radius).
  - [ ] Componentes base shadcn instalados: `button`, `input`, `label`, `card`, `dialog`, `dropdown-menu`, `sheet`, `tabs`, `badge`, `avatar`, `tooltip`, `sonner` (toast).
  - [ ] Página `/` placeholder confirmando tema aplicado e fontes carregadas.
  - [ ] `.env.example` criado (estrutura vazia).
  - [ ] `README.md` mínimo com `npm run dev` e link para `docs/`.
  - [ ] `.gitignore` cobrindo `.env*`, `node_modules`, `.next`, `dist`.
- **Commit final**: `chore: bootstrap Next.js 14 + Tailwind + shadcn/ui with PipeFlow theme`

---

## Fase 2 — Interface (UI-first com mock data)

> **Importante**: toda esta fase usa dados mockados em `src/lib/mocks/` (arrays TS tipados a partir de `src/types/`). Nenhuma chamada a Supabase ou Stripe ainda. Foco em fluxo, layout, micro-interações, responsividade e acessibilidade básica.

### M02 — Landing Page

- **Branch**: `feat/m02-landing-page`
- **Objetivo**: página pública de apresentação do produto, pronta para captar interesse.
- **Entregas**:
  - [ ] Route group `(marketing)` com layout próprio (sem sidebar do app).
  - [ ] Seção **Hero**: título, subtítulo, CTA "Comece grátis", mockup do produto.
  - [ ] Seção **Funcionalidades**: 4–6 cards com ícones (lucide-react) e descrição.
  - [ ] Seção **Como funciona**: 3 passos visuais.
  - [ ] Seção **Planos e preços**: cards Free vs Pro (R$ 49/mês), CTA por plano.
  - [ ] Seção **CTA final** + footer com links institucionais.
  - [ ] Header público com logo, links âncora e botões Entrar / Começar grátis.
  - [ ] Responsivo mobile-first (testar 375 / 768 / 1280 px).
  - [ ] Metadata SEO: title, description, OpenGraph básico.
- **Commit final**: `feat(marketing): public landing page with hero, features and pricing`

### M03 — Auth UI

- **Branch**: `feat/m03-auth-ui`
- **Objetivo**: telas de autenticação completas com validação client-side, sem integração real ainda.
- **Entregas**:
  - [ ] Route group `(auth)` com layout centralizado (card no centro, branding lateral).
  - [ ] `/login`: e-mail + senha, link "Esqueci minha senha", botão "Entrar com Google" (placeholder).
  - [ ] `/signup`: nome, e-mail, senha (com indicador de força), checkbox de termos.
  - [ ] `/forgot-password`: input de e-mail + tela de confirmação.
  - [ ] `/reset-password?token=...`: nova senha + confirmação.
  - [ ] Validação com `react-hook-form` + `zod`.
  - [ ] Estados de loading e erro nos formulários.
  - [ ] Redirect mockado para `/app` após login bem-sucedido.
  - [ ] Toasts de feedback via Sonner.
- **Commit final**: `feat(auth): login, signup, forgot/reset password screens with validation`

### M04 — App Shell & Navigation

- **Branch**: `feat/m04-app-shell`
- **Objetivo**: layout autenticado com sidebar, header, workspace switcher e rotas placeholder.
- **Entregas**:
  - [ ] Route group `(app)/[workspace]` com layout próprio.
  - [ ] Sidebar fixa (desktop) / Sheet (mobile) com nav: Dashboard, Leads, Pipeline, Atividades, Configurações.
  - [ ] **Workspace switcher** no topo da sidebar (dropdown com workspaces mockados + "Criar workspace").
  - [ ] Header com breadcrumb, busca global (placeholder), notificações, avatar com menu (perfil, configurações, sair).
  - [ ] Theme toggle integrado ao menu do avatar.
  - [ ] Rotas placeholder funcionando: `/[workspace]/dashboard`, `/leads`, `/pipeline`, `/activities`, `/settings`.
  - [ ] Indicador visual de rota ativa na sidebar.
  - [ ] Skeleton de loading para troca de workspace.
- **Commit final**: `feat(app): authenticated shell with sidebar, workspace switcher and routing`

### M05 — Dashboard UI

- **Branch**: `feat/m05-dashboard-ui`
- **Objetivo**: dashboard de métricas com dados mockados, pronto para receber dados reais depois.
- **Entregas**:
  - [ ] Cards de KPI: Total de leads, Negócios abertos, Valor do pipeline (R$), Taxa de conversão (%).
  - [ ] Cada card com ícone, valor grande em JetBrains Mono, variação % vs período anterior.
  - [ ] Gráfico de funil de vendas com Recharts (mock por etapa do pipeline).
  - [ ] Lista "Próximos prazos": deals com `due_date` próximo (mockados).
  - [ ] Filtro de período (7d / 30d / 90d / Customizado).
  - [ ] Empty state quando workspace sem dados.
  - [ ] Responsivo: grid 4 → 2 → 1.
- **Commit final**: `feat(dashboard): metrics cards, funnel chart and upcoming deals`

### M06 — Leads UI

- **Branch**: `feat/m06-leads-ui`
- **Objetivo**: CRUD visual completo de leads com busca, filtros e página de detalhe.
- **Entregas**:
  - [ ] `/leads`: tabela paginada com colunas Nome, Empresa, E-mail, Telefone, Status, Responsável.
  - [ ] Busca global por nome / e-mail / empresa.
  - [ ] Filtros: por status (multi-select), por responsável, por intervalo de data.
  - [ ] Ordenação por coluna.
  - [ ] Botão "Novo lead" → Dialog com formulário (nome, e-mail, telefone, empresa, cargo, status).
  - [ ] Ações inline por linha: editar, excluir (com confirm), ver detalhes.
  - [ ] `/leads/[id]`: página de detalhe com perfil, badges de status, botões de ação.
  - [ ] Placeholder de timeline na página de detalhe (preenchida em M08).
  - [ ] Empty state e skeleton de loading.
- **Commit final**: `feat(leads): list with search/filters, CRUD dialog and detail page`

### M07 — Pipeline Kanban UI

- **Branch**: `feat/m07-pipeline-kanban`
- **Objetivo**: board Kanban de negócios com drag-and-drop funcional sobre estado local.
- **Entregas**:
  - [ ] `@dnd-kit/core` + `@dnd-kit/sortable` instalados.
  - [ ] `/pipeline`: 6 colunas (Novo Lead, Contato, Proposta, Negociação, Ganho, Perdido).
  - [ ] Cards de deal: título, valor em JetBrains Mono, lead vinculado (avatar + nome), responsável, prazo, badge por etapa.
  - [ ] Drag-and-drop entre colunas com animação suave.
  - [ ] Reordenação dentro da mesma coluna.
  - [ ] Botão "+ Novo deal" no topo de cada coluna.
  - [ ] Dialog de criação/edição de deal vinculando a um lead existente.
  - [ ] Click no card → drawer lateral com detalhes do deal.
  - [ ] Filtro por responsável e por intervalo de valor no topo.
  - [ ] Cores de borda das colunas conforme tema (esmeralda para Ganho, vermelho para Perdido, neutros para etapas intermediárias).
- **Commit final**: `feat(pipeline): kanban board with drag-and-drop deal management`

### M08 — Timeline de Atividades UI

- **Branch**: `feat/m08-activities-ui`
- **Objetivo**: timeline cronológica de atividades dentro da página de detalhe do lead.
- **Entregas**:
  - [ ] Componente `<ActivityTimeline />` em `components/features/`.
  - [ ] 4 tipos visuais: ligação (phone), e-mail (mail), reunião (calendar), nota (file-text).
  - [ ] Cada item com autor (avatar + nome), data relativa ("há 2 horas") + tooltip com data absoluta, descrição.
  - [ ] Botão "+ Nova atividade" abre Dialog com seletor de tipo + form contextual.
  - [ ] Filtro por tipo de atividade.
  - [ ] Ordenação decrescente por data (mais recente no topo).
  - [ ] Integrado na página `/leads/[id]` (M06).
  - [ ] Empty state amigável.
- **Commit final**: `feat(activities): chronological timeline in lead detail page`

### M09 — Settings UI

- **Branch**: `feat/m09-settings-ui`
- **Objetivo**: telas de configuração do workspace, perfil e plano (ainda mockado).
- **Entregas**:
  - [ ] `/settings` com tabs: Workspace, Membros, Plano, Perfil.
  - [ ] **Workspace**: nome, descrição, avatar do workspace, botão "Excluir workspace" (com confirm).
  - [ ] **Membros**: lista de colaboradores com papel, botão "Convidar por e-mail" abre Dialog, remover membro.
  - [ ] **Plano**: card mostrando plano atual (Free), uso (X/2 colaboradores, Y/50 leads) com barra de progresso, botão "Fazer upgrade para Pro" (mockado).
  - [ ] **Perfil**: avatar, nome, e-mail, alterar senha.
  - [ ] Alertas visuais quando próximo do limite Free (>80%).
- **Commit final**: `feat(settings): workspace, members, plan and profile management UI`

---

## Fase 3 — Backend (Supabase + integrações)

> A partir daqui, substituir mocks por dados reais. Cada milestone troca uma fatia da UI da Fase 2 por persistência real. Mantemos `src/lib/mocks/` apenas para testes durante a transição.

### M10 — Supabase Schema & RLS

- **Branch**: `feat/m10-supabase-schema`
- **Objetivo**: criar projeto Supabase, schema completo, RLS policies e geração de tipos TS.
- **Entregas**:
  - [ ] Projeto Supabase criado (`supabase init` local + linked com remoto).
  - [ ] Migration `0001_initial_schema.sql` com tabelas: `workspaces`, `workspace_members`, `workspace_invites`, `leads`, `deals`, `activities`, `subscriptions`.
  - [ ] Enums: `member_role` (admin/member), `deal_stage`, `activity_type`, `plan` (free/pro).
  - [ ] FKs com `on delete cascade` apropriados.
  - [ ] Migration `0002_rls_policies.sql` com RLS habilitado em todas as tabelas de domínio.
  - [ ] Policies filtrando por `workspace_id` derivado de `workspace_members` do `auth.uid()`.
  - [ ] Policies separadas para `admin` (full) e `member` (leads/deals/activities only — sem billing/membros).
  - [ ] Tipos TS gerados em `types/database.ts` via `supabase gen types typescript`.
  - [ ] Helper `server/supabase.ts` com clients server e browser.
  - [ ] `.env.example` atualizado com `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
- **Commit final**: `feat(db): supabase schema with RLS policies and generated types`

### M11 — Auth & Workspaces (real)

- **Branch**: `feat/m11-auth-workspaces`
- **Objetivo**: substituir auth mockada por Supabase Auth + fluxo de criação de workspace + onboarding + convites por e-mail via Resend.
- **Entregas**:
  - [ ] Supabase Auth integrado nas telas de M03 (signup, login, recover).
  - [ ] Middleware Next.js protegendo rotas `(app)/`.
  - [ ] Onboarding pós-signup: tela "Crie seu workspace" se usuário não tem nenhum.
  - [ ] Switch de workspace real (lê de `workspace_members`).
  - [ ] Aceitar convite via link `/invite/[token]` (cria `workspace_member` se token válido).
  - [ ] Resend SDK configurado, template de e-mail de convite com branding.
  - [ ] Server action `inviteMember(email, role)` envia e-mail e cria `workspace_invites`.
  - [ ] Remoção de membro (admin only).
  - [ ] Aba Membros em `/settings` conectada ao banco.
- **Commit final**: `feat(auth): supabase auth, workspaces, invites via resend`

### M12 — Leads, Deals & Activities (persistência)

- **Branch**: `feat/m12-domain-persistence`
- **Objetivo**: conectar todas as telas de domínio (Leads, Pipeline, Activities) ao Supabase via Server Actions.
- **Entregas**:
  - [ ] Server actions em `server/leads.ts`: `listLeads`, `getLead`, `createLead`, `updateLead`, `deleteLead`.
  - [ ] Server actions em `server/deals.ts`: `listDeals`, `createDeal`, `updateDeal`, `moveDeal(id, stage)`, `deleteDeal`.
  - [ ] Server actions em `server/activities.ts`: `listActivities(leadId)`, `createActivity`, `deleteActivity`.
  - [ ] Filtros e busca de leads via `ilike` + filtros server-side.
  - [ ] Drag-and-drop do Kanban (M07) chamando `moveDeal` com optimistic update.
  - [ ] Timeline (M08) conectada a `activities`.
  - [ ] Revalidação correta via `revalidatePath` após mutations.
  - [ ] Tratamento de erros com toasts.
  - [ ] Loading states reais (não mais mock skeletons).
- **Commit final**: `feat(domain): persist leads, deals and activities via server actions`

### M13 — Dashboard com dados reais

- **Branch**: `feat/m13-dashboard-real`
- **Objetivo**: substituir mocks do dashboard por queries agregadas reais.
- **Entregas**:
  - [ ] View ou função SQL para métricas agregadas por workspace (total leads, deals abertos, valor do pipeline, conversion rate).
  - [ ] Query do funil agrupando deals por `stage`.
  - [ ] Query de "próximos prazos" filtrando deals com `due_date` próximo do usuário logado.
  - [ ] Filtro de período aplicado nas queries (server-side).
  - [ ] Cache adequado (revalidate em mutations).
  - [ ] Performance: `Promise.all` para queries paralelas no Server Component.
- **Commit final**: `feat(dashboard): connect metrics to live supabase queries`

---

## Fase 4 — Monetização & Deploy

### M14 — Stripe (Checkout + Webhook + Customer Portal)

- **Branch**: `feat/m14-stripe`
- **Objetivo**: monetização completa com checkout, webhook de ativação, portal de gerenciamento e enforce de limites do plano Free.
- **Entregas**:
  - [ ] Conta Stripe (modo test) + produto "Pro" R$ 49/mês.
  - [ ] Server action `createCheckoutSession()` retorna URL do Stripe Checkout.
  - [ ] Botão "Upgrade para Pro" em `/settings` aba Plano funcionando.
  - [ ] Supabase Edge Function `stripe-webhook` em `supabase/functions/stripe-webhook/`.
  - [ ] Webhook trata eventos: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`.
  - [ ] Atualização de `subscriptions` + `workspaces.plan` conforme eventos.
  - [ ] Server action `createPortalSession()` para abrir Customer Portal.
  - [ ] **Enforce de limites no server**:
    - [ ] Bloquear `createLead` quando Free + 50 leads ativos.
    - [ ] Bloquear `inviteMember` quando Free + 2 membros.
  - [ ] Alertas de limite na UI conforme uso (Toast + badge em Settings).
  - [ ] Stripe CLI documentado em `README.md` para testar webhook localmente.
- **Commit final**: `feat(billing): stripe checkout, webhook and plan enforcement`

### M15 — Polimento, Acessibilidade, Testes & Deploy

- **Branch**: `feat/m15-polish-and-deploy`
- **Objetivo**: deixar o produto pronto para produção: acessibilidade WCAG 2.2, testes críticos, otimizações e deploy real.
- **Entregas**:
  - [ ] Auditoria WCAG 2.2: foco visível, contraste mínimo, navegação por teclado em todas as telas.
  - [ ] Testes E2E críticos com Playwright: signup → criar workspace → criar lead → criar deal → mover no kanban → upgrade Stripe.
  - [ ] Testes unitários (Vitest) para utils críticos: cálculo de métricas, enforce de limites, parsers.
  - [ ] Bundle analysis (`@next/bundle-analyzer`); remover imports não utilizados.
  - [ ] Otimização de imagens (`next/image` em todo lugar).
  - [ ] `loading.tsx` e `error.tsx` por rota.
  - [ ] Metadata por rota (title, description).
  - [ ] Projeto Vercel linkado + variáveis de ambiente configuradas (production).
  - [ ] Projeto Supabase Production criado, migrations aplicadas, RLS validadas.
  - [ ] Stripe migrado para modo live + webhook de produção apontado para Supabase Edge.
  - [ ] Domínio customizado (se aplicável).
  - [ ] Deploy validado em produção: smoke test do fluxo completo.
  - [ ] `README.md` final com setup local, variáveis de ambiente, deploy.
- **Commit final**: `chore: production-ready polish, e2e tests and vercel deploy`

---

## Resumo Visual

| Fase | Milestone | Branch | Foco |
| --- | --- | --- | --- |
| 1 | M01 | `feat/m01-setup` | Setup + Design System |
| 2 | M02 | `feat/m02-landing-page` | Landing |
| 2 | M03 | `feat/m03-auth-ui` | Auth UI |
| 2 | M04 | `feat/m04-app-shell` | App Shell |
| 2 | M05 | `feat/m05-dashboard-ui` | Dashboard UI |
| 2 | M06 | `feat/m06-leads-ui` | Leads UI |
| 2 | M07 | `feat/m07-pipeline-kanban` | Pipeline Kanban UI |
| 2 | M08 | `feat/m08-activities-ui` | Activities UI |
| 2 | M09 | `feat/m09-settings-ui` | Settings UI |
| 3 | M10 | `feat/m10-supabase-schema` | Supabase Schema |
| 3 | M11 | `feat/m11-auth-workspaces` | Auth + Workspaces |
| 3 | M12 | `feat/m12-domain-persistence` | Domain Persistence |
| 3 | M13 | `feat/m13-dashboard-real` | Dashboard Real |
| 4 | M14 | `feat/m14-stripe` | Stripe |
| 4 | M15 | `feat/m15-polish-and-deploy` | Deploy |

**Total**: 15 milestones, 15 branches, 15 PRs.

## Pós-MVP (fora deste plano)

Ideias para iterações futuras, registradas para não esquecer — não fazem parte do escopo dos 15 milestones acima:

- Integração com WhatsApp Business / e-mail (envio direto pelo CRM).
- Automações simples (ex.: mover deal para "Negociação" após X dias parado).
- Importação CSV de leads.
- Relatórios exportáveis (PDF/CSV).
- API pública + webhooks para integrações de terceiros.
- App mobile (React Native ou PWA).
