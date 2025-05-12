import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaUpload, FaImage } from 'react-icons/fa'
import { toast } from 'react-toastify'
import supabase from '../supabase/supabase'
import useCurrentUser from '../hooks/useCurrentUser'
import axios from 'axios'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const PROPERTY_TYPES = [
  { id: 'Others', label: 'Others' },
  { id: 'House', label: 'House' },
  { id: 'Apartment', label: 'Apartment' },
  { id: 'Villa', label: 'Villa' }
]

const AMENITIES = [
  { id: '4161594d-2c38-43d9-8ecb-8be28d0852c5', label: 'Refrigerator' },
  { id: '345035bd-5092-4404-a964-68cf4362427a', label: 'Microwave' },
  { id: '5946b5ca-fa4c-433d-a184-637253f3c292', label: 'TV' },
  { id: '5d9042c5-2c66-4782-998d-10fc1f676fed', label: 'Workspace' },
  { id: 'fa6f419b-7f4e-4afd-82fd-19df3ce170fe', label: 'WiFi' },
  { id: 'cd6b85f4-cb94-452d-9cfa-6cd1288a3a4f', label: 'Washing Machine' },
  { id: 'b7829f09-1bd4-4347-8351-049fe495c839', label: 'Balcony' },
  { id: 'a6a04e6f-3f86-4eef-b54f-3884c78613dd', label: 'Geyser' },
  { id: '34ca636f-6926-41ef-9769-cb5ee9f4c582', label: 'Towels' },
  { id: 'c6e88590-21a6-4aa9-acdc-59546636b012', label: 'Security Cameras' },
  { id: 'cbdd2e94-6342-46ce-b1e1-0386da83cfd2', label: 'First Aid Kit' },
  { id: '382d980c-4f92-4d7a-b4f5-393270b5bd40', label: 'Fire Extinguisher' },
  { id: '185dc318-7ba4-46b4-b2a7-1a508e3c3cf4', label: 'Air Conditioning' },
  { id: 'f7c110c9-6b5e-4457-a1c5-5576c431bda4', label: 'Heater' },
  { id: 'cf67e14e-90ea-48e6-8b65-8c688f66234a', label: 'Parking Facility' }
]

function EditListingPage() {
  const { id } = useParams()
  const { user } = useCurrentUser()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'House',
    price: '',
    beds: '1',
    bathrooms: '1',
    maxGuests: '1',
    city: '',
    province: '',
    country: '',
    latitude: '',
    longitude: '',
    amenities: [],
    images: []
  })

  useEffect(() => {
    const fetchListing = async () => {
      try {
       const { data: listing, error: listingError } = await supabase
        .rpc('get_listing_details', {
          p_listing_id: id,
          p_user_id: user.id
        })
        .single();


        if (listingError) throw listingError

        if (listing.listing_user_id !== user?.id) {
          toast.error('You do not have permission to edit this listing')
          navigate('/hosting')
          return
        }

        const [city, province, country] = listing.location.split(', ')

        setFormData({
          title: listing.title,
          description: listing.description,
          type: listing.property_type,
          price: listing.price_value,
          beds: listing.bed_count.toString(),
          bathrooms: listing.bathroom_count.toString(),
          maxGuests: listing.guest_count.toString(),
          city,
          province,
          country,
          latitude: listing.latitude,
          longitude: listing.longitude,
          amenities: listing.amenities,
          images: listing.images
        })
      } catch (error) {
        console.error('Error fetching listing:', error)
        toast.error('Error loading listing details')
        navigate('/hosting')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchListing()
    }
  }, [id, user, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAmenityToggle = (amenityId) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId]
    }))
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    const uploadPromises = files.map(async file => {
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', 'profile_uploads')
        formData.append('folder', 'profile-images')

        const cloudinaryRes = await axios.post(
          'https://api.cloudinary.com/v1_1/tayyab193/image/upload',
          formData
        )

        return cloudinaryRes.data.secure_url
      } catch (error) {
        toast.error(`Error uploading ${file.name}: ${error.message}`)
        return null
      }
    })

    try {
      const uploadedUrls = await Promise.all(uploadPromises)
      const validUrls = uploadedUrls.filter(Boolean)

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...validUrls]
      }))
    } catch (error) {
      toast.error('Error uploading images: ' + error.message)
    }
  }

  const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)

  try {
    const location = `${formData.city}, ${formData.province}, ${formData.country}`

    // 1. Call update_listing_details function
    const { error: listingError } = await supabase.rpc('update_listing_details', {
      p_listing_id: id,
      p_user_id: user.id,
      p_title: formData.title,
      p_description: formData.description,
      p_property_type: formData.type,
      p_price_value: parseFloat(formData.price),
      p_bed_count: parseInt(formData.beds),
      p_bathroom_count: parseInt(formData.bathrooms),
      p_guest_count: parseInt(formData.maxGuests),
      p_location: location,
      p_latitude: formData.latitude,
      p_longitude: formData.longitude
    })
    if (listingError) throw listingError

    // 2. Call update_listing_images function
    const { error: imagesError } = await supabase.rpc('update_listing_images', {
      p_listing_id: id,
      p_user_id: user.id,
      p_images: formData.images
    })
    if (imagesError) throw imagesError

    // 3. Call update_listing_amenities function
    const { error: amenitiesError } = await supabase.rpc('update_listing_amenities', {
      p_listing_id: id,
      p_user_id: user.id,
      p_amenities: formData.amenities
    })
    if (amenitiesError) throw amenitiesError

    toast.success('Listing updated successfully!')
    navigate('/hosting')
  } catch (error) {
    console.error('Error updating listing:', error)
    toast.error('Error updating listing: ' + error.message)
  } finally {
    setLoading(false)
  }
}

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Listing</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-card p-6 mb-6">
          {/* Basic Information */}
          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="input-field"
                required
              >
                {PROPERTY_TYPES.map(type => (
                  <option key={type.id} value={type.id}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Give your place a catchy title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="input-field min-h-[150px]"
                placeholder="Describe your place"
                required
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-semibold mb-4">Location</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Province
                </label>
                <input
                  type="text"
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="input-field"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude
                </label>
                <input
                  type="text"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude
                </label>
                <input
                  type="text"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-semibold mb-4">Property Details</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Beds
                </label>
                <input
                  type="text"
                  name="beds"
                  value={formData.beds}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bathrooms
                </label>
                <input
                  type="text"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Guests
                </label>
                <input
                  type="text"
                  name="maxGuests"
                  value={formData.maxGuests}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price per night ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="input-field"
                  required
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-semibold mb-4">Amenities</h2>
            
            <div className="grid grid-cols-2 gap-4">
              {AMENITIES.map(amenity => (
                <label
                  key={amenity.id}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    formData.amenities.includes(amenity.id)
                      ? 'border-airbnb-primary bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity.id)}
                    onChange={() => handleAmenityToggle(amenity.id)}
                    className="sr-only"
                  />
                  <span>{amenity.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Property Images</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="images"
              />
              <label
                htmlFor="images"
                className="cursor-pointer block text-center"
              >
                <FaUpload className="text-4xl text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Click to upload images
                </p>
                <p className="text-sm text-gray-500">
                  (You can upload multiple images)
                </p>
              </label>
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {formData.images.map((url, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={url}
                      alt={`Property ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== index)
                        }))
                      }}
                      className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/hosting')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Updating listing...' : 'Update Listing'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditListingPage