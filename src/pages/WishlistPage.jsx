import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaHeart, FaTrash } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useListings } from '../contexts/ListingsContext'
import supabase from '../supabase/supabase'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EmptyState from '../components/ui/EmptyState'
import Tooltip from '../components/ui/Tooltip'

function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(true)
  const { toggleWishlist } = useListings()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Wishlist - Homyfy'
    fetchWishlistItems()
  }, [])

  const fetchWishlistItems = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      navigate('/login', { state: { from: '/wishlist' } })
      return
    }

    const { data, error } = await supabase.rpc('get_user_wishlist', {
      user_id: user.id
    })

    console.log(data);
    if (error) throw error

    const transformedItems = data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      price: item.price,
      location: item.location,
      images: item.image_urls, // already an array
      rating: item.rating_overall,
      reviews: item.reviews_count
    }))

    setWishlistItems(transformedItems)
  } catch (err) {
    console.error('Error fetching wishlist:', err)
  } finally {
    setLoading(false)
  }
}

  const handleRemoveFromWishlist = async (e, listingId) => {
    e.preventDefault()
    e.stopPropagation()
    await toggleWishlist(listingId)
    fetchWishlistItems() // Refresh the list
  }

  if (loading) return <LoadingSpinner fullScreen />

  return (
    <div className="container-custom py-8 mt-[98px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Wishlist</h1>
        <p className="text-airbnb-light">
          {wishlistItems.length} {wishlistItems.length === 1 ? 'place' : 'places'} saved
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        <EmptyState
          icon={FaHeart}
          title="No saved places yet"
          description="As you search, click the heart icon to save your favorite places and experiences."
          actionText="Start exploring"
          actionLink="/"
        />
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {wishlistItems.map((listing, index) => (
            <motion.div 
              key={listing.id} 
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/listings/${listing.id}`} className="block">
                <motion.div 
                  className="card"
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative aspect-video overflow-hidden rounded-t-xl">
                    <motion.img 
                      src={listing.images[0]} 
                      alt={listing.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                    />
                    <Tooltip content="Remove from wishlist" position="left">
                      <motion.button
                        onClick={(e) => handleRemoveFromWishlist(e, listing.id)}
                        className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md text-red-500 hover:text-red-700 transition-colors"
                        aria-label="Remove from wishlist"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaTrash size={12} />
                      </motion.button>
                    </Tooltip>
                  </div>

                  <div className="p-4">
                    <h3 className="font-medium truncate">{listing.title}</h3>
                    <p className="text-airbnb-light text-sm">
                      {listing.location?.city}, {listing.location?.state}
                    </p>
                    <p className="mt-2">
                      <span className="font-semibold">${listing.price}</span>
                      <span className="text-airbnb-light"> night</span>
                    </p>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

export default WishlistPage