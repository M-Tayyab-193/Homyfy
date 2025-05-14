import { useState, useRef } from 'react';
import { FaTimes, FaMoneyBillWave, FaCreditCard, FaMobile, FaWallet } from 'react-icons/fa';
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

  const numberOfNights = Math.round(
    (dateRange.endDate - dateRange.startDate) / (1000 * 60 * 60 * 24)
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Confirm Booking</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        <div className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="font-medium mb-2">Booking Details</h3>
            <p>Check-in: {dateRange.startDate.toLocaleDateString()}</p>
            <p>Check-out: {dateRange.endDate.toLocaleDateString()}</p>
            <p>Nights: {numberOfNights}</p>
          </div>

          <div className="border-b pb-4">
            <h3 className="font-medium mb-2">Price Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>
                  Rs. {listing.price_value} × {numberOfNights} nights
                </span>
                <span>Rs. {subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Service fee</span>
                <span>Rs. {serviceFee}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>Rs. {total}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Payment Method</h3>
            <div className="space-y-2">
              {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => (
                <label
                  key={id}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === id
                      ? 'border-airbnb-primary bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
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
                  <Icon className="text-xl text-airbnb-primary mr-3" />
                  <span>{label}</span>
                </label>
              ))}
            </div>

            {paymentMethod && paymentMethod !== "arrival" && (
              <input
                type="text"
                ref={paymentNumberRef}
                placeholder="Enter 11-digit number"
                className="w-full mt-4 p-3 border rounded-lg"
                maxLength="11"
              />
            )}
          </div>

          <button
            onClick={handleBooking}
            disabled={!paymentMethod || loading}
            className={`w-full btn-primary ${
              !paymentMethod || loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Processing..." : "Confirm and Pay"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;