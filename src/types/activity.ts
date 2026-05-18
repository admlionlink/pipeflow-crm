export type ActivityType = 'call' | 'email' | 'meeting' | 'note'

export interface Activity {
  id: string
  leadId: string
  type: ActivityType
  title: string
  description?: string
  authorName: string
  createdAt: string
}
