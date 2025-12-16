import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import SearchBar from '../search/SearchBar'
import useCurrentUser from '../../hooks/useCurrentUser'
import bgImage from '../../assets/bg.jpg'

function Hero() {
  const { user } = useCurrentUser()
  const navigate = useNavigate()
  const heroRef = useRef(null)

  const handleHostClick = () => {
    if (user?.user_metadata?.role === 'host') {
      navigate('/hosting')
    } else {
      navigate('/host/signup')
    }
  }

  return (
    <div ref={heroRef} className="relative w-full -mt-[80px]">
      {/* Background Image Section - 90vh height */}
      <div className="relative h-[90vh] w-full">
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"></div>
        </motion.div>

        {/* Content Overlay on Image */}
        <div className="relative h-full flex flex-col items-center justify-center text-white px-4 z-10 pt-20">
          {/* Animated Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-6 drop-shadow-2xl text-white" style={{ fontFamily: '"Amethysta", sans-serif' }}>
              Explore Luxury Stays with Virtual Tours{' '}
              <span className="relative inline-block lg:mt-4">
                <span className="text-white">
                   & Detailed Listings
                </span>
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg md:text-xl text-center mb-8 max-w-2xl drop-shadow-lg text-white"
          >
            From interactive virtual tours to comprehensive listings, explore luxury with confidence
          </motion.p>
        </div>

        {/* Search Bar Section - Positioned at bottom boundary of hero image, centered */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-20 w-full px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="w-full max-w-5xl mx-auto"
          >
            <div className="bg-white rounded-3xl lg:rounded-full shadow-md px-3 py-2 sm:px-4 sm:py-2 lg:px-6 lg:py-3">
              <SearchBar />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Hero