import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaSearch, FaUserFriends, FaMapMarkerAlt } from 'react-icons/fa'
import GuestsCounter from './GuestsCounter'

function SearchBar({ onSearch }) {
  const navigate = useNavigate()
  const [location, setLocation] = useState('')
  const [isGuestsOpen, setIsGuestsOpen] = useState(false)
  const [guests, setGuests] = useState(1)
  const [focusedInput, setFocusedInput] = useState(null)
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
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
  }

  return (
    <div className="relative z-50 ">
      <motion.form 
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-center bg-white rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 divide-y md:divide-y-0 md:divide-x divide-gray-200"
      >
        {/* Location Input */}
        <motion.div 
          className="w-full md:w-1/2 relative"
          animate={{
            scale: focusedInput === 'location' ? 1.02 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center">
            <motion.div
              animate={{
                scale: focusedInput === 'location' ? 1.2 : 1,
                rotate: focusedInput === 'location' ? 360 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              <FaMapMarkerAlt className="text-blue-500 text-lg" />
            </motion.div>
          </div>
          <input
            id="search-location"
            type="text"
            placeholder="Where are you going?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onFocus={() => setFocusedInput('location')}
            onBlur={() => setFocusedInput(null)}
            className="w-full pl-12 pr-4 py-4 focus:outline-none text-sm md:text-base text-gray-800 placeholder-gray-400 bg-transparent transition-all"
          />
          {location && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              type="button"
              onClick={() => setLocation('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              ×
            </motion.button>
          )}
        </motion.div>
        
        {/* Guests */}
        <motion.div 
          className="w-full md:w-1/2 flex items-center"
          animate={{
            scale: focusedInput === 'guests' ? 1.02 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            className="flex-grow pl-12 pr-4 py-4 text-left focus:outline-none text-sm md:text-base relative group"
            onClick={toggleGuests}
            onFocus={() => setFocusedInput('guests')}
            onBlur={() => setFocusedInput(null)}
          >
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center">
              <motion.div
                animate={{
                  scale: focusedInput === 'guests' || isGuestsOpen ? 1.2 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <FaUserFriends className="text-gray-600 group-hover:text-blue-500 transition-colors text-lg" />
              </motion.div>
            </div>
            <span className="text-gray-800">
              {guests} {guests === 1 ? 'guest' : 'guests'}
            </span>
          </button>
          
          <motion.button
            type="submit"
            className="max-sm:mr-5 max-sm:w-10 max-sm:h-10 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-full mx-2 relative overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Search"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-400 to-sky-500"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
            <FaSearch className="relative max-sm:right-[3px] max-sm:bottom-[3px] z-10" />
          </motion.button>
        </motion.div>
      </motion.form>
      
      {/* Guests Dropdown */}
      <AnimatePresence>
        {isGuestsOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 md:right-1/6 mt-2 bg-white rounded-2xl shadow-2xl z-[60] border border-gray-100"
          >
            <GuestsCounter 
              guests={guests}
              onChange={setGuests}
              onClose={() => setIsGuestsOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SearchBar