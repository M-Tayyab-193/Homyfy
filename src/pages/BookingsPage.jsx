import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCalendar, FaMapMarkerAlt, FaUser } from "react-icons/fa";
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

      if (!user) return;

      const { data, error } = await supabase
        .from("bookings")
        .select(
          `
        *,
        listings (
          id,
          title,
          location,
          price_value,
          listing_images (
            image_url
          )
        ),
        payments (
          payment_status
        )
      `
        )
        .eq("guest_id", user.id);

      if (error) throw error;
      console.log("Bookings with payments data:", data); // 🔍 Debugging line

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
              key={booking.id}
              className="bg-white rounded-xl shadow-card overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3">
                  <img
                    src={booking.listings.listing_images[0]?.image_url}
                    alt={booking.listings.title}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>

                <div className="p-6 md:w-2/3">
                  <Link
                    to={`/listings/${booking.listings.id}`}
                    className="text-xl font-semibold hover:text-airbnb-primary"
                  >
                    {booking.listings.title}
                  </Link>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-airbnb-light">
                      <FaMapMarkerAlt className="mr-2" />
                      <span>{booking.listings.location}</span>
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
                      <span className="font-semibold">
                        ${booking.total_amount}
                      </span>
                      <span className="text-airbnb-light"> total</span>
                    </div>

                    <div className="flex items-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          booking.payments?.[0]?.payment_status === "paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {console.log(
                          "Payment Status:",
                          booking.payments?.[0]?.payment_status
                        )}{" "}
                        {/* Log the payment status */}
                        {booking.payments?.[0]?.payment_status === "paid"
                          ? "Paid"
                          : "Pending"}
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
  a;
}

export default BookingsPage;
