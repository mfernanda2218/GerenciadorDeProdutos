// app/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const session = await auth()

  // Se já estiver logado → manda direto pro dashboard
  if (session?.user) {
    redirect('/dashboard')
  }

  // Se não estiver logado → manda pro login
  redirect('/login')
}