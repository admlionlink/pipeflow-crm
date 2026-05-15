import { Skeleton } from '@/components/ui/skeleton'

export default function AppLoading() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar skeleton */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border bg-sidebar">
        <div className="flex h-14 items-center px-4 border-b border-border">
          <Skeleton className="h-5 w-28" />
        </div>
        <div className="px-2 py-3 border-b border-border">
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="px-2 py-3 space-y-1">
          <Skeleton className="h-3 w-10 mb-3 mx-3" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </div>
      </aside>

      {/* Conteúdo principal skeleton */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header skeleton */}
        <div className="flex h-14 items-center gap-4 border-b border-border px-4">
          <Skeleton className="h-5 w-40" />
          <div className="ml-auto flex items-center gap-2">
            <Skeleton className="h-8 w-52 hidden md:block" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>

        {/* Page content skeleton */}
        <main className="flex-1 p-6 space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-64 rounded-lg" />
        </main>
      </div>
    </div>
  )
}
