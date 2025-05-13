import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'
import { toast } from 'react-toastify'
import supabase from '../supabase/supabase'
import useCurrentUser from '../hooks/useCurrentUser'
import LoadingSpinner from '../components/ui/LoadingSpinner'

function HostingPage() {
  const { user, loading: userLoading } = useCurrentUser()
  const navigate = useNavigate()

  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user && !userLoading) {
      navigate('/host/login')
      return
    }

    const fetchListings = async () => {
      try {
        const { data, error } = await supabase.rpc('fetch_listings_by_user', { user_id: user.id })

        if (error) throw error

        setListings(data)
      } catch (error) {
        toast.error('Error fetching listings: ' + error.message)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchListings()
    }
  }, [user, userLoading, navigate])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return
    }

    try {
      const { error } = await supabase.rpc('delete_listing', { listing_id: id, user_id: user.id })

      if (error) throw error

      setListings(prev => prev.filter(listing => listing.id !== id))
      toast.success('Listing deleted successfully')
    } catch (error) {
      toast.error('Error deleting listing: ' + error.message)
    }
  }

  if (loading || userLoading) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <div className="container-custom py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Listings</h1>
        <Link to="/hosting/add" className="btn-primary">
          <FaPlus className="inline-block mr-2" />
          Add new listing
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-card p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">No listings yet</h2>
          <p className="text-airbnb-light mb-6">
            Start earning by sharing your space with travelers from around the world.
          </p>
          <Link to="/hosting/add" className="btn-primary">
            List your first property
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map(listing => (
            <div key={listing.id} className="bg-white rounded-xl shadow-card overflow-hidden">
              <div className="relative aspect-video">
                <img
                  src={listing.images[0] || 'https://via.placeholder.com/400x300'}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <Link
                    to={`/hosting/edit/${listing.id}`}
                    className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                  >
                    <FaEdit className="text-airbnb-dark" />
                  </Link>
                  <button
                    onClick={() => handleDelete(listing.id)}
                    className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                  >
                    <FaTrash className="text-red-500" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-medium text-lg mb-1">{listing.title}</h3>
                <p className="text-airbnb-light text-sm mb-2">
                  {listing.location}
                </p>
                <p className="font-semibold">Rs. {listing.price_value} per night</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default HostingPage