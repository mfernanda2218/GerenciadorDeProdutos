'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery } from '@apollo/client'
import { PRODUCTS_QUERY } from '@/graphql/queries'
import ProductTable from '@/components/ProductTable'
import SearchBar from '@/components/SearchBar'
import { graphql } from 'graphql'

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const { data, loading, refetch } = useQuery(PRODUCTS_QUERY, {
    variables: { search: searchTerm || null },
  })

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Meus Produtos</h1>
        <Link href="/dashboard/new" className="btn btn-primary">
          + Novo Produto
        </Link>
      </div>

      <SearchBar onSearch={setSearchTerm} />

      <div className="mt-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <ProductTable products={data?.products || []} />
        )}
      </div>
    </div>
  )
}