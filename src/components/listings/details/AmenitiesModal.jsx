import { FaTimes, FaCheck } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

function AmenitiesModal({ amenitiesByCategory, onClose }) {
  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-white z-50 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="sticky top-0 bg-white/95 backdrop-blur-md z-10 py-4 px-6 border-b-2 border-gray-300 shadow-sm">
          <div className="container-custom flex justify-between items-center">
            <motion.button
              onClick={onClose}
              className="p-2 hover:bg-gray-50 rounded-full transition-colors"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaTimes className="text-2xl text-gray-700" />
            </motion.button>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              All Amenities
            </h2>
            <div className="w-10"></div>
          </div>
        </div>

        <div className="container-custom py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(amenitiesByCategory).map(([category, items], idx) => (
              <motion.div 
                key={category} 
                className="p-5 bg-gradient-to-br from-white via-blue-50/30 to-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <h3 className="text-lg font-bold mb-3 text-[#0F1520]">{category}</h3>
                <div className="space-y-2">
                  {items.map((amenity, itemIdx) => (
                    <motion.div 
                      key={amenity.id} 
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 + itemIdx * 0.05 }}
                      whileHover={{ x: 5 }}
                    >
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full">
                        <FaCheck className="#0F1520 text-xs" />
                      </div>
                      <span className="text-gray-700 font-medium group-hover:text-[#0F1520] transition-colors text-sm">
                        {amenity.title}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default AmenitiesModal;