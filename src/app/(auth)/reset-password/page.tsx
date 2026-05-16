import type { Metadata } from 'next'
import { ResetPasswordForm } from '@/components/features/auth/reset-password-form'

export const metadata: Metadata = {
  title: 'Redefinir senha — PipeFlow CRM',
}

export default function ResetPasswordPage() {
  return <ResetPasswordForm />
}
