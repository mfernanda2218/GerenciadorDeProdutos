'use client'
import ProductForm from '@/components/ProductForm'
import { useRouter } from 'next/navigation'

export default function NewProductPage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push('/dashboard')
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Novo Produto</h1>
      <ProductForm onSuccess={handleSuccess} />
    </div>
  )
}