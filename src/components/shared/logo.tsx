import Link from 'next/link'

type LogoProps = {
  size?: 'sm' | 'md' | 'lg'
  asLink?: boolean
}

const sizeMap = {
  sm: 'text-sm',
  md: 'text-xl',
  lg: 'text-2xl',
}

export function Logo({ size = 'md', asLink = true }: LogoProps) {
  const text = (
    <span className={`font-display font-extrabold tracking-tight ${sizeMap[size]}`}>
      <span className="text-pf-accent">Pipe</span>Flow
    </span>
  )
  return asLink ? <Link href="/">{text}</Link> : text
}
