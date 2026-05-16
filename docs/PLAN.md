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
  - [x] `npx create-next-app@latest` (App Router, TS, Tailwind, src/, ESLint, alias `@/`).
  - [x] Estrutura de pastas conforme [CLAUDE.md](../CLAUDE.md): `app/`, `components/ui`, `components/features`, `lib/`, `server/`, `hooks/`, `types/`, `styles/`.
  - [x] Prettier configurado + script `format` (2 espaços, aspas simples, trailing commas).
  - [x] `shadcn/ui` inicializado com tema customizado (tokens HSL para laranja `#F97316`, coral, âmbar, esmeralda, vermelho).
  - [x] Dark mode como padrão via `next-themes`, com toggle.
  - [x] Fontes **Inter** + **JetBrains Mono** via `next/font`.
  - [x] `globals.css` com tokens do design system (cores, espaçamentos, radius).
  - [x] Componentes base shadcn instalados: `button`, `input`, `label`, `card`, `dialog`, `dropdown-menu`, `sheet`, `tabs`, `badge`, `avatar`, `tooltip`, `sonner` (toast).
  - [x] Página `/` placeholder confirmando tema aplicado e fontes carregadas.
  - [x] `.env.example` criado (estrutura vazia).
  - [x] `README.md` mínimo com `npm run dev` e link para `docs/`.
  - [x] `.gitignore` cobrindo `.env*`, `node_modules`, `.next`, `dist`.
- **Commit final**: `chore: bootstrap Next.js 14 + Tailwind + shadcn/ui with PipeFlow theme`

---

## Fase 2 — Interface (UI-first com mock data)

> **Importante**: toda esta fase usa dados mockados em `src/lib/mocks/` (arrays TS tipados a partir de `src/types/`). Nenhuma chamada a Supabase ou Stripe ainda. Foco em fluxo, layout, micro-interações, responsividade e acessibilidade básica.

### M02 — Landing Page

- **Branch**: `feat/m02-landing-page` ✅ mergeado em `main`
- **Objetivo**: página pública de apresentação do produto, pronta para captar interesse.
- **Entregas**:
  - [x] Route group `(marketing)` com layout próprio (sem sidebar do app).
  - [x] Seção **Hero**: título, subtítulo, CTA "Comece grátis", pipeline viz terminal.
  - [x] Seção **Funcionalidades**: 6 cards com número indexado e descrição.
  - [x] Seção **Cases de Sucesso**: 3 cards com métrica, citação e autor.
  - [x] Seção **Planos e preços**: cards Free vs Pro (R$ 49/mês), CTA por plano.
  - [x] Seção **CTA final** + footer com links institucionais.
  - [x] Header público com logo, links âncora e botões Entrar / Começar grátis.
  - [x] Responsivo mobile-first (375 / 768 / 1280 px) + menu hamburger.
  - [x] Metadata SEO: title, description, OpenGraph básico.
  - [x] Componentes compartilhados: `Logo`, `WaveSeparator`, `AnimateOnScroll`.
  - [x] Classes CSS: `pf-orb`, `pf-glow-btn`, `pf-page-enter`, `pf-flow-pulse`.
- **Commit final**: `feat(marketing): public landing page with hero, features and pricing`

### M03 — Auth UI

- **Branch**: `feat/m03-complete-auth` ✅ mergeado em `main`
- **Objetivo**: telas de autenticação completas com validação client-side, sem integração real ainda.
- **Entregas**:
  - [x] Route group `(auth)` com layout centralizado (card no centro, branding lateral).
  - [x] `/login`: e-mail + senha, link "Esqueci minha senha", botão "Entrar com Google" (placeholder).
  - [x] `/signup`: nome, e-mail, senha (com indicador de força), checkbox de termos.
  - [x] `/forgot-password`: input de e-mail + tela de confirmação ("Verifique seu e-mail").
  - [x] `/reset-password?token=...`: nova senha + confirmação com strength meter.
  - [x] Validação com `react-hook-form` + `zod`.
  - [x] Estados de loading e erro nos formulários.
  - [x] Redirect mockado para `/onboarding` → dashboard após login bem-sucedido.
  - [x] Toasts de feedback via Sonner.
- **Commit final**: `feat(auth): login, signup, forgot/reset password screens with validation`

### M04 — App Shell & Navigation

- **Branch**: `feat/m04-app-shell`
- **Objetivo**: layout autenticado com sidebar, header, workspace switcher e rotas placeholder.
- **Entregas**:
  - [x] Route group `(app)/[workspace]` com layout próprio.
  - [x] Sidebar fixa (desktop) / Sheet (mobile) com nav: Dashboard, Leads, Pipeline, Atividades, Configurações.
  - [x] **Workspace switcher** no topo da sidebar (dropdown com workspaces mockados + "Criar workspace").
  - [x] Header com breadcrumb, busca global (placeholder), notificações, avatar com menu (perfil, configurações, sair).
  - [x] Theme toggle integrado ao menu do avatar.
  - [x] Rotas placeholder funcionando: `/[workspace]/dashboard`, `/leads`, `/pipeline`, `/activities`, `/settings`.
  - [x] Indicador visual de rota ativa na sidebar.
  - [x] Skeleton de loading para troca de workspace.
- **Commit final**: `feat(app): authenticated shell with sidebar, workspace switcher and routing`

### M05 — Dashboard UI

