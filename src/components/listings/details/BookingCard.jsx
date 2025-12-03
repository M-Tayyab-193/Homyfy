import { FaStar, FaRegCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import DateRangePicker from '../../search/DateRangePicker';

function BookingCard({ 
  listing, 
  dateRange, 
  setDateRange,
  isDatePickerOpen,
  setIsDatePickerOpen,
  handleReserveClick,
  bookedDates,
  currentUser
}) {
  const numberOfNights = Math.round(
    (dateRange.endDate - dateRange.startDate) / (1000 * 60 * 60 * 24)
  );
  const subtotal = listing.price_value * numberOfNights;
  const serviceFee = Math.round(subtotal * 0.05);
  const total = subtotal + serviceFee;

  return (
    <motion.div 
      className="sticky top-24 bg-gradient-to-br from-white via-blue-50/30 to-white rounded-2xl border border-gray-200 shadow-card-hover p-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Rs. {listing.price_value}</span>
            <span className="text-gray-600">/ night</span>
          </div>
        </div>
        <motion.div 
          className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-full border border-gray-300"
          whileHover={{ scale: 1.05 }}
        >
          <FaStar className="text-yellow-500" />
          <span className="font-semibold">{listing.rating_overall}</span>
        </motion.div>
      </div>

      <div className="border-2 border-gray-200 rounded-xl overflow-hidden mb-4 hover:border-gray-400 transition-colors">
        <motion.button
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
          whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="text-left">
            <div className="text-xs font-bold uppercase text-[#0F1520] mb-1">CHECK-IN → CHECK-OUT</div>
            <div className="font-medium text-gray-700">
              {dateRange.startDate.toLocaleDateString()} - {dateRange.endDate.toLocaleDateString()}
            </div>
          </div>
          <FaRegCalendarAlt className="#0F1520 text-xl" />
        </motion.button>
      </div>

      {isDatePickerOpen && (
        <div className="absolute left-0 right-0 mt-1 bg-white rounded-2xl shadow-lg z-10 border border-gray-200">
          <DateRangePicker
            ranges={[dateRange]}
            onChange={(item) => {
    const start = item.selection.startDate;
    const end = item.selection.endDate;

    // Enforce at least 1-day difference
    if (start && end) {
      const timeDiff = end.getTime() - start.getTime();
      const dayDiff = timeDiff / (1000 * 60 * 60 * 24);

      if (dayDiff >= 1) {
        setDateRange(item.selection);
      } else {
        // Optionally, auto-correct endDate to +1 day
        setDateRange({
          ...item.selection,
          endDate: new Date(start.getTime() + 24 * 60 * 60 * 1000),
        });
      }
    }
  }}
            onClose={() => setIsDatePickerOpen(false)}
            disabledDates={bookedDates}
          />
        </div>
      )}

      <motion.button
        className={`w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg transition-all mb-4 ${
          currentUser?.user_metadata?.role === 'host' 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-[#0F1520] to-[#1a2332] hover:shadow-xl'
        }`}
        onClick={handleReserveClick}
        disabled={currentUser?.user_metadata?.role === 'host'}
        title={currentUser?.user_metadata?.role === 'host' ? "Please login with guest account to make reservations" : ""}
        whileHover={currentUser?.user_metadata?.role !== 'host' ? { scale: 1.02, y: -2 } : {}}
        whileTap={currentUser?.user_metadata?.role !== 'host' ? { scale: 0.98 } : {}}
      >
        Reserve
      </motion.button>

      <p className="text-center text-sm text-gray-500 mb-6 font-medium">
        You won't be charged yet
      </p>

      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-gray-600">Rs. {listing.price_value} × {numberOfNights} nights</span>
          <span className="font-semibold text-gray-900">Rs. {subtotal}</span>
        </div>
        <div className="flex justify-between items-center pt-4 border-t-2 border-gray-200">
          <span className="text-lg font-bold text-gray-900">Total Rent</span>
          <span className="text-2xl font-bold bg-gradient-to-r from-[#0F1520] to-[#1a2332] bg-clip-text text-transparent">Rs. {subtotal}</span>
        </div>
        <p className="text-xs text-center text-gray-500">(Exclusive of service fee)</p>
      </div>
    </motion.div>
  );
}

export default BookingCard;