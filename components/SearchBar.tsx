// components/SearchBar.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(currentQuery)

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams)
      if (query.trim()) {
        params.set('q', query.trim())
      } else {
        params.delete('q')
      }
      router.replace(`/?${params.toString()}`, { scroll: false })
    }, 300)

    return () => clearTimeout(timer)
  }, [query, router, searchParams])

  useEffect(() => {
    if (currentQuery !== query) setQuery(currentQuery)
  }, [currentQuery])

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="flex items-center">
        {/* Ícone de lupa (esquerda) */}
        <div className="absolute left-5 pointer-events-none">
          <svg className="w-6 h-6 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar produtos por nome, código ou fornecedor..."
          className="input input-bordered input-lg w-full pl-16 pr-16 text-lg rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-primary/30 transition-all"
        />

        {/* Botão limpar (direita) */}
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-5 btn btn-ghost btn-circle btn-sm hover:bg-base-300"
            aria-label="Limpar busca"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}