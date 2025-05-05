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
  
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user && !userLoading) {
      navigate('/host/login')
      return
    }

    const fetchProperties = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('host_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error

        setProperties(data)
      } catch (error) {
        toast.error('Error fetching properties: ' + error.message)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchProperties()
    }
  }, [user, userLoading, navigate])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id)

      if (error) throw error

      setProperties(prev => prev.filter(prop => prop.id !== id))
      toast.success('Property deleted successfully')
    } catch (error) {
      toast.error('Error deleting property: ' + error.message)
    }
  }

  if (loading || userLoading) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <div className="container-custom py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Properties</h1>
        <Link to="/hosting/add" className="btn-primary">
          <FaPlus className="inline-block mr-2" />
          Add new property
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="bg-white rounded-xl shadow-card p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">No properties listed yet</h2>
          <p className="text-airbnb-light mb-6">
            Start earning by sharing your space with travelers from around the world.
          </p>
          <Link to="/hosting/add" className="btn-primary">
            List your first property
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(property => (
            <div key={property.id} className="bg-white rounded-xl shadow-card overflow-hidden">
              <div className="relative aspect-video">
                <img
                  src={property.images[0] || 'https://via.placeholder.com/400x300'}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <Link
                    to={`/hosting/edit/${property.id}`}
                    className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                  >
                    <FaEdit className="text-airbnb-dark" />
                  </Link>
                  <button
                    onClick={() => handleDelete(property.id)}
                    className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                  >
                    <FaTrash className="text-red-500" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-medium text-lg mb-1">{property.title}</h3>
                <p className="text-airbnb-light text-sm mb-2">
                  {property.location.city}, {property.location.state}
                </p>
                <p className="font-semibold">${property.price} per night</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default HostingPage