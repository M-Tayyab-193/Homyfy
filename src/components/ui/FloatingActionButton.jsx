import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaChevronUp, FaComments, FaQuestionCircle } from 'react-icons/fa'

function FloatingActionButton() {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const fabButtons = [
    
    {
      icon: FaQuestionCircle,
      label: 'Help Center',
      color: 'from-purple-500 to-purple-600',
      action: () => console.log('Help opened'),
    },
  ]

  return (
    <>
      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-[#0F1520] to-[#1a2332] text-white rounded-full shadow-2xl hover:shadow-glow transition-all"
            aria-label="Scroll to top"
          >
            <FaChevronUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Action Menu */}
      <div className="fixed bottom-24 right-6 z-50">
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex flex-col gap-3 mb-4"
            >
              {fabButtons.map((button, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, x: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={button.action}
                  className={`flex items-center gap-3 px-4 py-3 bg-gradient-to-r ${button.color} text-white rounded-full shadow-xl hover:shadow-2xl transition-all`}
                  aria-label={button.label}
                >
                  <button.icon size={18} />
                  <span className="text-sm font-medium whitespace-nowrap">
                    {button.label}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main FAB Toggle */}
        
      </div>
    </>
  )
}

export default FloatingActionButton
