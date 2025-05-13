import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SearchBar from '../search/SearchBar'
import useCurrentUser from '../../hooks/useCurrentUser'

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80'
]

function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { user } = useCurrentUser()
  const navigate = useNavigate()
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % HERO_IMAGES.length)
    }, 6000)
    
    return () => clearInterval(interval)
  }, [])

  const handleHostClick = () => {
    if (user?.user_metadata?.role === 'host') {
      navigate('/hosting')
    } else {
      navigate('/host/signup')
    }
  }

  return (
    <div className="relative h-[80vh] max-h-[600px] mb-8">
      {/* Background Images */}
      <div className="absolute inset-0 overflow-hidden">
        {HERO_IMAGES.map((img, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${img})`,
              opacity: index === currentImageIndex ? 1 : 0
            }}
          />
        ))}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6 drop-shadow-lg">
          Find your next adventure
        </h1>
        <p className="text-xl md:text-2xl text-center mb-10 max-w-xl">
          Discover the perfect place to stay, anywhere in Pakistan
        </p>
        
        <div className="w-full max-w-4xl">
          <SearchBar />
        </div>
        
        <div className="mt-10">
  {user?.user_metadata?.role === 'host' && (
    <button 
      onClick={handleHostClick}
      className="bg-white text-airbnb-dark px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors shadow-lg"
    >
      Manage your Listings
    </button>
  )}
</div>

      </div>
    </div>
  )
}

export default Hero