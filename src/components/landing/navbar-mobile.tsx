'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export function NavbarMobile() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={open}
        className="text-pf-text-secondary hover:text-pf-text transition-colors"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div className="fixed inset-0 top-[60px] z-40 flex flex-col gap-6 bg-pf-bg px-6 py-8">
          <a
            href="#features"
            className="text-base text-pf-text-secondary hover:text-pf-text transition-colors"
            onClick={() => setOpen(false)}
          >
            Funcionalidades
          </a>
          <a
            href="#results"
            className="text-base text-pf-text-secondary hover:text-pf-text transition-colors"
            onClick={() => setOpen(false)}
          >
            Resultados
          </a>
          <a
            href="#pricing"
            className="text-base text-pf-text-secondary hover:text-pf-text transition-colors"
            onClick={() => setOpen(false)}
          >
            Planos
          </a>
          <div className="h-px bg-pf-border" />
          <Link
            href="/login"
            className="text-base text-pf-text-secondary hover:text-pf-text transition-colors"
            onClick={() => setOpen(false)}
          >
            Entrar
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-lg bg-pf-accent px-6 py-3 text-sm font-semibold text-pf-bg pf-glow-btn"
            onClick={() => setOpen(false)}
          >
            Começar grátis
          </Link>
        </div>
      )}
    </>
  )
}
