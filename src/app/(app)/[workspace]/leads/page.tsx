import { LeadsView } from '@/components/features/leads/leads-view'

interface LeadsPageProps {
  params: { workspace: string }
}

export default function LeadsPage({ params }: LeadsPageProps) {
  return <LeadsView workspaceSlug={params.workspace} />
}
