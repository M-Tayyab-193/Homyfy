import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Custom marker icon with blue color
const customIcon = new L.DivIcon({
  html: `
    <div class="relative">
      <div class="absolute -top-10 -left-5 w-10 h-10 bg-gradient-to-br from-[#0F1520] to-[#1a2332] rounded-full shadow-lg flex items-center justify-center animate-bounce">
        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
        </svg>
      </div>
      <div class="absolute -top-5 -left-5 w-10 h-10 bg-[#0F1520] rounded-full opacity-30 animate-ping"></div>
    </div>
  `,
  className: 'custom-map-marker',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
})

function Map({ latitude, longitude, zoom = 13, title = '', showPopup = true, price = null }) {
  const position = [latitude, longitude]
  const [address, setAddress] = useState('Loading address...')
  
  // Reverse geocoding to get address from coordinates
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'Homyfy Property Rental App'
            }
          }
        )
        const data = await response.json()
        
        if (data.address) {
          // Build a readable address
          const parts = []
          if (data.address.road) parts.push(data.address.road)
          if (data.address.suburb || data.address.neighbourhood) {
            parts.push(data.address.suburb || data.address.neighbourhood)
          }
          if (data.address.city || data.address.town || data.address.village) {
            parts.push(data.address.city || data.address.town || data.address.village)
          }
          if (data.address.state) parts.push(data.address.state)
          if (data.address.country) parts.push(data.address.country)
          
          setAddress(parts.join(', ') || data.display_name)
        } else {
          setAddress(data.display_name || 'Address not available')
        }
      } catch (error) {
        console.error('Error fetching address:', error)
        setAddress('Address unavailable')
      }
    }
    
    if (latitude && longitude) {
      fetchAddress()
    }
  }, [latitude, longitude])

  return (
    <MapContainer 
      center={position} 
      zoom={zoom} 
      scrollWheelZoom={false}
      className="h-full w-full rounded-lg shadow-lg"
      style={{ zIndex: 1 }}
    >
      {/* Enhanced tile layer with better visuals */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Area circle to show approximate location */}
      <Circle
        center={position}
        radius={300}
        pathOptions={{
          color: '#0F1520',
          fillColor: '#1a2332',
          fillOpacity: 0.2,
          weight: 2
        }}
      />
      
      {/* Custom marker with enhanced design */}
      <Marker position={position} icon={customIcon}>
        {showPopup && (
          <Popup className="custom-popup">
            <div className="p-2 min-w-[200px]">
              {title && (
                <h3 className="font-bold text-gray-900 mb-2 text-base">{title}</h3>
              )}
              {price && (
                <div className="bg-gradient-to-r from-[#0F1520] to-[#1a2332] text-white px-3 py-1.5 rounded-lg font-semibold text-sm inline-block mb-2">
                  Rs. {price.toLocaleString()}/night
                </div>
              )}
              <div className="text-gray-600 text-xs mt-2 pt-2 border-t border-gray-200">
                <div className="flex items-start gap-1.5">
                  <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="leading-tight">{address}</span>
                </div>
              </div>
            </div>
          </Popup>
        )}
        <Tooltip direction="top" offset={[0, -40]} opacity={0.9} permanent={false}>
          <div className="font-semibold text-sm">
            {price ? `Rs. ${price.toLocaleString()}` : 'View details'}
          </div>
        </Tooltip>
      </Marker>
    </MapContainer>
  )
}

export default Map