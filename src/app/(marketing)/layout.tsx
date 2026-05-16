import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s — PipeFlow CRM',
    default: 'PipeFlow CRM',
  },
}

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
