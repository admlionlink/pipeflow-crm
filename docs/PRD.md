# PRD — PipeFlow CRM

## 1. Contexto & Problema

Pequenas e médias empresas, freelancers e times de vendas perdem oportunidades de negócio por falta de organização no processo comercial. Leads são gerenciados em planilhas, anotações soltas ou ferramentas genéricas que não oferecem visão clara do funil de vendas. Não há registro centralizado de interações com clientes, e quando a equipe cresce, os dados ficam espalhados sem controle de acesso por empresa/time. Soluções como HubSpot e Pipedrive existem, mas são caras ou complexas demais para quem está começando.

## 2. Solução Proposta

Construir o **PipeFlow CRM** — uma plataforma web SaaS de gestão de clientes e vendas, multi-empresa, com pipeline visual Kanban, gestão completa de leads e negócios, registro de interações e integração de pagamento para monetização.

A solução incluirá:

- CRM completo com cadastro de leads/contatos (nome, e-mail, telefone, empresa, cargo).
- Pipeline Kanban de vendas com drag-and-drop entre etapas (Novo Lead → Contato → Proposta → Negociação → Fechado Ganho/Perdido).
- Página de detalhe do lead com histórico completo de atividades (ligações, e-mails, reuniões, notas).
- Sistema multi-empresa: cada workspace isolado, com convite de colaboradores por e-mail.
- Dashboard com métricas de vendas: total de leads, negócios abertos, valor do pipeline, taxa de conversão, gráfico de funil.
- Monetização via planos de assinatura: Free (até 2 colaboradores, 50 leads) e Pro (ilimitado, R$ 49/mês).
- Landing page de apresentação do produto.

## 3. Requisitos Funcionais

**Visão geral dos módulos:**

- Login e Autenticação
- Kanban
- Dashboards
- Multi usuário
- Multi empresa
- Permissões por usuário
- Parte premium (paga)
- Integrações (API)
- Onboarding do Usuário
- Landing Page
- Busca e Filtros

### Gestão de Leads e Contatos

- Cadastro completo: nome, e-mail, telefone, empresa, cargo, status.
- Listagem com busca e filtros (por status, responsável, data).
- Página de detalhe com perfil completo e timeline de atividades.

### Pipeline Kanban de Vendas

- Colunas por etapa: Novo Lead, Contato Realizado, Proposta Enviada, Negociação, Fechado Ganho, Fechado Perdido.
- Cards de negócios com título, valor estimado (R$), lead vinculado, responsável e prazo.
- Drag-and-drop entre etapas com persistência no banco.

### Registro de Atividades

- Tipos: ligação, e-mail, reunião, nota.
- Campos: autor, descrição, data.
- Timeline cronológica vinculada ao lead.

### Dashboard de Métricas

- Cards: total de leads, negócios abertos, valor total do pipeline, taxa de conversão.
- Gráfico de funil de vendas (Recharts).
- Negócios do usuário logado com prazo próximo.

### Multi-empresa e Colaboração

- Criar workspaces (cada empresa/time = 1 workspace).
- Convite de colaboradores por e-mail (com Resend).
- Papéis: Admin (tudo) e Membro (leads e negócios).
- Alternar entre workspaces via dropdown na sidebar.
- Isolamento de dados via Row Level Security (RLS) no Supabase.

### Monetização (Stripe)

- Plano Free: até 2 colaboradores, 50 leads.
- Plano Pro: colaboradores e leads ilimitados (R$ 49/mês).
- Checkout integrado via Stripe Checkout.
- Webhook para ativar/desativar plano automaticamente (Supabase Edge Function).
- Customer Portal do Stripe para gerenciamento de assinatura.

### Landing Page

- Página pública de apresentação do PipeFlow CRM.
- Seções: hero, funcionalidades, planos/preços, CTA.

## 4. Personas

### Dono do Negócio / Empreendedor (Admin)

Pequeno empresário que precisa organizar seu processo de vendas. Cria o workspace, convida o time, gerencia planos e tem acesso completo a todas as funcionalidades.

### Vendedor / Colaborador (Membro)

Profissional de vendas que usa o CRM no dia a dia. Cadastra leads, move negócios no pipeline, registra atividades. Pode participar de múltiplos workspaces.

### Freelancer / Consultor (Admin solo)

Profissional independente que atende vários clientes. Usa workspaces separados para cada cliente/projeto. Começa no plano Free e faz upgrade conforme cresce.

## 5. Stack Técnica

**Resumo das tecnologias:**

- Next.js
- React
- Tailwind CSS
- shadcn/ui
- Supabase
- Stripe
- Vercel
- Claude Code
- Node.js
- PostgreSQL
- TypeScript
- Resend (e-mails)

**Detalhamento por camada e custo:**

| Camada | Tecnologia | Custo |
| --- | --- | --- |
| Frontend | Next.js 14 (App Router) + React 18 + Tailwind CSS + shadcn/ui | Gratuito |
| Backend/API | Next.js API Routes (Server Components) | Gratuito |
| Banco de Dados + Auth | Supabase (PostgreSQL + RLS + Auth) | Free tier / Pro US$ 25/mês |
| Pagamento | Stripe (checkout + webhooks) | Taxa por transação (~2.9% + US$ 0.30) |
| E-mail transacional | Resend | Free tier (100 e-mails/dia) |
| Drag-and-drop | @dnd-kit | Gratuito (open source) |
| Gráficos | Recharts | Gratuito (open source) |
| Versionamento | Git + GitHub | Gratuito |
| Deploy | Vercel (frontend) + Supabase (backend/DB) | Free tier |
| IDE | Cursor com Claude Code no terminal | Anthropic Pro US$ 20/mês |
| Linguagem | TypeScript 5 | — |

## 6. Design Language

Referências: **HubSpot CRM**, **Pipedrive**, **DataCrazy**.

### HubSpot CRM

- CRM gratuito mais popular do mercado.
- Pipeline visual, gestão de contatos, automações de marketing.
- **Pontos fortes**: ecossistema completo (marketing + vendas + atendimento), integrações abundantes.
- **Pontos fracos**: complexo demais para PMEs, planos pagos muito caros (US$ 45–800/mês), curva de aprendizado alta.
- **Insight**: simplificar a experiência focando apenas em vendas, sem marketing automation.

### Pipedrive

- CRM focado em vendas com pipeline visual excelente.
- **Pontos fortes**: UX intuitiva, pipeline Kanban referência de mercado, foco em ação (activities-driven).
- **Pontos fracos**: sem plano gratuito (US$ 14–99/mês), funcionalidades avançadas travadas em planos caros.
- **Insight**: nosso pipeline Kanban se inspira no Pipedrive, mas com modelo freemium acessível.

## 7. Processo

- Quebrar o build do app em milestones lógicos (etapas).
- Cada milestone deve ser um incremento entregável.
- Priorizar funcionalidades core primeiro, depois iterar.
- Testar cada milestone antes de avançar para o próximo.
