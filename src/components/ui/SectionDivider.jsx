import { motion } from 'framer-motion'

function SectionDivider({ icon: Icon, text }) {
  return (
    <div className="relative py-12 overflow-hidden">
      {/* Background gradient line */}
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-200"></div>
      </div>

      {/* Content */}
      <div className="relative flex justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white px-6 py-3 rounded-full shadow-lg border border-gray-100"
        >
          <div className="flex items-center gap-3">
            {Icon && (
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
                className="#0F1520"
              >
                <Icon className="text-xl" />
              </motion.div>
            )}
            {text && (
              <span className="text-gray-600 font-medium text-sm uppercase tracking-wider">
                {text}
              </span>
            )}
          </div>
        </motion.div>
      </div>

      {/* Decorative circles */}
    
    </div>
  )
}

export default SectionDivider
