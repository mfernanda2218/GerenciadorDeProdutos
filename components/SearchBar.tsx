// components/SearchBar.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export default function SearchBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState(searchParams.get('q') ?? '')

  // Sincroniza quando volta do navegador
  useEffect(() => {
    const current = searchParams.get('q') ?? ''
    if (current !== query) setQuery(current)
  }, [searchParams])

  // Atualiza URL em tempo real sem recarregar a página
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (query.trim()) {
        params.set('q', query.trim())
      } else {
        params.delete('q')
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }, 300)

    return () => clearTimeout(timer)
  }, [query, pathname, router, searchParams])

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar produtos por nome, código ou fornecedor..."
        className="input input-bordered input-lg w-full pl-6 pr-16 rounded-full shadow-xl focus:outline-none focus:ring-4 focus:ring-primary/30 focus:border-primary transition-all text-lg bg-base-100"
        autoComplete="off"
      />

      {/* BOTÃO LUPA ROXO NA DIREITA — EXATAMENTE COMO NA FOTO */}
      <button
        type="button"
        onClick={() => {
          const params = new URLSearchParams()
          if (query.trim()) params.set('q', query.trim())
          router.replace(`${pathname}?${params.toString()}`, { scroll: false })
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-circle btn-primary shadow-lg hover:scale-110 transition-all"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {/* Botão X para limpar (opcional, aparece só quando tem texto) */}
      {query && (
        <button
          type="button"
          onClick={() => setQuery('')}
          className="absolute right-16 top-1/2 -translate-y-1/2 btn btn-ghost btn-circle btn-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}