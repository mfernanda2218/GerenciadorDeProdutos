'use client'

import { useState, useEffect } from 'react'

type Props = {
  onSearch: (term: string) => void
  initialValue?: string
}

export default function SearchBar({ onSearch, initialValue = '' }: Props) {
  const [term, setTerm] = useState(initialValue)

  // Debounce de 300ms para não disparar a cada tecla
  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch(term)
    }, 300)

    return () => clearTimeout(timeout)
  }, [term, onSearch])

  return (
    <div className="form-control w-full max-w-xs">
      <label className="label">
        <span className="label-text font-medium">Buscar produto</span>
      </label>
      <input
        type="text"
        placeholder="Digite o nome..."
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        className="input input-bordered w-full"
      />
    </div>
  )
}