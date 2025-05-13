import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCalendar, FaMapMarkerAlt } from "react-icons/fa";
import supabase from "../supabase/supabase";
import LoadingSpinner from "../components/ui/LoadingSpinner";

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
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-8">Your Bookings</h1>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-card p-8 text-center">
          <FaCalendar className="text-5xl text-airbnb-primary mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-4">No bookings yet</h2>
          <p className="text-airbnb-light mb-6">
            Start exploring and book your next stay!
          </p>
          <Link to="/" className="btn-primary">
            Browse listings
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.booking_id}
              className="bg-white rounded-xl shadow-card overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3">
                 {/* Use the first image from the array */}
                   
<img
  src={booking.image_urls[0]}
  alt={booking.listing_title}
  className="w-full h-48 md:h-full object-cover"
/>
                </div>

                <div className="p-6 md:w-2/3">
                  <Link
                    to={`/listings/${booking.listing_id}`}
                    className="text-xl font-semibold hover:text-airbnb-primary"
                  >
                    {booking.listing_title}
                  </Link>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-airbnb-light">
                      <FaMapMarkerAlt className="mr-2" />
                      <span>{booking.location}</span>
                    </div>

                    <div className="flex items-center text-airbnb-light">
                      <FaCalendar className="mr-2" />
                      <span>
                        {new Date(booking.start_date).toLocaleDateString()} -{" "}
                        {new Date(booking.end_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      <span className="font-semibold">Rs. {booking.total_amount}</span>
                      <span className="text-airbnb-light"> total</span>
                    </div>

                    <div className="flex items-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          booking.payment_status === "paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {booking.payment_status === "paid" ? "Paid" : "Pending"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookingsPage;