import { motion } from 'framer-motion'
import { FaCheck } from 'react-icons/fa'

function ProgressIndicator({ steps, currentStep }) {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-6 left-0 w-full h-1 bg-gray-200 -z-10">
          <motion.div
            className="h-full bg-gradient-to-r from-[#0F1520] to-[#1a2332]"
            initial={{ width: '0%' }}
            animate={{ 
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` 
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep
          const isUpcoming = stepNumber > currentStep

          return (
            <div key={index} className="flex flex-col items-center relative z-10">
              {/* Circle */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                  isCompleted
                    ? 'bg-gradient-to-r from-[#0F1520] to-[#1a2332] text-white shadow-glow'
                    : isCurrent
                    ? 'bg-white border-4 border-[#0F1520] text-[#0F1520] shadow-lg'
                    : 'bg-white border-2 border-gray-300 text-gray-400'
                }`}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <FaCheck className="text-lg" />
                  </motion.div>
                ) : (
                  <motion.span
                    animate={isCurrent ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 1, repeat: isCurrent ? Infinity : 0, repeatDelay: 1 }}
                  >
                    {stepNumber}
                  </motion.span>
                )}
              </motion.div>

              {/* Label */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="mt-3 text-center"
              >
                <p
                  className={`text-sm font-medium ${
                    isCompleted || isCurrent ? 'text-[#0F1520]' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-xs text-gray-500 mt-1 max-w-[100px]">
                    {step.description}
                  </p>
                )}
              </motion.div>

              {/* Pulse animation for current step */}
              {isCurrent && (
                <motion.div
                  className="absolute w-12 h-12 rounded-full bg-[#0F1520] opacity-20"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ProgressIndicator
