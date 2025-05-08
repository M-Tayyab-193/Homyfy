import { useState, useRef, useEffect } from 'react'
import { FaFilter, FaSort } from 'react-icons/fa'

const PROPERTY_TYPES = [
  { id: 'all', label: 'All' },
  { id: 'Apartment', label: 'Apartments' },
  { id: 'House', label: 'Houses' },
  { id: 'Villa', label: 'Villas' },
  { id: 'Others', label: 'Others' }
]

const BASIC_AMENITIES = [
  { id: 'wifi', label: 'WiFi' },
  { id: 'air conditioning', label: 'Air Conditioning' },
  { id: 'tv', label: 'TV' },
  { id: 'workspace', label: 'Workspace' },
  { id: 'washing machine', label: 'Washing Machine' },
  { id: 'parking facility', label: 'Parking Facility' },
  { id: 'heater', label: 'Heater' }
]

function PropertyFilters({ 
  activeFilter, 
  currentSort,
  minPrice: initialMinPrice,
  maxPrice: initialMaxPrice,
  onFilterChange, 
  onPriceChange, 
  onSortChange 
}) {
  const scrollRef = useRef(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showSort, setShowSort] = useState(false)
  const [minPrice, setMinPrice] = useState(initialMinPrice)
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice)
  const [selectedAmenities, setSelectedAmenities] = useState([])

  const handleFilterChange = (filter) => {
    onFilterChange(filter)
  }

  const handlePriceSubmit = () => {
    onPriceChange(minPrice, maxPrice, selectedAmenities)
    setShowFilters(false)
  }

  const handleSortChange = (sortType) => {
    onSortChange(sortType)
    setShowSort(false)
  }

  const handleAmenityToggle = (amenityId) => {
    setSelectedAmenities(prev => {
      const updated = prev.includes(amenityId)
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
      return updated
    })
  }

  return (
    <div className="relative my-6">
      <div className="flex items-center">
        <div
          ref={scrollRef}
          className="flex space-x-8 overflow-x-auto scrollbar-hide py-2 px-1 flex-grow"
        >
          {PROPERTY_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => handleFilterChange(type.id)}
              className={`flex flex-col items-center min-w-fit ${activeFilter === type.id ? 'text-airbnb-dark border-b-2 border-airbnb-dark' : 'text-gray-500'}`}
            >
              <span className="text-sm whitespace-nowrap">{type.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-4 ml-4">
          <button
            onClick={() => {
              setShowFilters(!showFilters)
              setShowSort(false)
            }}
            className="px-4 py-2 border rounded-lg flex items-center"
          >
            <FaFilter className="mr-2" />
            Filters
          </button>

          <div className="relative">
            <button
              onClick={() => {
                setShowSort(!showSort)
                setShowFilters(false)
              }}
              className="px-4 py-2 border rounded-lg flex items-center"
            >
              <FaSort className="mr-2" />
              Sort
            </button>

            {showSort && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-20">
                <h3 className="font-semibold mb-2">Sort By</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => handleSortChange('price_high_low')} 
                    className={`w-full text-left px-3 py-2 rounded-lg ${
                      currentSort === 'price_high_low' ? 'bg-gray-100' : 'hover:bg-gray-50'
                    }`}
                  >
                    Price: High to Low
                  </button>
                  <button 
                    onClick={() => handleSortChange('price_low_high')} 
                    className={`w-full text-left px-3 py-2 rounded-lg ${
                      currentSort === 'price_low_high' ? 'bg-gray-100' : 'hover:bg-gray-50'
                    }`}
                  >
                    Price: Low to High
                  </button>
                  <button 
                    onClick={() => handleSortChange('rating_high_low')} 
                    className={`w-full text-left px-3 py-2 rounded-lg ${
                      currentSort === 'rating_high_low' ? 'bg-gray-100' : 'hover:bg-gray-50'
                    }`}
                  >
                    Rating: High to Low
                  </button>
                  <button 
                    onClick={() => handleSortChange('rating_low_high')} 
                    className={`w-full text-left px-3 py-2 rounded-lg ${
                      currentSort === 'rating_low_high' ? 'bg-gray-100' : 'hover:bg-gray-50'
                    }`}
                  >
                    Rating: Low to High
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-20">
          <div className="mb-6">
            <h3 className="font-semibold mb-4">Price Range</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Minimum Price</label>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Maximum Price</label>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-4">Amenities</h3>
            <div className="grid grid-cols-2 gap-3">
              {BASIC_AMENITIES.map((amenity) => (
                <label
                  key={amenity.id}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                    selectedAmenities.includes(amenity.id)
                      ? 'border-airbnb-primary bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity.id)}
                    onChange={() => handleAmenityToggle(amenity.id)}
                    className="sr-only"
                  />
                  <span className="text-sm">{amenity.label}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handlePriceSubmit}
            className="w-full bg-airbnb-primary text-white py-2 rounded-lg"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  )
}

export default PropertyFilters