import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlay, FaPause, FaChevronLeft, FaChevronRight, FaExpand, FaTimes } from 'react-icons/fa'
import useGesture from '../../../hooks/useGesture'
import { 
  mapDragToIndex, 
  normalizeIndex, 
  calculateVelocity, 
  getRotationProgress,
  getRotationDirection,
  preloadAdjacentImages 
} from '../../../utils/rotationUtils'

/**
 * Pseudo-360° Image Viewer Component
 * Creates immersive rotating room view from 6-12 normal photos
 */
function Pseudo360Viewer({ 
  images = [],
  autoRotate = false,
  rotationSpeed = 8, // seconds per full rotation
  enableDrag = true,
  showControls = true,
  showThumbnails = true,
  showInstructions = true,
  onImageChange,
  onClose
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoRotating, setIsAutoRotating] = useState(autoRotate)
  const [showHint, setShowHint] = useState(showInstructions)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [preloadedIndices, setPreloadedIndices] = useState(new Set([0]))
  
  const autoRotateRef = useRef(null)
  const inactivityTimerRef = useRef(null)
  const containerRef = useRef(null)

  // Normalize images to always have url property
  const normalizedImages = images.map(img => 
    typeof img === 'string' ? { url: img, order: 0 } : img
  )

  const imageCount = normalizedImages.length

  /**
   * Change image index with proper wrapping
   */
  const changeImage = useCallback((newIndex) => {
    const normalized = normalizeIndex(newIndex, imageCount)
    setCurrentIndex(normalized)
    
    // Preload adjacent images
    preloadAdjacentImages(normalizedImages, normalized, 2)
    
    if (onImageChange) {
      onImageChange(normalized)
    }

    // Hide hint after first interaction
    if (showHint) {
      setShowHint(false)
    }
  }, [imageCount, normalizedImages, onImageChange, showHint])

  /**
   * Handle drag interaction
   */
  const { isDragging, handlers } = useGesture({
    onDragStart: () => {
      // Pause auto-rotation while dragging
      if (isAutoRotating) {
        setIsAutoRotating(false)
      }
      clearTimeout(inactivityTimerRef.current)
    },
    onDrag: ({ offsetX, positions }) => {
      // Map drag to index
      const indexOffset = mapDragToIndex(offsetX, imageCount, 80)
      const newIndex = currentIndex - indexOffset // Negative for intuitive direction
      changeImage(newIndex)
    },
    onDragEnd: ({ positions }) => {
      // Calculate momentum
      const velocity = calculateVelocity(positions)
      
      if (Math.abs(velocity) > 0.5) {
        // Apply momentum for smooth deceleration
        const momentumSteps = Math.round(Math.abs(velocity) * 3)
        const direction = velocity > 0 ? -1 : 1
        const targetIndex = currentIndex + (direction * momentumSteps)
        changeImage(targetIndex)
      }

      // Resume auto-rotation after inactivity
      if (autoRotate) {
        inactivityTimerRef.current = setTimeout(() => {
          setIsAutoRotating(true)
        }, 2000)
      }
    }
  })

  /**
   * Auto-rotation effect
   */
  useEffect(() => {
    if (isAutoRotating && imageCount > 0) {
      const interval = (rotationSpeed * 1000) / imageCount
      
      autoRotateRef.current = setInterval(() => {
        setCurrentIndex(prev => normalizeIndex(prev + 1, imageCount))
      }, interval)

      return () => clearInterval(autoRotateRef.current)
    }
  }, [isAutoRotating, imageCount, rotationSpeed])

  /**
   * Keyboard navigation
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        changeImage(currentIndex - 1)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        changeImage(currentIndex + 1)
      } else if (e.key === ' ') {
        e.preventDefault()
        setIsAutoRotating(prev => !prev)
      } else if (e.key === 'Escape') {
        if (isFullscreen) setIsFullscreen(false)
        if (onClose) onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, changeImage, isFullscreen, onClose])

  /**
   * Preload images on mount
   */
  useEffect(() => {
    preloadAdjacentImages(normalizedImages, 0, 3)
  }, [normalizedImages])

  /**
   * Handle thumbnail click
   */
  const handleThumbnailClick = (index) => {
    changeImage(index)
    if (isAutoRotating) setIsAutoRotating(false)
  }

  /**
   * Toggle fullscreen
   */
  const toggleFullscreen = () => {
    if (!isFullscreen && containerRef.current) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen()
      }
    } else if (document.fullscreenElement) {
      document.exitFullscreen()
    }
    setIsFullscreen(!isFullscreen)
  }

  const rotationProgress = getRotationProgress(currentIndex, imageCount)

  if (imageCount === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-xl">
        <p className="text-gray-500">No images available</p>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'rounded-xl overflow-hidden'}`}
    >
      {/* Main Image Viewer */}
      <div 
        className={`relative ${isFullscreen ? 'h-screen' : 'h-[500px] md:h-[600px]'} bg-gray-900 overflow-hidden select-none`}
        {...(enableDrag ? handlers : {})}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {/* Image Display */}
        <AnimatePresence mode="sync">
          <motion.img
            key={currentIndex}
            src={normalizedImages[currentIndex]?.url}
            alt={normalizedImages[currentIndex]?.description || `View ${currentIndex + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            draggable={false}
          />
        </AnimatePresence>

        {/* Gradient Overlay for Controls */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 pointer-events-none" />

        {/* First-time Instructions Overlay */}
        {showHint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-20"
            onClick={() => setShowHint(false)}
          >
            <div className="glass-dark p-8 rounded-2xl text-center text-white max-w-md">
              <div className="text-5xl mb-4">👆</div>
              <h3 className="text-2xl font-bold mb-3">Drag to Explore</h3>
              <p className="text-white/80 mb-4">Click and drag left or right to rotate the view</p>
              <div className="flex justify-center gap-6 text-sm text-white/70">
                <div>⌨️ Arrow keys</div>
                <div>▶️ Auto-rotate</div>
                <div>⎋ Exit</div>
              </div>
              <button
                onClick={() => setShowHint(false)}
                className="mt-6 px-6 py-2 bg-[#0F1520] hover:bg-[#1a2332] rounded-full transition-colors"
              >
                Got it!
              </button>
            </div>
          </motion.div>
        )}

        {/* Directional Hints */}
        {!isDragging && !isAutoRotating && (
          <>
            <motion.div
              className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              animate={{ x: [-10, 0, -10] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FaChevronLeft className="text-white/50 text-4xl drop-shadow-lg" />
            </motion.div>
            <motion.div
              className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
              animate={{ x: [10, 0, 10] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FaChevronRight className="text-white/50 text-4xl drop-shadow-lg" />
            </motion.div>
          </>
        )}

        {/* Top Controls */}
        {showControls && (
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-30">
            {/* Image Counter */}
            <div className="glass-dark px-4 py-2 rounded-full text-white text-sm font-medium">
              {currentIndex + 1} / {imageCount}
            </div>

            {/* Right Controls */}
            <div className="flex gap-2">
              {/* Auto-rotate Toggle */}
              <motion.button
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                className={`glass-dark p-3 rounded-full transition-colors ${
                  isAutoRotating ? 'text-blue-400' : 'text-white'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={isAutoRotating ? 'Pause rotation' : 'Auto-rotate'}
              >
                {isAutoRotating ? <FaPause /> : <FaPlay />}
              </motion.button>

              {/* Fullscreen Toggle */}
              <motion.button
                onClick={toggleFullscreen}
                className="glass-dark p-3 rounded-full text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Fullscreen"
              >
                <FaExpand />
              </motion.button>

              {/* Close Button */}
              {onClose && (
                <motion.button
                  onClick={onClose}
                  className="glass-dark p-3 rounded-full text-white"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Close viewer"
                >
                  <FaTimes />
                </motion.button>
              )}
            </div>
          </div>
        )}

        {/* Circular Progress Indicator */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30">
          <svg width="60" height="60" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="30"
              cy="30"
              r="25"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="3"
            />
            {/* Progress circle */}
            <motion.circle
              cx="30"
              cy="30"
              r="25"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 25}`}
              strokeDashoffset={`${2 * Math.PI * 25 * (1 - rotationProgress / 100)}`}
              animate={{
                strokeDashoffset: `${2 * Math.PI * 25 * (1 - rotationProgress / 100)}`
              }}
              transition={{ duration: 0.3 }}
            />
          </svg>
        </div>
      </div>

      {/* Thumbnail Navigation */}
      {showThumbnails && (
        <div className="bg-gray-900 p-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-600">
            {normalizedImages.map((img, index) => (
              <motion.button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={`relative flex-shrink-0 rounded-lg overflow-hidden transition-all ${
                  index === currentIndex 
                    ? 'ring-2 ring-[#0F1520] scale-105' 
                    : 'opacity-60 hover:opacity-100'
                }`}
                whileHover={{ scale: index === currentIndex ? 1.05 : 1.02 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src={img.url}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-20 h-20 object-cover"
                  draggable={false}
                />
                {index === currentIndex && (
                  <div className="absolute inset-0 bg-[#0F1520]/20" />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Dots Indicator (Alternative to thumbnails) */}
      {!showThumbnails && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {normalizedImages.map((_, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'w-8 bg-[#0F1520]' 
                  : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Pseudo360Viewer
