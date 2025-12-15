import { useState, useRef } from 'react';
import { FaTimes, FaMoneyBillWave, FaCreditCard, FaMobile, FaWallet } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import supabase from '../../../supabase/supabase';

const PAYMENT_METHODS = [
  { id: 'jazzcash', label: 'JazzCash', icon: FaMobile },
  { id: 'easypaisa', label: 'EasyPaisa', icon: FaWallet },
  { id: 'card', label: 'Card', icon: FaCreditCard },
  { id: 'arrival', label: 'Pay upon arrival', icon: FaMoneyBillWave },
];

function ConfirmationModal({ onClose, listing, dateRange, onSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState("");
  const paymentNumberRef = useRef(null);
  const [loading, setLoading] = useState(false);

 const numberOfNights = Math.max(
  1,
  Math.round((dateRange.endDate - dateRange.startDate) / (1000 * 60 * 60 * 24))
);

  const subtotal = listing.price_value * numberOfNights;
  const serviceFee = Math.round(subtotal * 0.05);
  const total = subtotal + serviceFee;

  const validatePaymentNumber = (number) => {
    return /^\d{11}$/.test(number);
  };

  const handleBooking = async () => {
    if (paymentMethod && paymentMethod !== "arrival") {
      const number = paymentNumberRef.current?.value;

      if (!validatePaymentNumber(number)) {
        toast.error("Please enter a valid 11-digit number");
        return;
      }
    }

    setLoading(true);
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      const user = session?.user;
      
      if (sessionError || !user) {
        console.error("User not authenticated");
        toast.error("User authentication failed.");
        return;
      }

      // Check for overlapping bookings
      const { data: hasOverlap, error: overlapError } = await supabase.rpc(
        'check_overlapping_bookings',
        {
          p_guest_id: user.id,
          p_listing_id: listing.id,
          p_start_date: dateRange.startDate.toISOString().split("T")[0],
          p_end_date: dateRange.endDate.toISOString().split("T")[0]
        }
      );

      if (overlapError) {
        throw overlapError;
      }

      if (hasOverlap) {
        toast.error("You already have a reservation for this listing in these dates!");
        return;
      }

      const { data, error: rpcError } = await supabase.rpc("create_booking_with_payment", {
        p_guest_id: user.id,
        p_listing_id: listing.id,
        p_start_date: dateRange.startDate.toISOString().split("T")[0],
        p_end_date: dateRange.endDate.toISOString().split("T")[0],
        p_total: total,
        p_method: paymentMethod,
      });

      if (rpcError) {
        throw rpcError;
      }

      toast.success("Booking confirmed successfully!");
      onClose();
      onSuccess();

    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to complete booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl p-6 max-w-lg w-full z-10 shadow-2xl"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Confirm Booking
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes className="text-gray-600" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Booking Details */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-[#0F1520] rounded-full"></div>
              Booking Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Check-in:</span>
                <span className="font-medium text-gray-900">{dateRange.startDate.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check-out:</span>
                <span className="font-medium text-gray-900">{dateRange.endDate.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Nights:</span>
                <span className="font-medium text-gray-900">{numberOfNights}</span>
              </div>
            </div>
          </div>

          {/* Price Details */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Price Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Rs. {listing.price_value} × {numberOfNights} nights</span>
                <span>Rs. {subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Service fee</span>
                <span>Rs. {serviceFee}</span>
              </div>
              <div className="flex justify-between font-bold text-base text-gray-900 pt-2 border-t border-gray-300">
                <span>Total</span>
                <span>Rs. {total}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
            <div className="space-y-2">
              {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => (
                <label
                  key={id}
                  className={`flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === id
                      ? 'border-[#0F1520] bg-gray-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={id}
                    checked={paymentMethod === id}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                    paymentMethod === id ? 'bg-[#0F1520]' : 'bg-gray-200'
                  }`}>
                    <Icon className={`text-lg ${paymentMethod === id ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <span className={`font-medium ${paymentMethod === id ? 'text-[#0F1520]' : 'text-gray-700'}`}>
                    {label}
                  </span>
                </label>
              ))}
            </div>

            {paymentMethod && paymentMethod !== "arrival" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <input
                  type="text"
                  ref={paymentNumberRef}
                  placeholder="Enter 11-digit number"
                  className="w-full mt-3 p-3 border-2 border-gray-200 rounded-xl focus:border-[#0F1520] focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  maxLength="11"
                />
              </motion.div>
            )}
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleBooking}
            disabled={!paymentMethod || loading}
            className={`w-full py-4 bg-gradient-to-r from-[#0F1520] to-[#1a2332] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all ${
              !paymentMethod || loading ? "opacity-50 cursor-not-allowed" : "hover:from-[#1a2332] hover:to-[#253549]"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              "Confirm and Pay"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default ConfirmationModal;