- **Branch**: `feat/m05-dashboard-ui` ✅ mergeado em `main` — PR #6
- **Objetivo**: dashboard de métricas com dados mockados, pronto para receber dados reais depois.
- **Entregas**:
  - [x] Cards de KPI: Total de leads, Negócios abertos, Valor do pipeline (R$), Taxa de conversão (%).
  - [x] Cada card com ícone, valor grande em JetBrains Mono, variação % vs período anterior.
  - [x] Gráfico de barras verticais por etapa do pipeline com Recharts (6 estágios incluindo Perdido).
  - [x] Tabela full-width "Negócios com Prazo Próximo" com colunas Negócio / Lead / Etapa / Prazo / Valor.
  - [x] Filtro de período (7d / 30d / 90d) via URL search param.
  - [x] Empty state na tabela quando sem prazos próximos.
  - [x] Responsivo: grid 4 → 2 → 1.
- **Commit final**: `feat(dashboard): metrics cards, funnel chart and upcoming deals`

### M06 — Leads UI

- **Branch**: `feat/m06-leads-ui` ✅ mergeado em `main` — PR #4
- **Objetivo**: CRUD visual completo de leads com busca, filtros e página de detalhe.
- **Entregas**:
  - [x] `/leads`: tabela paginada com colunas Nome, Empresa, E-mail, Telefone, Status, Responsável.
  - [x] Busca global por nome / e-mail / empresa.
  - [x] Filtros: por status (multi-select), por responsável, por intervalo de data.
  - [x] Ordenação por coluna.
  - [x] Botão "Novo lead" → Dialog com formulário (nome, e-mail, telefone, empresa, cargo, status, valor estimado, notas).
  - [x] Ações inline por linha: editar, excluir (com confirm), ver detalhes.
  - [x] `/leads/[id]`: página de detalhe com perfil centralizado, badges de status, valor estimado, botão Editar funcional.
  - [x] Timeline de atividades visual com título, tipo, data absoluta pt-BR e autor (antecipa M08).
  - [x] Empty state e paginação (8 itens/página).
- **Commit final**: `feat(leads): list with search/filters, CRUD dialog and detail page`

### M07 — Pipeline Kanban UI

- **Branch**: `feat/m07-pipeline-kanban` ✅ mergeado em `main` — PR #5
- **Objetivo**: board Kanban de negócios com drag-and-drop funcional sobre estado local.
- **Entregas**:
  - [x] `@dnd-kit/core` + `@dnd-kit/sortable` + `@dnd-kit/utilities` instalados.
  - [x] `/pipeline`: 6 colunas (Novo Lead, Contato Realizado, Proposta Enviada, Negociação, Fechado, Perdido).
  - [x] Cards de deal: título "Negócio — Empresa", valor em JetBrains Mono na cor do estágio, contato (avatar + nome), responsável na cor do estágio, prazo com badge "Vencido" quando expirado.
  - [x] Drag-and-drop entre colunas com animação suave (DragOverlay rotacionado).
  - [x] Botão "+ Novo deal" no topo de cada coluna e no header da página.
  - [x] Dialog de criação e edição de deal (título, contato, empresa, valor, etapa, responsável, prazo, notas).
  - [x] Click no card → drawer lateral com detalhes completos do deal.
  - [x] Botão Editar funcional na sheet e nos três pontinhos do card.
  - [x] Cores de topo das colunas conforme tema (azul → Novo, cyan → Contato, âmbar → Proposta, laranja → Negociação, esmeralda → Fechado, vermelho → Perdido).
  - [x] Cor do estágio propagada para: barra de topo, label, total da coluna, valor do card e responsável.
  - [x] Tailwind `content` expandido para cobrir `src/types/` e `src/lib/` (fix de purge de classes dinâmicas).
  - [ ] Reordenação dentro da mesma coluna — não implementado (deferred).
  - [ ] Filtro por responsável e intervalo de valor — não implementado (deferred).
- **Commit final**: `feat(pipeline): kanban board with drag-and-drop deal management`

### M08 — Timeline de Atividades UI

- **Branch**: `feat/m08-activity-dialog` ✅ mergeado em `main`
- **Objetivo**: timeline cronológica de atividades dentro da página de detalhe do lead.
- **Entregas**:
  - [x] Componente `<ActivityTimeline />` em `components/features/`.
  - [x] 4 tipos visuais: ligação (phone), e-mail (mail), reunião (calendar), nota (file-text).
  - [x] Cada item com autor (avatar + nome), data relativa ("há X horas") + tooltip com data absoluta.
  - [x] Botão "+ Nova atividade" abre Dialog com seletor de tipo + form contextual (título, descrição, campo extra por tipo).
  - [x] Filtro por tipo de atividade.
  - [x] Ordenação decrescente por data (mais recente no topo).
  - [x] Integrado na página `/leads/[id]` (M06).
  - [x] Empty state amigável.
- **Commit final**: `feat(activities): chronological timeline in lead detail page`

### M09 — Settings UI

- **Branch**: `feat/m09-settings-ui` ✅ mergeado em `main`
- **Objetivo**: telas de configuração do workspace, perfil e plano (ainda mockado).
- **Entregas**:
  - [x] `/settings` com tabs: Workspace, Membros, Plano, Perfil.
  - [x] **Workspace**: nome + slug com form validado, botão "Excluir workspace" com Dialog de confirmação.
  - [x] **Membros**: lista com papel (Admin/Membro), botão "Convidar" abre Dialog com e-mail + role, remover membro.
  - [x] **Plano**: card do plano atual, barras de progresso (membros X/2, leads Y/50), alerta >80%, botão upgrade.
  - [x] **Perfil**: avatar, form de nome/e-mail, form de alteração de senha com PasswordStrength.
  - [x] Alertas visuais quando próximo do limite Free (>80%).
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
