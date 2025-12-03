import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaHeart, FaRegHeart, FaArrowLeft, FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaBed, FaBath, FaUsers } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useListings } from "../contexts/ListingsContext";
import supabase from "../supabase/supabase";
import Map from "../components/map/Map";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { toast } from "react-toastify";
import ImageGallery from "../components/listings/details/ImageGallery";
import BookingCard from "../components/listings/details/BookingCard";
import ReviewSection from "../components/listings/details/ReviewSection";
import ConfirmationModal from "../components/listings/details/ConfirmationModal";
import SuccessModal from "../components/listings/details/SuccessModal";
import AmenitiesModal from "../components/listings/details/AmenitiesModal";

function ListingDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { wishlist, toggleWishlist } = useListings();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    key: "selection",
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [hasBooked, setHasBooked] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [amenities, setAmenities] = useState([]);
  const [amenitiesByCategory, setAmenitiesByCategory] = useState({});
  const [showContactInfo, setShowContactInfo] = useState(false);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      if (user) {
        const [{ data: hasBookedData, error: bookedError }, { data: hasReviewedData, error: reviewedError }] =
          await Promise.all([
            supabase.rpc("has_booked_listing", {
              guest_id: user.id,
              listing_id: id,
            }),
            supabase.rpc("has_reviewed_listing", {
              guest_id: user.id,
              listing_id: id,
            }),
          ]);

        if (bookedError) console.error("Error checking booking:", bookedError);
        if (reviewedError) console.error("Error checking review:", reviewedError);

        setHasBooked(hasBookedData ?? false);
        setHasReviewed(hasReviewedData ?? false);
      }
    };
    fetchUser();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase.rpc('get_reviews_for_listing', {
        listing: id,
      });

      if (error) {
        console.error('Error fetching reviews:', error);
        return;
      }
      console.log("Reviews", data);
      setReviews(data || []);
    };

    fetchReviews();
  }, [id]);

  useEffect(() => {
    if (showConfirmation) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [showConfirmation]);

  useEffect(() => {
    const fetchBookedDates = async () => {
      const { data, error } = await supabase.rpc('get_booked_date_ranges', {
        listing: id,
      });

      if (error) {
        console.error("Error fetching booked dates:", error);
        return;
      }

      const disabledDates = [];
      data.forEach((booking) => {
        const start = new Date(booking.start_date);
        const end = new Date(booking.end_date);
        let current = new Date(start);

        while (current <= end) {
          disabledDates.push(new Date(current));
          current.setDate(current.getDate() + 1);
        }
      });

      setBookedDates(disabledDates);
    };

    if (id) {
      fetchBookedDates();
    }
  }, [id]);

  useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        const { data, error } = await supabase.rpc('get_all_listing', { listing_id: id });

        if (error) {
          console.error("Error fetching listing details:", error);
          throw error;
        }
        
        if (!data) {
          console.error("No data returned from get_all_listing");
          throw new Error("Listing not found");
        }
        
        // Since the RPC returns a JSONB object directly, not an array
        const amenitiesList = data.amenities || [];
        console.log('Amenities list:', amenitiesList);

        const grouped = amenitiesList.reduce((acc, amenity) => {
          if (!acc[amenity.category]) {
            acc[amenity.category] = [];
          }
          acc[amenity.category].push(amenity);
          return acc;
        }, {});

        console.log('Grouped amenities:', grouped);

        const transformedListing = {
          id: data.id,
          title: data.title,
          description: data.description,
          price_value: data.price_value,
          location: data.location,
          created_at: data.created_at,
          images: data.images || [],
          host: data.host,
          latitude: data.latitude,
          longitude: data.longitude,
          rating_overall: data.rating_overall,
          reviews_count: data.reviews_count,
          bed_count: data.bed_count,
          bathroom_count: data.bathroom_count,
          guest_count: data.guest_count,
          matterport_url: data.matterport_url || null,
        };

        console.log('Transformed listing:', transformedListing);

        setListing(transformedListing);
        setAmenities(amenitiesList);
        setAmenitiesByCategory(grouped);
        document.title = transformedListing.title;
    
      } catch (err) {
        console.error("Error fetching listing details:", err);
        navigate("/not-found");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchListingDetails();
  }, [id, navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleWishlistToggle = () => {
    if (!currentUser) {
      toast.info("Please log in to add to wishlist");
      navigate("/login", { state: { from: `/listings/${id}` } });
      return;
    }
    toggleWishlist(id);
  };

  const handleReserveClick = () => {
    if (!currentUser) {
      toast.error("Please login first to reserve a listing");
      return;
    }
    if (currentUser?.user_metadata?.role === 'host') {
      toast.error("Please login with guest account to make reservations");
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setShowConfirmation(true);
  };

  const handleBookingSuccess = () => {
    setShowSuccess(true);
    setHasBooked(true);
  };

  const scrollToReviews = () => {
    const reviewSection = document.getElementById('review-section');
    if (reviewSection) {
      reviewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading || !listing) {
    return (
      <>
        <LoadingSpinner fullScreen />
        <style>{`
          footer { display: none !important; }
        `}</style>
      </>
    );
  }

  const isWishlisted = wishlist.includes(id);

  return (
    <motion.div 
      className="container-custom py-6 mt-[90px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
          {listing.title}
        </h1>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center flex-wrap gap-4">
            <motion.div 
              className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-full border border-gray-300"
              whileHover={{ scale: 1.05 }}
              onClick={scrollToReviews}
            >
              <FaStar className="text-yellow-500" />
              <span className="font-semibold">{listing.rating_overall}</span>
              <span className="text-gray-400">·</span>
              <span className="text-gray-600 underline cursor-pointer hover:#0F1520 transition-colors">{reviews.length} reviews</span>
            </motion.div>
            <div className="flex items-center gap-2 text-gray-600">
              <FaMapMarkerAlt className="#0F1520" />
              <span className="font-medium">{listing.location}</span>
            </div>
          </div>

          <motion.button
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full hover:shadow-lg transition-all group"
            onClick={handleWishlistToggle}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ scale: isWishlisted ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              {isWishlisted ? (
                <FaHeart className="text-red-500" />
              ) : (
                <FaRegHeart className="group-hover:text-red-500 transition-colors" />
              )}
            </motion.div>
            <span className="font-medium">{isWishlisted ? 'Saved' : 'Save'}</span>
          </motion.button>
        </div>
      </motion.div>

      <ImageGallery
        images={listing.images}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        matterportUrl={listing.matterport_url}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <motion.div 
            className="flex justify-between items-start p-6 mb-6 bg-gradient-to-br from-white via-blue-50/30 to-white rounded-2xl border border-gray-200 shadow-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex-1 min-w-0 pr-4">
              <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Hosted by {listing.host.name}
              </h2>
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <FaUsers className="text-orange-500" />
                  <span>{listing.guest_count} guests</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaBed className="text-blue-500" />
                  <span>{listing.bed_count} beds</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaBath className="text-purple-500" />
                  <span>{listing.bathroom_count} baths</span>
                </div>
              </div>
              <motion.button 
                onClick={() => setShowContactInfo(!showContactInfo)}
                className="px-6 py-3 bg-gradient-to-r from-[#0F1520] to-[#1a2332] text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{showContactInfo ? 'Hide Contact Info' : 'Show Contact Info'}</span>
              </motion.button>
              
              <AnimatePresence>
                {showContactInfo && (
                  <motion.div 
                    className="mt-4 p-4 bg-white/80 backdrop-blur-md rounded-xl border border-gray-200 space-y-3"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.a
                      href={`https://wa.me/${listing.host.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:shadow-md transition-all group"
                      whileHover={{ x: 5 }}
                    >
                      <FaWhatsapp className="text-green-500 text-2xl flex-shrink-0" />
                      <span className="group-hover:#0F1520 transition-colors font-medium break-all">{listing.host.phone}</span>
                    </motion.a>
                    <motion.a
                      href={`mailto:${listing.host.email}`}
                      className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg hover:shadow-md transition-all group"
                      whileHover={{ x: 5 }}
                    >
                      <FaEnvelope className="text-gray-600 text-2xl flex-shrink-0" />
                      <span className="group-hover:#0F1520 transition-colors font-medium break-all">{listing.host.email}</span>
                    </motion.a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <motion.div 
              className="flex-shrink-0 ml-4"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 bg-gradient-to-r from-[#0F1520] to-sky-400 rounded-full blur-md opacity-50"></div>
                <img
                  src={listing.host.avatar}
                  alt={listing.host.name}
                  className="relative w-20 h-20 rounded-full object-cover border-2 border-white shadow-lg"
                />
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="p-6 mb-6 bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-2xl border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">About this place</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>
          </motion.div>

          {/* Amenities Section */}
          <motion.div 
            className="p-6 mb-6 bg-gradient-to-br from-white via-blue-50/30 to-white rounded-2xl border border-gray-200 shadow-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              What this place offers
            </h2>
            
            {Object.keys(amenitiesByCategory).length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {Object.entries(amenitiesByCategory).slice(0, 2).map(([category, items], idx) => (
                    <motion.div 
                      key={category}
                      className="p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-400 hover:shadow-md transition-all"
                      initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + idx * 0.1 }}
                    >
                      <h3 className="font-bold text-base mb-3 text-[#0F1520]">{category}</h3>
                      <div className="space-y-2">
                        {items.slice(0, 3).map((amenity) => (
                          <motion.div 
                            key={amenity.id} 
                            className="flex items-center gap-2 text-sm"
                            whileHover={{ x: 5 }}
                          >
                            <span className="#0F1520 font-bold">✓</span>
                            <span className="text-gray-700">{amenity.title}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
                <motion.button
                  onClick={() => setShowAllAmenities(true)}
                  className="w-full px-6 py-3 bg-gradient-to-r from-[#0F1520] to-[#1a2332] text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Show all {amenities.length} amenities
                </motion.button>
              </>
            ) : (
              <p className="text-center py-4 text-gray-500">No amenities listed for this property</p>
            )}
          </motion.div>

          <motion.div 
            className="p-6 bg-gradient-to-br from-white via-blue-50/30 to-white rounded-2xl border border-gray-200 shadow-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Where you'll be</h2>
            <div className="flex items-center gap-2 mb-4 text-gray-600">
              <FaMapMarkerAlt className="#0F1520" />
              <p className="font-medium">{listing.location}</p>
            </div>

            <div className="h-80 rounded-xl overflow-hidden shadow-lg border border-gray-200">
              <Map
                latitude={parseFloat(listing.latitude)}
                longitude={parseFloat(listing.longitude)}
                zoom={14}
                title={listing.title}
                price={listing.price}
                showPopup={true}
              />
            </div>
          </motion.div>

          <ReviewSection
            reviews={reviews}
            setReviews={setReviews}
            currentUser={currentUser}
            hasBooked={hasBooked}
            hasReviewed={hasReviewed}
            setHasReviewed={setHasReviewed}
            listingId={id}
          />
        </div>

        <div className="lg:col-span-1">
          <BookingCard
            listing={listing}
            dateRange={dateRange}
            setDateRange={setDateRange}
            isDatePickerOpen={isDatePickerOpen}
            setIsDatePickerOpen={setIsDatePickerOpen}
            handleReserveClick={handleReserveClick}
            bookedDates={bookedDates}
            currentUser={currentUser}
          />
        </div>
      </div>

      {showConfirmation && (
        <ConfirmationModal
          onClose={() => setShowConfirmation(false)}
          onSuccess={handleBookingSuccess}
          listing={listing}
          dateRange={dateRange}
        />
      )}

      {showSuccess && <SuccessModal onClose={() => setShowSuccess(false)} />}

      {showAllAmenities && (
        <AmenitiesModal
          amenitiesByCategory={amenitiesByCategory}
          onClose={() => setShowAllAmenities(false)}
        />
      )}
    </motion.div>
  );
}

export default ListingDetailsPage;