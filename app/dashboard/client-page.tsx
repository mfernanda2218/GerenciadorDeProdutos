// app/dashboard/client-page.tsx
'use client'

import { useSession } from 'next-auth/react'

export default function ClientDashboard() {
  const { data: session } = useSession()

  return (
    <div className="navbar bg-base-100 shadow-xl sticky top-0 z-50">
      <div className="flex-1">
        <h1 className="text-2xl font-bold">Gerenciador</h1>
      </div>
      <div className="flex-none gap-4">
        <input type="text" placeholder="Buscar..." className="input input-bordered" />
        <div className="dropdown dropdown-end">
          <div tabIndex={0} className="avatar">
            <div className="w-10 rounded-full">
              <img src={session?.user?.image || '/avatar.png'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}