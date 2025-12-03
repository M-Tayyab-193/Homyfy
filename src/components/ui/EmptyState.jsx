import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionText, 
  actionLink,
  onAction
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      {/* Animated Icon Container */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 200,
          damping: 15,
          delay: 0.2 
        }}
        className="mb-6"
      >
        <motion.div
          animate={{ 
            rotate: [0, -10, 10, -10, 0],
            scale: [1, 1.1, 1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeInOut"
          }}
          className="w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-lg"
        >
          <Icon className="text-6xl text-[#0F1520]" />
        </motion.div>
      </motion.div>

     
      {/* Content */}
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold text-gray-800 mb-3"
      >
        {title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-gray-600 mb-8 max-w-md"
      >
        {description}
      </motion.p>

      {/* Action Button */}
      {(actionText && (actionLink || onAction)) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          {actionLink ? (
            <Link
              to={actionLink}
              className="btn-primary inline-flex items-center gap-2"
            >
              <motion.span
                whileHover={{ x: -3 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                ←
              </motion.span>
              {actionText}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="btn-primary inline-flex items-center gap-2"
            >
              <motion.span
                whileHover={{ x: -3 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                ←
              </motion.span>
              {actionText}
            </button>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}

export default EmptyState
