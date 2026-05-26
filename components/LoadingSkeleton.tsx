export default function LoadingSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, idx) => (
        <div 
          key={idx} 
          className="flex h-[320px] flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm animate-pulse"
        >
          <div>
            {/* Rating badge skeleton */}
            <div className="h-5 w-12 rounded-full bg-gray-200"></div>

            {/* Title skeleton */}
            <div className="mt-4 h-6 w-11/12 rounded bg-gray-200"></div>
            <div className="mt-2 h-6 w-3/4 rounded bg-gray-200"></div>

            {/* Location tag skeleton */}
            <div className="mt-3 flex items-center gap-1.5">
              <div className="h-4 w-4 rounded-full bg-gray-200"></div>
              <div className="h-4 w-1/2 rounded bg-gray-200"></div>
            </div>

            {/* Fees box skeleton */}
            <div className="mt-5 h-12 w-full rounded-xl bg-gray-100"></div>
          </div>

          {/* Action buttons skeleton */}
          <div className="mt-5 border-t border-gray-50 pt-4 flex gap-2">
            <div className="h-9 flex-1 rounded-xl bg-gray-200"></div>
            <div className="h-9 w-24 rounded-xl bg-gray-200"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
