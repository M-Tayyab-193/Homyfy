import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function Tooltip({ children, content, position = 'top' }) {
  const [isVisible, setIsVisible] = useState(false)

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  const arrowPositions = {
    top: 'top-full left-1/2 -translate-x-1/2 -mt-1',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 -mb-1 rotate-180',
    left: 'left-full top-1/2 -translate-y-1/2 -ml-1 rotate-90',
    right: 'right-full top-1/2 -translate-y-1/2 -mr-1 -rotate-90',
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && content && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: position === 'top' ? 5 : -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: position === 'top' ? 5 : -5 }}
            transition={{ duration: 0.2 }}
            className={`absolute ${positions[position]} z-50 pointer-events-none`}
          >
            <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl whitespace-nowrap backdrop-blur-sm bg-opacity-95">
              {content}
              {/* Arrow */}
              <div className={`absolute ${arrowPositions[position]} w-2 h-2 bg-gray-900`} style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Tooltip
