import { FaStar, FaRegCalendarAlt } from 'react-icons/fa';
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
  const serviceFee = Math.round(subtotal * 0.15);
  const total = subtotal + serviceFee;

  return (
    <div className="sticky top-24 bg-white rounded-xl border border-gray-200 shadow-card p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-xl font-semibold">${listing.price_value}</span>
          <span className="text-airbnb-light"> night</span>
        </div>
        <div className="flex items-center">
          <FaStar className="text-airbnb-primary mr-1" />
          <span className="font-medium">{listing.rating_overall}</span>
          <span className="mx-1 text-airbnb-light">·</span>
          <span className="text-airbnb-light underline">
            {listing.reviews_count} reviews
          </span>
        </div>
      </div>

      <div className="border border-gray-300 rounded-lg overflow-hidden mb-4">
        <button
          className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
          onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
        >
          <div className="text-left">
            <div className="text-xs font-bold uppercase">DATES</div>
            <div>
              {dateRange.startDate.toLocaleDateString()} -{" "}
              {dateRange.endDate.toLocaleDateString()}
            </div>
          </div>
          <FaRegCalendarAlt />
        </button>
      </div>

      {isDatePickerOpen && (
        <div className="absolute left-0 right-0 mt-1 bg-white rounded-2xl shadow-lg z-10 border border-gray-200">
          <DateRangePicker
            ranges={[dateRange]}
            onChange={(item) => setDateRange(item.selection)}
            onClose={() => setIsDatePickerOpen(false)}
            disabledDates={bookedDates}
          />
        </div>
      )}

      <button
        className={`w-full btn-primary mb-4 ${
          currentUser?.user_metadata?.role === 'host' ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={handleReserveClick}
        disabled={currentUser?.user_metadata?.role === 'host'}
        title={currentUser?.user_metadata?.role === 'host' ? "Please login with guest account to make reservations" : ""}
      >
        Reserve
      </button>

      <p className="text-center text-sm text-airbnb-light mb-4">
        You won't be charged yet
      </p>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="underline">
            ${listing.price_value} × {numberOfNights} nights
          </span>
          <span>${subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span className="underline">Service fee</span>
          <span>${serviceFee}</span>
        </div>
        <div className="flex justify-between pt-3 border-t border-gray-200 font-bold">
          <span>Total before taxes</span>
          <span>${total}</span>
        </div>
      </div>
    </div>
  );
}

export default BookingCard;