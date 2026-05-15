# PipeFlow CRM

CRM de vendas para PMEs, freelancers e times de vendas. Pipeline Kanban, gestão de leads, monetização via Stripe.

## Stack

- Next.js 14 (App Router) + TypeScript 5
- Tailwind CSS + shadcn/ui (tema customizado)
- Supabase (PostgreSQL + Auth + RLS)
- Stripe (Checkout + Webhooks)
- Resend (e-mails transacionais)

## Desenvolvimento local

```bash
# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env.local

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Comandos

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Servir build de produção
npm run lint         # Lint (ESLint)
npm run typecheck    # Verificação de tipos (tsc --noEmit)
npm run format       # Formatar com Prettier
npm run format:check # Verificar formatação
```

## Supabase local

```bash
npx supabase start                    # Iniciar Supabase local
npx supabase migration new <nome>     # Nova migration
npx supabase gen types typescript     # Gerar tipos TS
```

## Documentação

- [docs/PRD.md](docs/PRD.md) — Requisitos do produto
- [docs/PLAN.md](docs/PLAN.md) — Plano de execução por milestones
- [CLAUDE.md](CLAUDE.md) — Briefing técnico
