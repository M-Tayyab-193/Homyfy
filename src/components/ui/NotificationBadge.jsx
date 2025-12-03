import { motion, AnimatePresence } from 'framer-motion'

function NotificationBadge({ count = 0, max = 99, position = 'top-right', color = 'red' }) {
  const colors = {
    red: 'bg-red-500',
    green: 'bg-green-500',
    blue: 'bg-[#0F1520]',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
  }

  const positions = {
    'top-right': '-top-1 -right-1',
    'top-left': '-top-1 -left-1',
    'bottom-right': '-bottom-1 -right-1',
    'bottom-left': '-bottom-1 -left-1',
  }

  const displayCount = count > max ? `${max}+` : count

  if (count === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        className={`absolute ${positions[position]} z-10`}
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 0.3,
            repeat: count > 0 ? 3 : 0,
            repeatDelay: 2,
          }}
          className={`${colors[color]} text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center shadow-lg`}
        >
          {displayCount}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default NotificationBadge
