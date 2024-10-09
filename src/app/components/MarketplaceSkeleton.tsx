import { Skeleton } from "@/components/ui/skeleton"

export default function MarketplaceSkeleton() {
  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array(8).fill(0).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}