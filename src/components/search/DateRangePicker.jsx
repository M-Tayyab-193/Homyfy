import { DateRange } from 'react-date-range'
import { motion } from 'framer-motion'
import { FaCalendarAlt, FaTimes } from 'react-icons/fa'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

function DateRangePicker({ ranges, onChange, onClose, disabledDates }) {
  const formatSelectedDates = () => {
    const { startDate, endDate } = ranges[0]
    if (!startDate || !endDate) return 'Select dates'
    
    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }
    
    return `${formatDate(startDate)} - ${formatDate(endDate)}`
  }

  const handleQuickSelect = (days) => {
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + days)
    
    onChange({
      selection: {
        startDate: targetDate,
        endDate: targetDate,
        key: 'selection'
      }
    })
  }

  const quickPresets = [
    { label: 'Today', days: 0 },
    { label: 'Tomorrow', days: 1 },
  ]

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-2xl overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0F1520] to-[#1a2332] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <FaCalendarAlt className="text-white text-lg" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Select Dates</h3>
              <p className="text-white/70 text-sm">{formatSelectedDates()}</p>
            </div>
          </div>
          <motion.button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaTimes className="text-white text-xl" />
          </motion.button>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <p className="text-sm font-semibold text-gray-700 mb-3">Quick Select</p>
        <div className="flex justify-center gap-2">
          {quickPresets.map((preset, index) => (
            <motion.button
              key={preset.label}
              onClick={() => handleQuickSelect(preset.days)}
              className="px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-[#0F1520] hover:bg-gray-50 transition-all"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {preset.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Calendar */}
      <div className="p-6 date-range-picker">
        <DateRange
          ranges={ranges}
          onChange={onChange}
          months={1}
          direction="horizontal"
          showDateDisplay={false}
          showMonthAndYearPickers={true}
          rangeColors={['#0F1520']}
          minDate={new Date()}
          disabledDates={disabledDates}
          className="border-0"
        />
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <button
          onClick={onClose}
          className="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <motion.button
          onClick={onClose}
          className="px-8 py-2.5 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          style={{ background: 'linear-gradient(to right, #0F1520, #1a2332)' }}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          Apply Dates
        </motion.button>
      </div>
    </motion.div>
  )
}

export default DateRangePicker