import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-foreground">
            Vlad Tamas
          </h1>
          <p className="text-muted-foreground text-lg">
            
          </p>
        </div>

        <Link
          href="/payme"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:gap-3"
        >
          Send Payment
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  )
}
