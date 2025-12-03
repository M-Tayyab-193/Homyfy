import { MapContainer, TileLayer, Marker, Popup, Circle, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { motion } from 'framer-motion'

// Custom marker icon with blue color
const customIcon = new L.DivIcon({
  html: `
    <div class="relative">
      <div class="absolute -top-10 -left-5 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg flex items-center justify-center animate-bounce">
        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
        </svg>
      </div>
      <div class="absolute -top-5 -left-5 w-10 h-10 bg-blue-400 rounded-full opacity-30 animate-ping"></div>
    </div>
  `,
  className: 'custom-map-marker',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
})

function Map({ latitude, longitude, zoom = 13, title = '', showPopup = true, price = null }) {
  const position = [latitude, longitude]

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
          color: '#3b82f6',
          fillColor: '#60a5fa',
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
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-lg font-semibold text-sm inline-block">
                  Rs. {price.toLocaleString()}/night
                </div>
              )}
              <div className="text-gray-600 text-sm mt-2 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                </svg>
                Exact location provided after booking
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