import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { memo } from 'react'
import { FaHome, FaSearch } from 'react-icons/fa'
import ListingCard from './ListingCard'
import { ListingGridSkeleton } from '../ui/ListingCardSkeleton'

// Memoize ListingCard for performance
const MemoizedListingCard = memo(ListingCard)

function ListingGrid({ listings = [], loading, emptyMessage = "No listings found" }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  // Item animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  if (loading) {
    return <ListingGridSkeleton count={12} />
  }

  if (!Array.isArray(listings)) {
    console.error("Error: Listings is not an array:", listings)
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error: Listings data is not in the expected format.</p>
      </div>
    )
  }

  if (listings.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block mb-6"
        >
          <FaSearch className="text-6xl text-gray-300" />
        </motion.div>
        <h3 className="text-2xl font-semibold mb-3 text-gray-700">Oops! {emptyMessage}</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Try adjusting your search filters or explore different locations to find your perfect stay.
        </p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6"
        >
          <button className="btn-primary inline-flex items-center gap-2">
            <FaHome />
            <span>Browse All Properties</span>
          </button>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      role="list"
      aria-label="Property listings"
    >
      {listings.map((listing) => (
        <motion.div key={listing.id} variants={itemVariants} role="listitem">
          <MemoizedListingCard listing={listing} />
        </motion.div>
      ))}
    </motion.div>
  )
}

export default memo(ListingGrid)
