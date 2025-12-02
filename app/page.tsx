// app/page.tsx
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const session = await getCurrentUser()

  // Se já estiver logado → manda direto pro dashboard
  if (session?.user) {
    redirect('/dashboard')
  }

  // Se não estiver logado → manda pro login
  redirect('/login')
}