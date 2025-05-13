import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaStar, FaHeart, FaRegHeart } from 'react-icons/fa'
import { useListings } from '../../contexts/ListingsContext'
import ImageCarousel from '../ui/ImageCarousel'
import { toast } from 'react-toastify'
import supabase from '../../supabase/supabase'

function ListingCard({ listing }) {
  const { wishlist, toggleWishlist } = useListings()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const navigate = useNavigate()

  const isWishlisted = wishlist.includes(listing.id)

  const handleWishlistToggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      toast.info('Please log in to add to wishlist')
      navigate('/login', { state: { from: window.location.pathname } })
      return
    }

    toggleWishlist(listing.id)
  }

  const city = listing.location?.city || 'Unknown City'
  const state = listing.location?.state || 'Unknown State'
  const images = listing.images?.length > 0 ? listing.images : [{ url: '/placeholder.jpg' }] // fallback image

  return (
    <Link to={`/listings/${listing.id}`} className="block">
      <div className="card group">
        <div className="relative">
          <ImageCarousel
            images={images}
            currentIndex={currentImageIndex}
            setCurrentIndex={setCurrentImageIndex}
          />

          <button
            className="absolute top-3 right-3 z-10 text-xl"
            onClick={handleWishlistToggle}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            {isWishlisted ? (
              <FaHeart className="text-airbnb-primary drop-shadow-lg" />
            ) : (
              <FaRegHeart className="text-white drop-shadow-lg hover:scale-110 transition-transform" />
            )}
          </button>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-lg truncate">{listing.title || 'Untitled Listing'}</h3>
            <div className="flex items-center ml-2">
              <FaStar className="text-airbnb-primary mr-1" />
              <span>{listing.rating || '4.5'}</span>
            </div>
          </div>

<p className="text-airbnb-light text-sm mt-1">
  {listing.location || 'Unknown Location'}
</p>

          {listing.subdescription && (
            <p className="text-airbnb-light text-sm mt-1">
              {listing.subdescription}
            </p>
          )}

          <div className="flex items-center mt-2 text-sm">
            <span>{listing.beds} bed{listing.beds !== 1 ? 's' : ''}</span>
            <span className="mx-1">·</span>
            <span>{listing.bathrooms} bath{listing.bathrooms !== 1 ? 's' : ''}</span>
            <span className="mx-1">·</span>
            <span>{listing.maxGuests} guest{listing.maxGuests !== 1 ? 's' : ''}</span>
          </div>

          <p className="mt-2">
            <span className="font-semibold">Rs. {listing.price}</span>
            <span className="text-airbnb-light"> night</span>
          </p>
        </div>
      </div>
    </Link>
  )
}

export default ListingCard
