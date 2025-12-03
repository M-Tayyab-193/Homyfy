import { motion, AnimatePresence } from 'framer-motion'
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa'

function FormFeedback({ type = 'error', message, show = false }) {
  const config = {
    error: {
      icon: FaExclamationCircle,
      bgColor: 'bg-red-50',
      textColor: 'text-red-800',
      iconColor: 'text-red-500',
      borderColor: 'border-red-200',
    },
    success: {
      icon: FaCheckCircle,
      bgColor: 'bg-green-50',
      textColor: 'text-green-800',
      iconColor: 'text-green-500',
      borderColor: 'border-green-200',
    },
    info: {
      icon: FaInfoCircle,
      bgColor: 'bg-gray-50',
      textColor: 'text-blue-800',
      iconColor: '#0F1520',
      borderColor: 'border-gray-300',
    },
  }

  const { icon: Icon, bgColor, textColor, iconColor, borderColor } = config[type]

  return (
    <AnimatePresence>
      {show && message && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`${bgColor} ${textColor} ${borderColor} border rounded-lg p-3 mb-4 flex items-start gap-3`}
        >
          <Icon className={`${iconColor} mt-0.5 flex-shrink-0`} />
          <p className="text-sm flex-1">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default FormFeedback
