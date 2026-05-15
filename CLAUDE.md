# CLAUDE.md — PipeFlow CRM

> Briefing técnico do projeto para agentes Claude Code e devs. Para escopo de produto, funcionalidades e personas, consulte [docs/PRD.md](docs/PRD.md).

## Visão Geral

SaaS de CRM para PMEs, freelancers e times de vendas. Multi-empresa, pipeline Kanban, monetização via Stripe. Posicionamento: alternativa **freemium acessível** ao HubSpot e Pipedrive, focada exclusivamente em vendas (sem marketing automation).

Personas-chave: Admin (dono do negócio), Membro (vendedor) e Admin solo (freelancer com múltiplos workspaces).

## Stack Técnica

- **Next.js 14** (App Router) + **React 18** + **TypeScript 5** (strict mode)
- **Tailwind CSS** + **shadcn/ui** (tema customizado — ver Identidade Visual)
- **Supabase** (PostgreSQL + Auth + RLS) — multi-tenancy via RLS
- **Stripe** (Checkout + Webhooks via Supabase Edge Functions)
- **Resend** (e-mails transacionais — convites de workspace, notificações)
- **@dnd-kit** (drag-and-drop do Kanban)
- **Recharts** (gráficos do dashboard)
- **Deploy**: Vercel (frontend) + Supabase (DB/auth/edge)
- **Versionamento**: Git + GitHub

## Estrutura de Pastas

```
src/
├── app/                    # App Router (rotas, layouts, pages)
│   ├── (marketing)/        # Landing page pública
│   ├── (auth)/             # Login, signup, recover
│   ├── (app)/              # Área autenticada
│   │   └── [workspace]/    # Rotas escopadas por workspace ativo
│   │       ├── dashboard/
│   │       ├── leads/
│   │       ├── pipeline/
│   │       └── settings/
│   └── api/                # Route handlers (webhooks externos)
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   └── features/           # Componentes de domínio (LeadCard, KanbanBoard, DealForm…)
├── lib/                    # Utils puros, helpers, constants
├── server/                 # Queries Supabase, server actions, Stripe SDK
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript types compartilhados (Lead, Deal, Workspace…)
└── styles/                 # globals.css + tokens do tema
supabase/
├── migrations/             # Schemas SQL versionados
└── functions/              # Edge Functions (ex: stripe-webhook)
docs/
└── PRD.md                  # Documento de requisitos canônico
```

## Convenções de Código

- **Arquivos**: kebab-case (`lead-card.tsx`, `use-pipeline.ts`).
- **Componentes**: PascalCase (`LeadCard`, `KanbanBoard`).
- **Funções/variáveis**: camelCase (`getLeads`, `createDeal`).
- **Constantes**: UPPER_SNAKE_CASE (`MAX_FREE_LEADS = 50`).
- **Tipos/Interfaces**: PascalCase (`Lead`, `Deal`, `Workspace`).
- TypeScript **strict mode** obrigatório; evitar `any` (preferir `unknown` + type guards).
- **Server Components por padrão**; `'use client'` apenas onde necessário (interatividade, hooks de estado, libs client-only como @dnd-kit).
- **Server Actions** para mutations; **Route Handlers** só para webhooks externos (Stripe, Resend).
- Imports absolutos via `@/` (ex: `import { supabase } from '@/server/supabase'`).
- ESLint + Prettier; 2 espaços de indentação; aspas simples; trailing commas.

## Identidade Visual

**Diferenciação**: enquanto HubSpot e Pipedrive são azuis e corporativos, o PipeFlow adota uma estética **vibrante, moderna e dark-first**.

| Token | Hex / Classe Tailwind | Uso |
| --- | --- | --- |
| Cor primária | `#F97316` (`orange-500`) | CTAs, links ativos, destaques |
| Cor secundária | `#FF6B35` (coral) | Hover/acento da primária |
| Acento | `#F59E0B` (`amber-500`) | Badges, métricas em destaque |
| Sucesso (ganho) | `#10B981` (`emerald-500`) | Etapa "Fechado Ganho", indicadores positivos |
| Erro (perdido) | `#EF4444` (`red-500`) | Etapa "Fechado Perdido", validação |
| Fundo dark | `zinc-950` / `zinc-900` | Background do app em dark mode |
| Fundo light | `white` / `zinc-50` | Background em light mode |
| Texto principal | `zinc-50` (dark) / `zinc-900` (light) | Conteúdo |
| Texto secundário | `zinc-400` (dark) / `zinc-500` (light) | Labels, captions |

