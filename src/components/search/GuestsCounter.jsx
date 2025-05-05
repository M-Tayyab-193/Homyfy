import { FaPlus, FaMinus } from 'react-icons/fa'

function GuestsCounter({ guests, onChange, onClose }) {
  const handleChange = (delta) => {
    const newValue = Math.max(1, guests + delta)
    onChange(newValue)
  }

  return (
    <div className="p-4 w-72 text-black">
      <div className="flex items-center justify-between py-3">
        <div>
          <p className="font-medium">Guests</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleChange(-1)}
            disabled={guests <= 1}
            className={`w-8 h-8 rounded-full flex items-center justify-center border ${
              guests <= 1 ? 'border-gray-200 text-gray-200 cursor-not-allowed' : 'border-gray-400 hover:border-gray-600'
            }`}
          >
            <FaMinus size={12} />
          </button>
          <span className="w-6 text-center">{guests}</span>
          <button
            onClick={() => handleChange(1)}
            className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-400 hover:border-gray-600"
          >
            <FaPlus size={12} />
          </button>
        </div>
      </div>
      
      <div className="flex justify-end mt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-airbnb-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  )
}

export default GuestsCounter