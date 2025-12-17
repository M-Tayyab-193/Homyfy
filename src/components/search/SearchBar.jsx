import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { FaSearch, FaUserFriends, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa'
import { MdArrowForward } from 'react-icons/md'
import GuestsCounter from './GuestsCounter'
import DateRangePicker from './DateRangePicker'

function SearchBar({ onSearch }) {
  const navigate = useNavigate()
  const [location, setLocation] = useState('')
  const [isGuestsOpen, setIsGuestsOpen] = useState(false)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [guests, setGuests] = useState(0)
  const [focusedInput, setFocusedInput] = useState(null)
  const [locationSuggestions, setLocationSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const debounceTimerRef = useRef(null)
  const [dateRange, setDateRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: 'selection'
    }
  ])
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate all required fields
    const missingFields = []
    
    if (!location.trim()) {
      missingFields.push('Location')
    }
    
    if (!dateRange[0].startDate || !dateRange[0].endDate) {
      missingFields.push('Check-in and Check-out dates')
    }
    
    if (guests === 0) {
      missingFields.push('Number of guests')
    }
    
    if (missingFields.length > 0) {
      toast.error(`Please provide: ${missingFields.join(', ')}`, {
        position: 'top-center',
        autoClose: 4000,
      })
      return
    }
    
    const queryParams = new URLSearchParams({
      location: location.trim(),
      guests: guests
    }).toString()
    
    navigate(`/search?${queryParams}`)
    
    if (onSearch) {
      onSearch()
    }
  }

  const toggleGuests = () => {
    setIsGuestsOpen(!isGuestsOpen)
    setIsDatePickerOpen(false)
  }

  const toggleDatePicker = () => {
    setIsDatePickerOpen(!isDatePickerOpen)
    setIsGuestsOpen(false)
  }

  const handleDateChange = (ranges) => {
    setDateRange([ranges.selection])
  }

  // Fetch location suggestions with debouncing
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    if (location.trim().length < 3) {
      setLocationSuggestions([])
      setShowSuggestions(false)
      return
    }

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=5`,
          {
            headers: {
              'User-Agent': 'Homyfy Property Rental App'
            }
          }
        )
        const data = await response.json()
        setLocationSuggestions(data)
        setShowSuggestions(data.length > 0)
      } catch (error) {
        console.error('Error fetching location suggestions:', error)
      }
    }, 300)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [location])

  const handleSuggestionClick = (suggestion) => {
    setLocation(suggestion.display_name)
    setShowSuggestions(false)
    setLocationSuggestions([])
  }

  const formatDate = (date) => {
    if (!date) return 'Add date'
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="relative z-50">
      <motion.form 
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row items-stretch lg:items-stretch bg-white rounded-3xl lg:rounded-full overflow-hidden transition-all duration-300"
      >
        {/* Location Section */}
        <motion.div 
          className="flex-1 relative sm:px-6 py-4 border-b lg:border-b-0 lg:border-r border-gray-200 flex items-center"
          animate={{
            scale: focusedInput === 'location' ? 1.02 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <FaMapMarkerAlt 
              className="text-gray-600 text-base sm:text-lg flex-shrink-0 max-sm:ml-4" 
              style={{ color: focusedInput === 'location' ? '#0F1520' : '#6b7280' }} 
            />
            <div className="flex-1">
              <label htmlFor="search-location" className="text-md font-semibold text-gray-900 block mb-[1px]">
                Location
              </label>
              <input
                id="search-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onFocus={() => setFocusedInput('location')}
                onBlur={() => {
                  setTimeout(() => {
                    setShowSuggestions(false)
                  }, 200)
                }}
                className="w-full focus:outline-none text-sm text-gray-600 placeholder-gray-400 bg-transparent"
                placeholder="Where to?"
                required
              />
            </div>
          </div>

            {/* Location Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && locationSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-[70] max-h-64 overflow-y-auto"
                >
                  {locationSuggestions.map((suggestion, index) => (
                    <motion.div
                      key={suggestion.place_id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <FaMapMarkerAlt className="text-blue-500 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {suggestion.display_name}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {suggestion.type}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
        </motion.div>
        
        {/* Mobile: Date Section Combined */}
        <div className="lg:hidden">
          <motion.div 
            className="relative px-4 sm:px-6 py-4 border-b border-gray-200 cursor-pointer"
            onClick={toggleDatePicker}
            animate={{
              scale: isDatePickerOpen ? 1.02 : 1,
            }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-3">
              <FaCalendarAlt 
                className="text-gray-600 text-base sm:text-lg flex-shrink-0" 
                style={{ color: isDatePickerOpen ? '#0F1520' : '#6b7280' }} 
              />
              <div className="flex-1">
                <div className="text-md font-semibold text-gray-900 block mb-1">
                  Dates
                </div>
                <div className="text-sm text-gray-600">
                  {formatDate(dateRange[0].startDate)} - {formatDate(dateRange[0].endDate)}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Desktop: Check In Section */}
        <motion.div 
          className="hidden lg:flex flex-1 relative px-6 py-4 cursor-pointer items-center"
          onClick={toggleDatePicker}
          animate={{
            scale: isDatePickerOpen ? 1.02 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-3 flex-1">
            <FaCalendarAlt 
              className="text-gray-600 text-lg flex-shrink-0" 
              style={{ color: isDatePickerOpen ? '#0F1520' : '#6b7280' }} 
            />
            <div className="flex-1">
              <div className="text-md font-semibold text-gray-900 block mb-1">
                Check in
              </div>
              <div className="text-sm text-gray-600">
                {formatDate(dateRange[0].startDate)}
              </div>
            </div>
          </div>
          {/* Arrow Icon Between Dates - Desktop Only */}
          <MdArrowForward className="text-gray-400 text-sm mx-2" />
        </motion.div>

        {/* Desktop: Check Out Section */}
        <motion.div 
          className="hidden lg:flex flex-1 relative px-6 py-4 border-r border-gray-200 cursor-pointer items-center"
          onClick={toggleDatePicker}
          animate={{
            scale: isDatePickerOpen ? 1.02 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <FaCalendarAlt 
              className="text-gray-600 text-lg flex-shrink-0" 
              style={{ color: isDatePickerOpen ? '#0F1520' : '#6b7280' }} 
            />
            <div className="flex-1">
              <div className="text-md font-semibold text-gray-900 block mb-1">
                Check out
              </div>
              <div className="text-sm text-gray-600">
                {formatDate(dateRange[0].endDate)}
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Guests Section */}
        <motion.div 
          className="flex-1 relative px-4 sm:px-6 py-4 border-b lg:border-b-0 flex items-center"
          animate={{
            scale: isGuestsOpen ? 1.02 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            className="flex items-center gap-3 w-full text-left focus:outline-none"
            onClick={toggleGuests}
            onFocus={() => setFocusedInput('guests')}
            onBlur={() => setFocusedInput(null)}
          >
            <FaUserFriends 
              className="text-gray-600 text-base sm:text-lg flex-shrink-0" 
              style={{ color: isGuestsOpen ? '#0F1520' : '#6b7280' }} 
            />
            <div className="flex-1">
              <div className="text-md font-semibold text-gray-900 block mb-1">
                Guests
              </div>
              <div className="text-sm text-gray-600">
                {guests} {guests === 1 ? 'guest' : 'guests'}
              </div>
            </div>
          </button>
        </motion.div>

        {/* Search Button */}
        <motion.button
          type="submit"
          className="text-white px-8 py-3 mx-2 my-2 lg:my-0 rounded-full relative overflow-hidden group flex items-center justify-center gap-2 self-center"
          style={{ background: 'linear-gradient(to right, #0F1520, #1a2332)' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Search"
        >
          <motion.div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, #1a2332, #253549)' }}
            initial={{ x: '-100%' }}
            whileHover={{ x: 0 }}
            transition={{ duration: 0.3 }}
          />
          <FaSearch className="relative z-10" />
          <span className="relative z-10 font-medium">Search</span>
        </motion.button>
      </motion.form>
      
      {/* Date Picker Dropdown */}
      <AnimatePresence>
        {isDatePickerOpen && (
          <>
            {/* Backdrop for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[55] lg:hidden"
              onClick={() => setIsDatePickerOpen(false)}
            />
            
            {/* Date Picker */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] flex items-center justify-center p-4 lg:relative lg:inset-auto lg:p-0 lg:flex-none lg:block pointer-events-none lg:pointer-events-auto"
            >
              <div className="w-full max-w-[360px] pointer-events-auto shadow-2xl rounded-2xl bg-white lg:absolute lg:bottom-full lg:left-0 lg:mb-4 lg:w-auto">
                <DateRangePicker 
                  ranges={dateRange}
                  onChange={handleDateChange}
                  onClose={() => setIsDatePickerOpen(false)}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Guests Dropdown */}
      <AnimatePresence>
        {isGuestsOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 lg:relative lg:inset-auto lg:p-0 lg:flex-none lg:block pointer-events-none lg:pointer-events-auto"
          >
            <div className="w-full max-w-sm pointer-events-auto shadow-2xl rounded-2xl bg-white lg:absolute lg:bottom-full lg:right-0 lg:mb-4">
              <GuestsCounter 
                guests={guests}
                onChange={setGuests}
                onClose={() => setIsGuestsOpen(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SearchBar