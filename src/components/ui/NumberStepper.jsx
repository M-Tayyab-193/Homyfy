import { FaMinus, FaPlus } from 'react-icons/fa'
import { motion } from 'framer-motion'

function NumberStepper({ 
  value, 
  onChange, 
  min = 1, 
  max = 50, 
  label,
  icon: Icon 
}) {
  const increment = () => {
    if (value < max) {
      onChange(value + 1)
    }
  }

  const decrement = () => {
    if (value > min) {
      onChange(value - 1)
    }
  }

  const handleInputChange = (e) => {
    const newValue = parseInt(e.target.value) || min
    if (newValue >= min && newValue <= max) {
      onChange(newValue)
    }
  }

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {Icon && <Icon className="inline mr-2 text-gray-500" />}
          {label}
        </label>
      )}
      
      <div className="flex items-center gap-3">
        {/* Decrement Button */}
        <motion.button
          type="button"
          onClick={decrement}
          disabled={value <= min}
          whileHover={value > min ? { scale: 1.05 } : {}}
          whileTap={value > min ? { scale: 0.95 } : {}}
          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
            value <= min
              ? 'border-gray-200 text-gray-300 cursor-not-allowed'
              : 'border-gray-300 text-[#0F1520] hover:bg-[#0F1520] hover:text-white'
          }`}
        >
          <FaMinus className="text-sm" />
        </motion.button>

        {/* Value Display/Input */}
        <input
          type="number"
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          className="w-20 h-10 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:border-[#0F1520] focus:ring-2 focus:ring-[#0F1520] focus:ring-opacity-20 transition-all"
        />

        {/* Increment Button */}
        <motion.button
          type="button"
          onClick={increment}
          disabled={value >= max}
          whileHover={value < max ? { scale: 1.05 } : {}}
          whileTap={value < max ? { scale: 0.95 } : {}}
          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
            value >= max
              ? 'border-gray-200 text-gray-300 cursor-not-allowed'
              : 'border-gray-300 text-[#0F1520] hover:bg-[#0F1520] hover:text-white'
          }`}
        >
          <FaPlus className="text-sm" />
        </motion.button>

        {/* Min/Max Indicator */}
        <span className="text-xs text-gray-400 ml-2">
          ({min}-{max})
        </span>
      </div>
    </div>
  )
}

export default NumberStepper
