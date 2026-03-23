// components/DeleteButton.tsx
'use client'

import { useState } from 'react'
import DeleteModal from './DeleteModal'

type Props = {
  productId: string
  productName: string
  onDelete?: () => void
}

export default function DeleteButton({ productId, productName, onDelete }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsModalOpen(true)
  }

  const handleCloseModal = () => setIsModalOpen(false)

  return (
    <>
      <button 
        onClick={handleOpenModal}
        className="btn btn-sm btn-error btn-outline tooltip group"
        data-tip="Excluir produto"
      >
        <svg 
          className="w-5 h-5 transition-transform group-hover:scale-110" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        <span className="hidden sm:inline">Excluir</span>
      </button>

      {isModalOpen && (
        <DeleteModal
          productId={productId}
          productName={productName}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onDelete={onDelete}
        />
      )}
    </>
  )
}