import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaHeart, FaTrash } from 'react-icons/fa'
import { useListings } from '../contexts/ListingsContext'
import supabase from '../supabase/supabase'
import LoadingSpinner from '../components/ui/LoadingSpinner'

function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(true)
  const { toggleWishlist } = useListings()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Wishlist - Airbnb Clone'
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
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Wishlist</h1>
        <p className="text-airbnb-light">
          {wishlistItems.length} {wishlistItems.length === 1 ? 'place' : 'places'} saved
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="bg-white rounded-xl shadow-card p-8 text-center">
          <div className="flex justify-center mb-4">
            <FaHeart className="text-5xl text-airbnb-primary" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">No saved places yet</h2>
          <p className="text-airbnb-light mb-6">
            As you search, click the heart icon to save your favorite places and experiences.
          </p>
          <Link to="/" className="btn-primary inline-block">Start exploring</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map(listing => (
            <div key={listing.id} className="relative group">
              <Link to={`/listings/${listing.id}`} className="block">
                <div className="card">
                  <div className="relative aspect-video overflow-hidden rounded-t-xl">
                    <img 
                      src={listing.images[0]} 
                      alt={listing.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                    />
                    <button
                      onClick={(e) => handleRemoveFromWishlist(e, listing.id)}
                      className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md text-airbnb-primary hover:text-red-700 transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      <FaTrash size={12} />
                    </button>
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
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default WishlistPage