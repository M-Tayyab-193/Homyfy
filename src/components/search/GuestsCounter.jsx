import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaMinus, FaUsers } from 'react-icons/fa'

function GuestsCounter({ guests, onChange, onClose }) {
  const handleChange = (delta) => {
    const newValue = Math.max(1, Math.min(20, guests + delta))
    onChange(newValue)
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-5 w-95"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-50 to-blue-100 flex items-center justify-center flex-shrink-0">
          <FaUsers className="#0F1520 text-sm" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-800 text-sm">Number of Guests</p>
          <p className="text-xs text-gray-500">Max 20 guests</p>
        </div>
      </div>

      <div className="flex items-center justify-between py-3 px-3 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl">
        <motion.button
          onClick={() => handleChange(-1)}
          disabled={guests <= 1}
          whileHover={guests > 1 ? { scale: 1.1 } : {}}
          whileTap={guests > 1 ? { scale: 0.9 } : {}}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            guests <= 1 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-[#0F1520] shadow-sm'
          }`}
        >
          <FaMinus size={12} />
        </motion.button>
        
        <AnimatePresence mode="wait">
          <motion.span
            key={guests}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-2xl font-bold text-gray-800 min-w-[50px] text-center"
          >
            {guests}
          </motion.span>
        </AnimatePresence>
        
        <motion.button
          onClick={() => handleChange(1)}
          disabled={guests >= 20}
          whileHover={guests < 20 ? { scale: 1.1 } : {}}
          whileTap={guests < 20 ? { scale: 0.9 } : {}}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            guests >= 20
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-[#0F1520] shadow-sm'
          }`}
        >
          <FaPlus size={12} />
        </motion.button>
      </div>

      {/* Guest slider */}
      <div className="mt-3 px-1">
        <input
          type="range"
          min="1"
          max="20"
          value={guests}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((guests - 1) / 19) * 100}%, #e5e7eb ${((guests - 1) / 19) * 100}%, #e5e7eb 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>1</span>
          <span>20</span>
        </div>
      </div>
      
      <motion.button
        onClick={onClose}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-4 px-4 py-2.5 bg-gradient-to-r from-[#0F1520] to-[#1a2332] text-white rounded-xl font-medium hover:shadow-lg transition-all"
      >
        Done
      </motion.button>
    </motion.div>
  )
}

export default GuestsCounter