- **Tipografia**: **Inter** (UI geral) + **JetBrains Mono** (números, valores monetários, métricas).
- **Tom de voz**: moderno, energético, direto. Microcopy em pt-BR coloquial — falar com o usuário, não com o jurídico.
- **shadcn/ui**: instalar com tema customizado; tokens HSL definidos em `src/styles/globals.css` mapeando as variáveis acima.
- **Dark mode = padrão**; light mode disponível via toggle no header.

## Multi-tenancy & Segurança

- Cada workspace = linha em `workspaces` + relação N:N com `users` via `workspace_members` (com `role`).
- Toda tabela de domínio (`leads`, `deals`, `activities`) tem coluna `workspace_id` (FK obrigatória).
- **RLS obrigatório** em todas as tabelas de domínio — políticas filtrando por `workspace_id` derivado do JWT do Supabase Auth.
- Papéis:
  - `admin`: CRUD total + billing + convites de membros.
  - `member`: CRUD de leads, deals e atividades; sem acesso a billing/membros.
- Convites por e-mail via Resend, com token de expiração armazenado em `workspace_invites`.
- Switch de workspace ativo persistido em cookie/localStorage; rotas vivem sob `[workspace]` para deixar o escopo explícito na URL.

## Planos & Limites

- **Free**: máximo 2 colaboradores e 50 leads ativos por workspace.
- **Pro** (R$ 49/mês): colaboradores e leads ilimitados.
- **Enforce de limites no server** (server actions / RLS policies) — nunca confiar no cliente.
- Stripe Customer Portal para self-service (upgrade, downgrade, cancelamento, atualização de cartão).
- Webhook do Stripe (Supabase Edge Function) atualiza `subscriptions.status` e `workspaces.plan`.

## Idioma

- **Código, identificadores, comentários técnicos**: inglês.
- **UI, microcopy, mensagens ao usuário final, documentação de produto**: pt-BR.
- **Respostas do assistente (Claude Code)**: pt-BR (conforme CLAUDE.md global em `c:\claude\CLAUDE.md`).

## Milestones (Roadmap)

1. **Scaffold**: `create-next-app`, Tailwind, shadcn/ui (tema custom), Supabase client, ESLint/Prettier.
2. **Auth + Workspaces**: signup/login, criação de workspace, RLS base, switch de workspace.
3. **Leads**: CRUD completo + busca + filtros + paginação.
4. **Pipeline Kanban**: board com @dnd-kit, persistência de movimentação entre etapas.
5. **Atividades**: timeline cronológica vinculada ao lead (ligação, e-mail, reunião, nota).
6. **Dashboard**: cards de métricas + funil em Recharts.
7. **Colaboração**: convites por e-mail via Resend, papéis Admin/Membro, multi-workspace switcher.
8. **Monetização**: Stripe Checkout + Webhook + Customer Portal + enforce de limites Free/Pro.
9. **Landing page**: hero, features, preços, CTA.
10. **Polimento**: testes, acessibilidade (WCAG 2.2), bundle analysis, deploy de produção.

## Comandos de Desenvolvimento

```bash
npm run dev            # Servidor de desenvolvimento (http://localhost:3000)
npm run build          # Build de produção (usa cross-env NODE_ENV=production)
npm run start          # Servir build de produção
npm run lint           # ESLint
npm run typecheck      # tsc --noEmit
npm run format         # Prettier --write
npm run format:check   # Prettier --check

# Supabase local (a partir do M10)
npx supabase start
npx supabase migration new <nome>
npx supabase gen types typescript --local > src/types/database.ts
```

> **Atenção**: O ambiente tem `NODE_ENV=development` definido globalmente. O script `build` usa `cross-env NODE_ENV=production` para garantir o build correto. Sempre use `npm run build`, nunca `next build` diretamente.

## Referências

- [docs/PRD.md](docs/PRD.md) — requisitos completos, personas, design language detalhado.
- CLAUDE.md global em `c:\claude\CLAUDE.md` — instruções de ambiente (shell, idioma de resposta).
