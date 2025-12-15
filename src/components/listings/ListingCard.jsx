import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaStar, FaHeart, FaRegHeart, FaBed, FaBath, FaUser, FaCrown, FaCheckCircle, FaCube } from 'react-icons/fa'
import { useListings } from '../../contexts/ListingsContext'
import ImageCarousel from '../ui/ImageCarousel'
import Tooltip from '../ui/Tooltip'
import { toast } from 'react-toastify'
import supabase from '../../supabase/supabase'

function ListingCard({ listing }) {
  const { wishlist, toggleWishlist } = useListings()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const navigate = useNavigate()

  const isWishlisted = wishlist.includes(listing.id)

  const handleWishlistToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()

    // Call toggleWishlist - it handles user check internally
    toggleWishlist(listing.id)
  }

  const city = listing.location?.city || 'Unknown City'
  const state = listing.location?.state || 'Unknown State'
  const images = listing.images?.length > 0 ? listing.images : [{ url: '/placeholder.jpg' }]
  
  // Check if listing is featured (example logic - adjust based on your data)
  const isFeatured = listing.rating >= 4.8 
  const isNew = listing.created_at && new Date(listing.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)



  return (
    <>
      <motion.div 
        className="card group shadow-card hover:shadow-card-hover"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -8 }}
        onClick={() => navigate(`/listings/${listing.id}`)}
        style={{ cursor: 'pointer' }}
      >
        <div className="relative overflow-hidden">
          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
            {isFeatured && (
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg"
              >
                <FaCrown className="text-sm" />
                <span>Featured</span>
              </motion.div>
            )}
            {isNew && (
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-1 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg"
                style={{ background: 'linear-gradient(to right, #0F1520, #1a2332)' }}
              >
                <FaCheckCircle className="text-sm" />
                <span>New</span>
              </motion.div>
            )}
            {listing.matterport_url && (
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg"
              >
                <FaCube className="text-lg" />
                <span>VR Tour</span>
              </motion.div>
            )}
          </div>

          {/* Image Carousel - No longer opens lightbox */}
          <motion.div className="relative h-64 sm:h-72">
            <ImageCarousel
              images={images}
              currentIndex={currentImageIndex}
              setCurrentIndex={setCurrentImageIndex}
              onImageClick={() => {}} // No action on click
            />
          </motion.div>

          {/* Gradient Overlay on hover */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"
          />

          {/* Wishlist Button */}
          <motion.button
            className="absolute top-3 right-3 z-10"
            onClick={handleWishlistToggle}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <motion.div
              initial={false}
              animate={{ 
                scale: isWishlisted ? [1, 1.3, 1] : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              {isWishlisted ? (
                <FaHeart className="text-2xl text-red-500 drop-shadow-lg" />
              ) : (
                <FaRegHeart className="text-2xl text-white drop-shadow-lg hover:text-red-400 transition-colors" />
              )}
            </motion.div>
          </motion.button>
        </div>

        <div className="p-4 relative">
          {/* Title and Rating */}
          <div className="flex justify-between items-start mb-2">
            <motion.h3 
              className="font-semibold text-lg truncate flex-1 transition-colors"
              style={{ color: isHovered ? '#0F1520' : 'inherit' }}
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {listing.title || 'Untitled Listing'}
            </motion.h3>
            <motion.div 
              className="flex items-center ml-2 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-200"
              whileHover={{ scale: 1.1 }}
            >
              <FaStar className="text-yellow-500 mr-1 text-sm" />
              <span className="font-semibold text-sm text-gray-900">{listing.rating || '4.5'}</span>
            </motion.div>
          </div>

          {/* Location */}
          <p className="text-gray-5s00 text-sm mb-3 flex items-center">
            <span className="truncate">{listing.location || 'Unknown Location'}</span>
          </p>

          {/* Sub Description */}
          {listing.subdescription && (
            <p className="text-gray-400 text-xs mb-3 line-clamp-2">
              {listing.subdescription}
            </p>
          )}

          {/* Property Details with Icons & Tooltips */}
          <div className="flex items-center justify-between gap-2 text-xs text-gray-600 mb-3 px-2 mt-4">
            <motion.div 
              className="flex flex-col items-center gap-1.5 flex-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaBed className="text-lg" style={{ color: '#1864f1ff' }} />
              <span className="text-center font-medium">{listing.beds} bed{listing.beds !== '1' ? 's' : ''}</span>
            </motion.div>
            <div className="w-px h-8 bg-gray-200"></div>
            <motion.div 
              className="flex flex-col items-center gap-1.5 flex-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaBath className="text-purple-500 text-lg" />
              <span className="text-center font-medium">{listing.bathrooms} bath{listing.bathrooms !== '1' ? 's' : ''}</span>
            </motion.div>
            <div className="w-px h-8 bg-gray-200"></div>
            <motion.div 
              className="flex flex-col items-center gap-1.5 flex-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaUser className="text-orange-500 text-lg" />
              <span className="text-center font-medium">{listing.maxGuests} guest{listing.maxGuests !== '1' ? 's' : ''}</span>
            </motion.div>
          </div>

          {/* Price with animated background */}
          <motion.div
            className="relative inline-block"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              className="absolute inset-0 rounded-lg"
              style={{ background: 'linear-gradient(to right, #f8f9fa, #e9ecef)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
            <p className="relative px-3 py-1.5 rounded-lg">
              <span className="font-bold text-xl text-gray-900">Rs. {listing.price}</span>
              <span className="text-gray-500 text-sm font-medium"> / night</span>
            </p>
          </motion.div>
        </div>

        {/* Hover indicator line */}
        <motion.div
          className="h-1 rounded-b-xl"
          style={{ background: 'linear-gradient(to right, #0F1520, #1a2332)' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

   
  </>
  )
}

export default ListingCard
