import { type Activity } from '@/types/activity'

export const MOCK_ACTIVITIES: Activity[] = [
  // Lead l1 — Carlos Eduardo Silva (negociando)
  {
    id: 'a1',
    leadId: 'l1',
    type: 'call',
    title: 'Ligação de prospecção',
    description: 'Apresentei o produto e expliquei os diferenciais do PipeFlow em relação ao Pipedrive.',
    authorName: 'Andrea Rouca',
    createdAt: '2026-05-10T10:30:00Z',
  },
  {
    id: 'a2',
    leadId: 'l1',
    type: 'email',
    title: 'Envio de proposta comercial',
    description: 'Enviei proposta comercial com os planos disponíveis e tabela comparativa de funcionalidades.',
    authorName: 'Andrea Rouca',
    createdAt: '2026-05-12T14:15:00Z',
  },
  {
    id: 'a3',
    leadId: 'l1',
    type: 'meeting',
    title: 'Reunião de alinhamento técnico',
    description: 'Reunião com a equipe de TI via Google Meet. Demonstração do pipeline Kanban aprovada.',
    authorName: 'Andrea Rouca',
    createdAt: '2026-05-14T09:00:00Z',
  },

  // Lead l2 — Mariana Oliveira Santos (qualificado)
  {
    id: 'a4',
    leadId: 'l2',
    type: 'note',
    title: 'Registro de indicação',
    description: 'Lead veio via indicação da Fernanda Lima da Construtora JK. Demonstrou interesse imediato.',
    authorName: 'Andrea Rouca',
    createdAt: '2026-05-08T11:00:00Z',
  },
  {
    id: 'a5',
    leadId: 'l2',
    type: 'email',
    title: 'Envio de material de apresentação',
    description: 'Enviamos material de apresentação completo e dois cases de sucesso de empresas similares.',
    authorName: 'Andrea Rouca',
    createdAt: '2026-05-11T16:30:00Z',
  },

  // Lead l3 — Rafael Mendes Costa (contatado)
  {
    id: 'a6',
    leadId: 'l3',
    type: 'call',
    title: 'Contato inicial via cold call',
    description: 'Primeiro contato via cold call. Demonstrou interesse no plano Pro mas quer testar primeiro.',
    authorName: 'Rafael Melo',
    createdAt: '2026-05-05T09:00:00Z',
  },
  {
    id: 'a7',
    leadId: 'l3',
    type: 'note',
    title: 'Follow-up agendado',
    description: 'Acordado que ele vai testar o plano Free por 30 dias. Follow-up agendado para 05/06.',
    authorName: 'Rafael Melo',
    createdAt: '2026-05-05T15:00:00Z',
  },

  // Lead l4 — Fernanda Lima Sousa (convertido)
  {
    id: 'a8',
    leadId: 'l4',
    type: 'call',
    title: 'Negociação finalizada',
    description: 'Negociação finalizada. Fechou o plano Pro anual com desconto de 10%.',
    authorName: 'Andrea Rouca',
    createdAt: '2026-04-25T10:00:00Z',
  },
  {
    id: 'a9',
    leadId: 'l4',
    type: 'meeting',
    title: 'Onboarding realizado',
    description: 'Onboarding inicial concluído. Importamos os leads do Excel e configuramos o pipeline.',
    authorName: 'Andrea Rouca',
    createdAt: '2026-04-30T14:00:00Z',
  },
  {
    id: 'a10',
    leadId: 'l4',
    type: 'note',
    title: 'Indicação recebida',
    description: 'Cliente satisfeita com o produto. Pediu para indicar a Mariana Santos do Grupo Supremo.',
    authorName: 'Andrea Rouca',
    createdAt: '2026-05-03T11:30:00Z',
  },

  // Lead l5 — Paulo Roberto Alves (novo)
  {
    id: 'a11',
    leadId: 'l5',
    type: 'email',
    title: 'Primeiro contato por e-mail',
    description: 'Enviamos apresentação inicial do PipeFlow com os planos disponíveis. Aguardando retorno.',
    authorName: 'Rafael Melo',
    createdAt: '2026-05-13T09:00:00Z',
  },

  // Lead l6 — Juliana Ferreira Rocha (negociando)
  {
    id: 'a12',
    leadId: 'l6',
    type: 'call',
    title: 'Ligação inicial',
    description: 'Ligação inicial muito receptiva. Está avaliando PipeFlow vs Pipedrive. Time de 8 vendedores.',
    authorName: 'Andrea Rouca',
    createdAt: '2026-05-07T10:00:00Z',
  },
  {
    id: 'a13',
    leadId: 'l6',
    type: 'meeting',
    title: 'Demonstração do produto',
    description: 'Demo completo realizado via Google Meet. Todo o time de vendas assistiu e aprovou.',
    authorName: 'Andrea Rouca',
    createdAt: '2026-05-10T15:00:00Z',
  },
  {
    id: 'a14',
    leadId: 'l6',
    type: 'email',
    title: 'Respostas às dúvidas técnicas',
    description: 'Respondemos todas as dúvidas sobre integrações e exportação de dados enviadas pela equipe.',
    authorName: 'Andrea Rouca',
    createdAt: '2026-05-12T09:00:00Z',
  },
]
