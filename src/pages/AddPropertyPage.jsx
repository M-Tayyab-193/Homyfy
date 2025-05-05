import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUpload, FaImage } from 'react-icons/fa'
import { toast } from 'react-toastify'
import supabase from '../supabase/supabase'
import useCurrentUser from '../hooks/useCurrentUser'

function AddPropertyPage() {
  const { user } = useCurrentUser()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'house',
    price: '',
    beds: 1,
    bathrooms: 1,
    max_guests: 1,
    location: {
      address: '',
      city: '',
      state: '',
      country: '',
      coordinates: {
        lat: 0,
        lng: 0
      }
    },
    amenities: [],
    images: []
  })
  
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLocationChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: value
      }
    }))
  }

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    const uploadPromises = files.map(async file => {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      const { error: uploadError, data } = await supabase.storage
        .from('property-images')
        .upload(filePath, file)

      if (uploadError) {
        toast.error(`Error uploading ${file.name}`)
        return null
      }

      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath)

      return publicUrl
    })

    const uploadedUrls = await Promise.all(uploadPromises)
    const validUrls = uploadedUrls.filter(Boolean)

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...validUrls]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('properties')
        .insert([{
          ...formData,
          host_id: user.id,
          price: parseFloat(formData.price)
        }])

      if (error) throw error

      toast.success('Property listed successfully!')
      navigate('/hosting')
    } catch (error) {
      toast.error('Error creating listing: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-8">Add New Property</h1>

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
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="cabin">Cabin</option>
                <option value="condo">Condo</option>
                <option value="treehouse">Treehouse</option>
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.location.address}
                onChange={handleLocationChange}
                className="input-field"
                placeholder="Street address"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.location.city}
                  onChange={handleLocationChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.location.state}
                  onChange={handleLocationChange}
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
                value={formData.location.country}
                onChange={handleLocationChange}
                className="input-field"
                required
              />
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
                  type="number"
                  name="beds"
                  value={formData.beds}
                  onChange={handleInputChange}
                  min="1"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bathrooms
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  min="0.5"
                  step="0.5"
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
                  type="number"
                  name="max_guests"
                  value={formData.max_guests}
                  onChange={handleInputChange}
                  min="1"
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
              {[
                'Wifi', 'Kitchen', 'Free parking', 'Air conditioning',
                'TV', 'Washer', 'Dryer', 'Pool', 'Hot tub', 'Gym',
                'BBQ grill', 'Fireplace', 'Beach access', 'Mountain view'
              ].map(amenity => (
                <label
                  key={amenity}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    formData.amenities.includes(amenity)
                      ? 'border-airbnb-primary bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="sr-only"
                  />
                  <span>{amenity}</span>
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
            {loading ? 'Creating listing...' : 'Create Listing'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddPropertyPage