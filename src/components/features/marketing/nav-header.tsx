'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NavHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-pf-border bg-pf-bg/90 shadow-sm backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="font-display text-xl font-extrabold tracking-tight">
          <span className="text-pf-accent">Pipe</span>Flow
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#funcionalidades"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Funcionalidades
          </a>
          <a
            href="#precos"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Preços
          </a>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Entrar</Link>
          </Button>
          <Button
            size="sm"
            className="bg-pf-accent font-semibold text-pf-bg hover:bg-pf-accent/90"
            asChild
          >
            <Link href="/signup">Começar grátis</Link>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex items-center justify-center md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
        >
          {open ? (
            <X size={20} className="text-foreground" />
          ) : (
            <Menu size={20} className="text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-pf-border bg-pf-bg px-4 pb-6 md:hidden">
          <nav className="flex flex-col gap-4 pt-4">
            <a
              href="#funcionalidades"
              className="text-sm text-muted-foreground"
              onClick={() => setOpen(false)}
            >
              Funcionalidades
            </a>
            <a
              href="#precos"
              className="text-sm text-muted-foreground"
              onClick={() => setOpen(false)}
            >
              Preços
            </a>
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            <Button variant="outline" size="sm" className="w-full border-pf-border" asChild>
              <Link href="/login">Entrar</Link>
            </Button>
            <Button
              size="sm"
              className="w-full bg-pf-accent font-semibold text-pf-bg hover:bg-pf-accent/90"
              asChild
            >
              <Link href="/signup">Começar grátis</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
