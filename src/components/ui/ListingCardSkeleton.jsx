import { motion } from 'framer-motion'

function ListingCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="card shadow-card"
    >
      {/* Image Skeleton */}
      <div className="relative h-64 bg-gray-200 shimmer rounded-t-xl" />

      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Title and Rating */}
        <div className="flex justify-between items-start">
          <div className="h-6 bg-gray-200 shimmer rounded w-3/4" />
          <div className="h-6 bg-gray-200 shimmer rounded w-12" />
        </div>

        {/* Location */}
        <div className="h-4 bg-gray-200 shimmer rounded w-1/2" />

        {/* Icons Section */}
        <div className="flex items-center justify-between gap-2 px-2 pt-2">
          <div className="flex flex-col items-center gap-1.5 flex-1">
            <div className="w-5 h-5 bg-gray-200 shimmer rounded-full" />
            <div className="h-3 bg-gray-200 shimmer rounded w-12" />
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="flex flex-col items-center gap-1.5 flex-1">
            <div className="w-5 h-5 bg-gray-200 shimmer rounded-full" />
            <div className="h-3 bg-gray-200 shimmer rounded w-12" />
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="flex flex-col items-center gap-1.5 flex-1">
            <div className="w-5 h-5 bg-gray-200 shimmer rounded-full" />
            <div className="h-3 bg-gray-200 shimmer rounded w-12" />
          </div>
        </div>

        {/* Price */}
        <div className="h-6 bg-gray-200 shimmer rounded w-32" />
      </div>
    </motion.div>
  )
}

// Grid of skeletons
export function ListingGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(count)].map((_, index) => (
        <ListingCardSkeleton key={index} />
      ))}
    </div>
  )
}

export default ListingCardSkeleton
