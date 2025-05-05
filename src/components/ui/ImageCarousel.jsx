import { useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

function ImageCarousel({ images = [], currentIndex = 0, setCurrentIndex }) {
  const [showControls, setShowControls] = useState(false)
  
  // Return early if no images
  if (!images || !Array.isArray(images) || images.length === 0) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-t-xl bg-gray-200">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-500">No images available</p>
        </div>
      </div>
    )
  }
  
  const goToPrevious = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIndex(prev => prev === 0 ? images.length - 1 : prev - 1)
  }
  
  const goToNext = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIndex(prev => prev === images.length - 1 ? 0 : prev + 1)
  }

  return (
    <div
      className="relative aspect-square overflow-hidden rounded-t-xl"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div 
        className="absolute inset-0 transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        <div className="flex">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Listing view ${index + 1}`}
              className="w-full object-cover aspect-square flex-shrink-0"
              loading="lazy"
            />
          ))}
        </div>
      </div>
      
      {/* Image Indicators */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
      
      {/* Navigation Buttons */}
      {images.length > 1 && (showControls || window.innerWidth < 768) && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white p-1.5 rounded-full text-airbnb-dark focus:outline-none"
            aria-label="Previous image"
          >
            <FaChevronLeft size={12} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white p-1.5 rounded-full text-airbnb-dark focus:outline-none"
            aria-label="Next image"
          >
            <FaChevronRight size={12} />
          </button>
        </>
      )}
    </div>
  )
}

export default ImageCarousel