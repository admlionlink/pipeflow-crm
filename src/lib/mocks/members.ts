import { type MemberRole } from '@/types/workspace'

export interface WorkspaceMember {
  id: string
  userId: string
  name: string
  email: string
  role: MemberRole
  joinedAt: string
}

export const MOCK_MEMBERS: WorkspaceMember[] = [
  {
    id: 'm1',
    userId: 'u1',
    name: 'Andrea Rouca',
    email: 'andrea@agenciacriativa.com',
    role: 'admin',
    joinedAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'm2',
    userId: 'u2',
    name: 'Rafael Melo',
    email: 'rafael@agenciacriativa.com',
    role: 'member',
    joinedAt: '2026-02-20T09:00:00Z',
  },
]

export const CURRENT_USER_ID = 'u1'
