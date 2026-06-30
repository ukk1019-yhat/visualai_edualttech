import { Skeleton, CardSkeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      {/* Hero skeleton */}
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-16 w-3/4" />
            <Skeleton className="h-12 w-2/3" />
            <Skeleton className="h-6 w-96" />
            <div className="flex gap-3 pt-2">
              <Skeleton className="h-12 w-36 rounded-xl" />
              <Skeleton className="h-12 w-44 rounded-xl" />
            </div>
          </div>
          <div className="hidden lg:block">
            <Skeleton className="w-full aspect-square max-w-lg mx-auto rounded-3xl" />
          </div>
        </div>
      </div>

      {/* Features grid skeleton */}
      <div className="py-16 px-6 max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Learning progress skeleton */}
      <div className="py-16 px-6 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
          <CardSkeleton />
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-8 w-48" />
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Lessons skeleton */}
      <div className="py-20 px-6 max-w-7xl mx-auto">
        <Skeleton className="h-8 w-48 mb-10" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
