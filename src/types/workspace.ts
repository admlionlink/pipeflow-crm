export type Plan = 'free' | 'pro'
export type MemberRole = 'admin' | 'member'

export interface Workspace {
  id: string
  name: string
  slug: string
  plan: Plan
}
