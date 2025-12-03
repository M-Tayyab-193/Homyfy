import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCalendar, FaMapMarkerAlt, FaHome } from "react-icons/fa";
import { motion } from "framer-motion";
import supabase from "../supabase/supabase";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import EmptyState from "../components/ui/EmptyState";

function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.log("User not found");
        return;
      }

      const { data, error } = await supabase.rpc("fetch_bookings_by_guest", {
        guest_id: user.id,
      });

      if (error) {
        console.error("Error fetching bookings:", error);
        return;
      }

      console.log("Bookings data:", data);
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="container-custom py-8 mt-[98px]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Your Bookings
        </h1>
        <p className="text-gray-600 mb-8">Manage and view all your reservations</p>
      </motion.div>

      {bookings.length === 0 ? (
        <EmptyState
          icon={FaHome}
          title="No bookings yet"
          description="Start exploring and book your next stay!"
          actionText="Browse listings"
          actionLink="/"
        />
      ) : (
        <motion.div 
          className="grid grid-cols-1 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {bookings.map((booking, index) => (
            <motion.div
              key={booking.booking_id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="md:w-1/4 relative overflow-hidden">
                  <img
                    src={booking.image_urls[0]}
                    alt={booking.listing_title}
                    className="w-full h-48 md:h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm ${
                        booking.payment_status === "paid"
                          ? "bg-green-500/90 text-white"
                          : "bg-yellow-500/90 text-white"
                      }`}
                    >
                      {booking.payment_status === "paid" ? "Paid" : "Pending"}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 md:w-3/4 flex flex-col justify-between">
                  <div>
                    <Link
                      to={`/listings/${booking.listing_id}`}
                      className="text-2xl font-bold text-gray-900 hover:text-[#0F1520] transition-colors mb-3 inline-block"
                    >
                      {booking.listing_title}
                    </Link>

                    <div className="flex items-center text-gray-600 mb-4">
                      <FaMapMarkerAlt className="mr-2 text-[#0F1520]" />
                      <span className="text-sm">{booking.location}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <FaCalendar className="#0F1520" />
                          <span className="text-xs font-semibold text-gray-700 uppercase">Check-in</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900">
                          {new Date(booking.start_date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                        <div className="flex items-center gap-2 mb-2">
                          <FaCalendar className="text-purple-500" />
                          <span className="text-xs font-semibold text-gray-700 uppercase">Check-out</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900">
                          {new Date(booking.end_date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div>
                      <span className="text-sm text-gray-600">Total Amount</span>
                      <p className="text-2xl font-bold text-[#0F1520]">Rs. {booking.total_amount.toLocaleString()}</p>
                    </div>

                    <Link
                      to={`/listings/${booking.listing_id}`}
                      className="px-6 py-3 bg-gradient-to-r from-[#0F1520] to-[#1a2332] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-[#1a2332] hover:to-[#253549] transition-all"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default BookingsPage;