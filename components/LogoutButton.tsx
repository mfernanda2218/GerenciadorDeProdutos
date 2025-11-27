// components/LogoutButton.tsx
'use client'

import { signOut } from 'next-auth/react'

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="btn btn-ghost btn-sm text-error"
    >
      Sair da conta
    </button>
  )
}