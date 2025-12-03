import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FaChevronDown, FaStar, FaHome, FaMapMarkerAlt } from 'react-icons/fa'
import SearchBar from '../search/SearchBar'
import AnimatedCounter from './AnimatedCounter'
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
  const heroRef = useRef(null)
  
  // Parallax effect
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  
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

  // Floating animation variants
  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  // Stats for the hero section
  const stats = [
    { icon: FaHome, value: 1000, suffix: '+', label: 'Properties', color: 'text-blue-400' },
    { icon: FaStar, value: 4.5, decimals: 1, label: 'Average Rating', color: 'text-yellow-400' },
    { icon: FaMapMarkerAlt, value: 3, suffix: '+', label: 'Cities', color: 'text-blue-400' }
  ]

  return (
    <div ref={heroRef} className="relative h-[85vh] max-h-[700px] mb-12 pb-32 z-10">
      {/* Background Images with Parallax */}
      <motion.div 
        style={{ y }}
        className="absolute inset-0 overflow-hidden -z-10"
      >
        {HERO_IMAGES.map((img, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ 
              opacity: index === currentImageIndex ? 1 : 0,
              scale: index === currentImageIndex ? 1 : 1.1
            }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/50"></div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 3) * 20}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>
      
      {/* Content */}
      <motion.div 
        style={{ opacity }}
        className="relative h-full flex flex-col items-center justify-center text-white px-4 z-10"
      >
        {/* Animated Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-6 drop-shadow-2xl">
            Find your next{' '}
            <span className="relative inline-block">
              <motion.span
                className="gradient-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{ backgroundSize: '200% 200%' }}
              >
                adventure
              </motion.span>
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
              />
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg md:text-2xl text-center mb-8 max-w-2xl drop-shadow-lg"
        >
          Discover the perfect place to stay, anywhere in Pakistan
        </motion.p>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex gap-8 mb-10"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
              className="glass-dark rounded-xl px-6 py-3 text-center backdrop-blur-md"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <stat.icon className={`text-2xl mx-auto mb-1 ${stat.color}`} />
              <div className="text-2xl font-bold">
                <AnimatedCounter 
                  end={stat.value} 
                  suffix={stat.suffix || ''}
                  decimals={stat.decimals || 0}
                  duration={2}
                />
              </div>
              <div className="text-sm opacity-90">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Search Bar with Glass Effect */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="w-full max-w-4xl"
        >
          <div className="glass-dark rounded-2xl p-2 shadow-glass">
            <SearchBar />
          </div>
        </motion.div>
        
        {/* Host Button */}
        {user?.user_metadata?.role === 'host' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="mt-8"
          >
            <motion.button
              onClick={handleHostClick}
              className="btn-primary relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Manage your Listings</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </motion.div>
        )}


      </motion.div>

      {/* Image Indicators */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {HERO_IMAGES.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentImageIndex ? 'w-8 bg-white' : 'w-1.5 bg-white/50'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </div>
  )
}

export default Hero