// app/dashboard/layout.tsx
import Navbar from '@/components/Navbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <main className="pt-20 lg:pt-24 pb-12 w-full mx-auto max-w-7xl px-4 sm:px-8">
        {children}
      </main>
    </div>
  )
}
