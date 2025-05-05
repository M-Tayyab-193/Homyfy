import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaSearch, FaUserFriends } from 'react-icons/fa'
import GuestsCounter from './GuestsCounter'

function SearchBar({ onSearch }) {
  const navigate = useNavigate()
  const [location, setLocation] = useState('')
  const [isGuestsOpen, setIsGuestsOpen] = useState(false)
  const [guests, setGuests] = useState(1)
  
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
    <div className="relative">
      <form 
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row items-center bg-white border border-gray-300 rounded-full overflow-hidden shadow-sm hover:shadow-md transition-shadow divide-y md:divide-y-0 md:divide-x divide-gray-300"
      >
        {/* Location Input */}
        <div className="w-full md:w-1/2 relative">
          <input
            id="search-location"
            type="text"
            placeholder="Where are you going?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-8 py-3 focus:outline-none text-sm md:text-base text-black"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-airbnb-primary" />
        </div>
        
        {/* Guests */}
        <div className="w-full md:w-1/2 flex items-center">
          <button
            type="button"
            className="flex-grow px-8 py-3 text-left focus:outline-none text-sm md:text-base relative"
            onClick={toggleGuests}
          >
            <FaUserFriends className="absolute left-3 top-1/2 transform -translate-y-1/2 text-airbnb-dark" />
            <span className="text-airbnb-dark">
              {guests} {guests === 1 ? 'guest' : 'guests'}
            </span>
          </button>
          
          <button
            type="submit"
            className="bg-airbnb-primary text-white p-3 rounded-full mx-2 hover:bg-opacity-90 transition-all"
            aria-label="Search"
          >
            <FaSearch />
          </button>
        </div>
      </form>
      
      {/* Guests Dropdown */}
      {isGuestsOpen && (
        <div className="absolute right-0 md:right-1/6 mt-2 bg-white rounded-2xl shadow-lg z-10 border border-gray-200">
          <GuestsCounter 
            guests={guests}
            onChange={setGuests}
            onClose={() => setIsGuestsOpen(false)}
          />
        </div>
      )}
    </div>
  )
}

export default SearchBar