import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaHeart, FaRegHeart, FaArrowLeft, FaMapMarkerAlt } from "react-icons/fa";
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
  const [showAllImages, setShowAllImages] = useState(false);
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
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchBookedDates = async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("start_date, end_date")
        .eq("listing_id", id);

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
        const { data: listingData, error: listingError } = await supabase
          .from("listings")
          .select(`
            *,
            users!listings_user_id_fkey (
              id,
              fullname,
              email,
              profile_image,
              registeration_date
            ),
            listing_images (
              image_url,
              caption
            ),
            listing_amenities (
              amenities (
                id,
                amenity_name,
                amenity_categories (
                  id,
                  title
                )
              )
            )
          `)
          .eq("id", id)
          .single();

        if (listingError) throw listingError;

        const amenitiesList = listingData.listing_amenities.map((item) => ({
          id: item.amenities.id,
          title: item.amenities.amenity_name,
          category: item.amenities.amenity_categories.title,
        }));

        const grouped = amenitiesList.reduce((acc, amenity) => {
          if (!acc[amenity.category]) {
            acc[amenity.category] = [];
          }
          acc[amenity.category].push(amenity);
          return acc;
        }, {});

        const transformedListing = {
          ...listingData,
          images: listingData.listing_images.map((img) => ({
            url: img.image_url,
            caption: img.caption,
          })),
          host: {
            id: listingData.users.id,
            name: listingData.users.fullname,
            email: listingData.users.email,
            avatar:
              listingData.users.profile_image ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${listingData.users.email}`,
            registrationDate: listingData.users.registeration_date,
          },
        };

        setListing(transformedListing);
        setAmenities(amenitiesList);
        setAmenitiesByCategory(grouped);
        document.title = transformedListing.title;
      } catch (error) {
        console.error("Error fetching listing details:", error);
        navigate("/not-found");
      } finally {
        setLoading(false);
      }
    };

    fetchListingDetails();
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

  if (loading || !listing) {
    return <LoadingSpinner fullScreen />;
  }

  const isWishlisted = wishlist.includes(id);

  return (
    <div className="container-custom py-6">
      <button
        onClick={handleBack}
        className="flex items-center text-airbnb-dark hover:text-airbnb-primary transition-colors mb-4"
      >
        <FaArrowLeft className="mr-2" />
        <span>Back to search</span>
      </button>

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold mb-2">
          {listing.title}
        </h1>
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center flex-wrap">
            <div className="flex items-center mr-3">
              <FaStar className="text-airbnb-primary mr-1" />
              <span className="font-medium">{listing.rating_overall}</span>
              <span className="mx-1">·</span>
              <span className="underline">{listing.reviews_count} reviews</span>
            </div>
            <span>{listing.location}</span>
          </div>

          <div className="flex mt-2 md:mt-0">
            <button
              className="flex items-center hover:underline"
              onClick={handleWishlistToggle}
            >
              {isWishlisted ? (
                <FaHeart className="mr-1 text-airbnb-primary" />
              ) : (
                <FaRegHeart className="mr-1" />
              )}
              <span>Add to wishlist</span>
            </button>
          </div>
        </div>
      </div>

      <ImageGallery
        images={listing.images}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        showAllImages={showAllImages}
        setShowAllImages={setShowAllImages}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-start pb-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold">
                Hosted by {listing.host.name}
              </h2>
              <p className="text-airbnb-light">
                {listing.guest_count} guests · {listing.bed_count} beds ·{" "}
                {listing.bathroom_count} baths
              </p>
            </div>
            <div className="flex flex-col items-center">
              <img
                src={listing.host.avatar}
                alt={listing.host.name}
                className="w-14 h-14 rounded-full object-cover"
              />
            </div>
          </div>

          <div className="py-6 border-b border-gray-200">
            <p className="text-gray-700 whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          <div className="py-6">
            <h2 className="text-xl font-semibold mb-4">Where you'll be</h2>
            <p className="mb-4">{listing.location}</p>

            <div className="h-80 rounded-lg overflow-hidden z-0">
              <Map
                latitude={parseFloat(listing.latitude)}
                longitude={parseFloat(listing.longitude)}
                zoom={14}
              />
            </div>
          </div>

          <ReviewSection
            reviews={reviews}
            setReviews={setReviews}
            currentUser={currentUser}
            hasBooked={hasBooked}
            hasReviewed={hasReviewed}
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
          onConfirm={() => {
            setShowConfirmation(false);
            setShowSuccess(true);
          }}
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
    </div>
  );
}

export default ListingDetailsPage;