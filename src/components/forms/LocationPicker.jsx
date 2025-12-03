import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { FaSearch, FaMapMarkerAlt, FaSpinner } from 'react-icons/fa'
import { toast } from 'react-toastify'

// Custom draggable marker icon
const customIcon = new L.DivIcon({
  html: `
    <div class="relative">
      <div class="absolute -top-10 -left-5 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg flex items-center justify-center cursor-move">
        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
        </svg>
      </div>
      <div class="absolute -top-5 -left-5 w-10 h-10 bg-blue-500 rounded-full opacity-30 animate-ping"></div>
    </div>
  `,
  className: 'custom-location-marker',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
})

// Component to handle map clicks
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

function LocationPicker({ 
  initialLat = 31.5204, 
  initialLon = 74.3587,
  initialCity = '',
  onLocationChange 
}) {
  const [position, setPosition] = useState([initialLat, initialLon])
  const [searchQuery, setSearchQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [address, setAddress] = useState('')
  const mapRef = useRef(null)
  const prevPositionRef = useRef(null)
  const debounceTimerRef = useRef(null)

  // Reverse geocode when position changes (with debouncing to prevent rapid calls)
  useEffect(() => {
    // Clear any existing timeout
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Check if position actually changed
    const posChanged = !prevPositionRef.current || 
      prevPositionRef.current[0] !== position[0] || 
      prevPositionRef.current[1] !== position[1]

    if (!posChanged) return

    // Debounce the API call by 500ms
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position[0]}&lon=${position[1]}&zoom=18&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'Homyfy Property Rental App'
            }
          }
        )
        const data = await response.json()
        
        if (data.address) {
          const parts = []
          if (data.address.road) parts.push(data.address.road)
          if (data.address.suburb || data.address.neighbourhood) {
            parts.push(data.address.suburb || data.address.neighbourhood)
          }
          
          const city = data.address.city || data.address.town || data.address.village || ''
          const fullAddress = parts.join(', ')
          
          setAddress(fullAddress || data.display_name)
          
          // Update previous position
          prevPositionRef.current = [position[0], position[1]]
          
          // Notify parent component only once
          if (onLocationChange) {
            onLocationChange({
              city,
              lat: position[0],
              lon: position[1],
              address: fullAddress || data.display_name
            })
          }
        }
      } catch (error) {
        console.error('Error reverse geocoding:', error)
      }
    }, 500) // 500ms debounce

    // Cleanup timeout on unmount
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [position]) // Removed onLocationChange from dependencies

  // Search for address
  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      toast.error('Please enter an address to search')
      return
    }

    setSearching(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`,
        {
          headers: {
            'User-Agent': 'Homyfy Property Rental App'
          }
        }
      )
      const data = await response.json()

      if (data && data.length > 0) {
        const location = data[0]
        const newPosition = [parseFloat(location.lat), parseFloat(location.lon)]
        setPosition(newPosition)
        
        // Fly to new position
        if (mapRef.current) {
          mapRef.current.flyTo(newPosition, 15, {
            duration: 1.5
          })
        }
        
        toast.success('Location found!')
      } else {
        toast.error('Location not found. Try a different address.')
      }
    } catch (error) {
      console.error('Error geocoding:', error)
      toast.error('Failed to search location')
    } finally {
      setSearching(false)
    }
  }

  const handleMapClick = (lat, lng) => {
    setPosition([lat, lng])
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FaMapMarkerAlt className="inline mr-2 text-blue-500" />
          Property Location
        </label>
        
        {/* Search Box - Changed from form to div */}
        <div className="mb-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleSearch(e)
                }
              }}
              placeholder="Search address (e.g., Lahore, Pakistan)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={handleSearch}
              disabled={searching}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {searching ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <FaSearch />
                  Search
                </>
              )}
            </button>
          </div>
        </div>

        {/* Current Address Display */}
        {address && (
          <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Selected Location:</span> {address}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Coordinates: {position[0].toFixed(6)}, {position[1].toFixed(6)}
            </p>
          </div>
        )}

        <p className="text-xs text-gray-500 mb-2">
          Click on the map or search for an address to set the property location
        </p>
      </div>

      {/* Map */}
      <div className="h-96 w-full rounded-lg overflow-hidden border-2 border-gray-200 shadow-lg">
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapClickHandler onLocationSelect={handleMapClick} />
          
          <Marker
            position={position}
            icon={customIcon}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target
                const newPos = marker.getLatLng()
                setPosition([newPos.lat, newPos.lng])
              }
            }}
          />
        </MapContainer>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-500">
        <FaMapMarkerAlt className="text-blue-500" />
        <span>You can drag the marker to adjust the exact location</span>
      </div>
    </div>
  )
}

export default LocationPicker
