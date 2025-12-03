import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaFilter, FaSort, FaHome, FaBuilding, FaTree, FaEllipsisH, FaCheck, FaTimes } from 'react-icons/fa'
import { HiAdjustmentsHorizontal, HiSparkles } from 'react-icons/hi2'
import { TbArrowsSort } from 'react-icons/tb'

const PROPERTY_TYPES = [
  { id: 'all', label: 'All', icon: FaHome },
  { id: 'Apartment', label: 'Apartments', icon: FaBuilding },
  { id: 'House', label: 'Houses', icon: FaHome },
  { id: 'Villa', label: 'Villas', icon: FaTree },
  { id: 'Others', label: 'Others', icon: FaEllipsisH }
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
  const [showPropertyTypes, setShowPropertyTypes] = useState(false)
  const [minPrice, setMinPrice] = useState(initialMinPrice)
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice)
  const [selectedAmenities, setSelectedAmenities] = useState([])

  const handleFilterChange = (filter) => {
    onFilterChange(filter)
    setShowPropertyTypes(false)
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
    <div className="relative my-8">
      <div className="flex items-center gap-4">
        {/* Desktop: Horizontal scrollable property types */}
        <motion.div
          ref={scrollRef}
          className="hidden md:flex gap-3 overflow-x-auto scrollbar-hide py-2 px-1 flex-grow"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {PROPERTY_TYPES.map((type, index) => (
            <motion.button
              key={type.id}
              onClick={() => handleFilterChange(type.id)}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -2, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center gap-2 min-w-fit px-6 py-3 rounded-xl transition-all duration-300 ${
                activeFilter === type.id 
                  ? 'bg-gradient-to-r from-[#0F1520] to-[#1a2332] text-white shadow-lg' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <type.icon className={`text-lg ${activeFilter === type.id ? 'text-white' : '#0F1520'}`} />
              <span className="text-sm font-medium whitespace-nowrap">{type.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Mobile: Property Types Dropdown */}
        <div className="md:hidden relative flex-grow">
          <motion.button
            onClick={() => {
              setShowPropertyTypes(!showPropertyTypes)
              setShowFilters(false)
              setShowSort(false)
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full px-4 py-3 rounded-xl flex items-center justify-between font-medium transition-all shadow-sm ${
              showPropertyTypes 
                ? 'bg-gradient-to-r from-[#0F1520] to-[#1a2332] text-white' 
                : 'bg-white text-gray-700 border border-gray-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {PROPERTY_TYPES.find(t => t.id === activeFilter)?.icon && (
                <div className="flex items-center">
                  {(() => {
                    const ActiveIcon = PROPERTY_TYPES.find(t => t.id === activeFilter).icon;
                    return <ActiveIcon className={`text-lg ${showPropertyTypes ? 'text-white' : '#0F1520'}`} />;
                  })()}
                </div>
              )}
              <span className="text-sm">
                {PROPERTY_TYPES.find(t => t.id === activeFilter)?.label || 'All'}
              </span>
            </div>
            <motion.div
              animate={{ rotate: showPropertyTypes ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <svg className={`w-4 h-4 ${showPropertyTypes ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {showPropertyTypes && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-30"
              >
                <div className="bg-gradient-to-r from-[#0F1520] to-[#1a2332] px-4 py-3">
                  <h3 className="font-bold text-white text-sm">Property Type</h3>
                </div>
                <div className="p-2">
                  {PROPERTY_TYPES.map((type) => (
                    <motion.button
                      key={type.id}
                      onClick={() => handleFilterChange(type.id)}
                      whileHover={{ x: 5, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between ${
                        activeFilter === type.id 
                          ? 'bg-gradient-to-r from-gray-50 to-blue-100 text-[#0F1520] font-semibold shadow-sm' 
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <type.icon className={`text-lg ${activeFilter === type.id ? '#0F1520' : 'text-gray-400'}`} />
                        <span className="text-sm">{type.label}</span>
                      </div>
                      {activeFilter === type.id && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="w-5 h-5 bg-gradient-to-r from-[#0F1520] to-[#1a2332] rounded-full flex items-center justify-center shadow-md"
                        >
                          <FaCheck className="text-white text-xs" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => {
              setShowFilters(!showFilters)
              setShowSort(false)
              setShowPropertyTypes(false)
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-3 rounded-xl flex items-center gap-2 font-medium transition-all shadow-sm ${
              showFilters 
                ? 'bg-gradient-to-r from-[#0F1520] to-[#1a2332] text-white' 
                : 'bg-white text-gray-700 border border-gray-200 hover:border-[#0F1520]'
            }`}
          >
            <HiAdjustmentsHorizontal className={`text-lg ${
              showFilters ? 'text-white' : 'text-[#0F1520]'
            }`} />
            <span className="hidden sm:inline">Filters</span>
            {(selectedAmenities.length > 0 || minPrice || maxPrice) && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-white text-[#0F1520] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
              >
                {selectedAmenities.length + (minPrice ? 1 : 0) + (maxPrice ? 1 : 0)}
              </motion.span>
            )}
          </motion.button>

          <div className="relative">
            <motion.button
              onClick={() => {
                setShowSort(!showSort)
                setShowFilters(false)
                setShowPropertyTypes(false)
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-3 rounded-xl flex items-center gap-2 font-medium transition-all shadow-sm ${
                showSort 
                  ? 'bg-gradient-to-r from-[#0F1520] to-[#1a2332] text-white' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-[#0F1520]'
              }`}
            >
              <TbArrowsSort className={`text-xl ${
                showSort ? 'text-white' : 'text-[#0F1520]'
              }`} />
              <span className="hidden sm:inline">Sort</span>
            </motion.button>

            <AnimatePresence>
              {showSort && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-20"
                >
                  {/* Header with gradient background */}
                  <div className="bg-gradient-to-r from-[#0F1520] to-[#1a2332] px-5 py-4">
                    <h3 className="font-bold text-white flex items-center gap-2">
                      <TbArrowsSort className="text-lg" />
                      Sort By
                    </h3>
                  </div>
                  
                  <div className="p-3 space-y-1">
                    {[
                      { id: 'price_high_low', label: 'Price: High to Low', icon: '💰' },
                      { id: 'price_low_high', label: 'Price: Low to High', icon: '💵' },
                      { id: 'rating_high_low', label: 'Rating: High to Low', icon: '⭐' },
                      { id: 'rating_low_high', label: 'Rating: Low to High', icon: '🌟' }
                    ].map((option) => (
                      <motion.button
                        key={option.id}
                        onClick={() => handleSortChange(option.id)}
                        whileHover={{ x: 5, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full text-left px-4 py-3.5 rounded-xl transition-all flex items-center justify-between group ${
                          currentSort === option.id 
                            ? 'bg-gradient-to-r from-gray-50 to-blue-100 text-[#0F1520] font-semibold shadow-sm' 
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{option.icon}</span>
                          <span className="text-sm">{option.label}</span>
                        </div>
                        {currentSort === option.id && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="w-6 h-6 bg-gradient-to-r from-[#0F1520] to-[#1a2332] rounded-full flex items-center justify-center shadow-md"
                          >
                            <FaCheck className="text-white text-xs" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-[360px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-20"
          >
            {/* Header with gradient background */}
            <div className="bg-gradient-to-r from-[#0F1520] to-[#1a2332] px-4 py-3 flex items-center justify-between">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <HiAdjustmentsHorizontal className="text-base" />
                Filters
              </h3>
              <motion.button
                onClick={() => setShowFilters(false)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors backdrop-blur-sm"
              >
                <FaTimes className="text-white text-sm" />
              </motion.button>
            </div>

            <div className="p-4">
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                <span className="text-base">💰</span>
                Price Range
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-600 mb-1.5 font-medium">Minimum</label>
                  <div className="relative">
                    <span className="ml-[1px] absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">Rs.  </span>
                    <motion.input
                      type="number"
                      placeholder="0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      whileFocus={{ scale: 1.02 }}
                      className="ml-2 w-full pl-7 pr-3 py-2 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F1520] focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1.5 font-medium">Maximum</label>
                  <div className="relative">
                    <span className="ml-[1px] absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">Rs.  </span>
                    <motion.input
                      type="number"
                      placeholder="1000"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      whileFocus={{ scale: 1.02 }}
                      className="ml-2 w-full pl-7 pr-3 py-2 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F1520] focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                <span className="text-base">✨</span>
                Amenities
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {BASIC_AMENITIES.map((amenity, index) => (
                  <motion.label
                    key={amenity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center justify-center p-2 rounded-xl cursor-pointer transition-all shadow-sm ${
                      selectedAmenities.includes(amenity.id)
                        ? 'bg-gradient-to-r from-[#0F1520] to-[#1a2332] text-white border-2 border-[#0F1520] shadow-lg'
                        : 'border-2 border-gray-200 hover:border-blue-400 hover:shadow-md text-gray-700 bg-white'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity.id)}
                      onChange={() => handleAmenityToggle(amenity.id)}
                      className="sr-only"
                    />
                    <span className="text-xs font-medium text-center">{amenity.label}</span>
                    {selectedAmenities.includes(amenity.id) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-2"
                      >
                        <FaCheck className="text-xs" />
                      </motion.div>
                    )}
                  </motion.label>
                ))}
              </div>
            </div>
            </div>

            <div className="flex gap-2 p-4 pt-0">
              <motion.button
                onClick={() => {
                  setMinPrice('')
                  setMaxPrice('')
                  setSelectedAmenities([])
                }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-3 py-2 text-sm border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
              >
                Clear All
              </motion.button>
              <motion.button
                onClick={handlePriceSubmit}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-3 py-2 text-sm bg-gradient-to-r from-[#0F1520] to-[#1a2332] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Apply Filters
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PropertyFilters