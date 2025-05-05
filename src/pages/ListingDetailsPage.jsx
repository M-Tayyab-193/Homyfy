import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  FaStar, 
  FaHeart, 
  FaRegHeart,
  FaRegCalendarAlt,
  FaTimes,
  FaArrowLeft,
  FaCreditCard,
  FaMobile
} from 'react-icons/fa'
import { useListings } from '../contexts/ListingsContext'
import supabase from '../supabase/supabase'
import Map from '../components/map/Map'
import DateRangePicker from '../components/search/DateRangePicker'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { toast } from 'react-toastify'

function ListingDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { wishlist, toggleWishlist } = useListings()
  
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    key: 'selection'
  })
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [paymentNumber, setPaymentNumber] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [bookedDates, setBookedDates] = useState([])

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)
    }
    fetchUser()
  }, [])

  useEffect(() => {
    const fetchBookedDates = async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('start_date, end_date')
        .eq('listing_id', id)

      if (error) {
        console.error('Error fetching booked dates:', error)
        return
      }

      const disabledDates = []
      data.forEach(booking => {
        const start = new Date(booking.start_date)
        const end = new Date(booking.end_date)
        let current = new Date(start)

        while (current <= end) {
          disabledDates.push(new Date(current))
          current.setDate(current.getDate() + 1)
        }
      })

      setBookedDates(disabledDates)
    }

    if (id) {
      fetchBookedDates()
    }
  }, [id])

  const isDateBooked = (date) => {
    return bookedDates.some(bookedDate => 
      date.toDateString() === bookedDate.toDateString()
    )
  }

  const validateDateRange = () => {
    let currentDate = new Date(dateRange.startDate)
    while (currentDate <= dateRange.endDate) {
      if (isDateBooked(currentDate)) {
        return false
      }
      currentDate.setDate(currentDate.getDate() + 1)
    }
    return true
  }

  useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        const { data: listingData, error: listingError } = await supabase
          .from('listings')
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
            )
          `)
          .eq('id', id)
          .single()

        if (listingError) throw listingError

        const transformedListing = {
          ...listingData,
          images: listingData.listing_images.map(img => ({
            url: img.image_url,
            caption: img.caption
          })),
          host: {
            id: listingData.users.id,
            name: listingData.users.fullname,
            email: listingData.users.email,
            avatar: listingData.users.profile_image || `https://api.dicebear.com/7.x/initials/svg?seed=${listingData.users.email}`,
            registrationDate: listingData.users.registeration_date
          }
        }

        setListing(transformedListing)
        document.title = transformedListing.title
      } catch (error) {
        console.error('Error fetching listing details:', error)
        navigate('/not-found')
      } finally {
        setLoading(false)
      }
    }

    fetchListingDetails()
  }, [id, navigate])

  const handleBack = () => {
    navigate(-1)
  }

  const handleWishlistToggle = () => {
    if (!currentUser) {
      toast.info('Please log in to add to wishlist')
      navigate('/login', { state: { from: `/listings/${id}` } })
      return
    }
    toggleWishlist(id)
  }

  const validatePaymentNumber = (number) => {
    return /^\d{11}$/.test(number)
  }

  const handleBooking = async () => {
    if (!currentUser) {
      navigate('/login', { state: { from: `/listings/${id}` } })
      return
    }

    if (!validateDateRange()) {
      toast.error('Selected dates are not available')
      return
    }

    if (paymentMethod && paymentMethod !== 'arrival') {
      if (!validatePaymentNumber(paymentNumber)) {
        toast.error('Please enter a valid 11-digit number')
        return
      }
    }
    
    try {
      // Create booking
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .insert([{
          guest_id: currentUser.id,
          listing_id: id,
          start_date: dateRange.startDate,
          end_date: dateRange.endDate,
          total_amount: total,
          payment_status: paymentMethod === 'arrival' ? 'pending' : 'completed',
          booking_date: new Date()
        }])
        .select()
        .single()

      if (bookingError) throw bookingError

      // Create payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .insert([{
          booking_id: bookingData.id,
          amount: total,
          method: paymentMethod,
          status: paymentMethod === 'arrival' ? 'pending' : 'completed'
        }])

      if (paymentError) throw paymentError

      setShowConfirmation(false)
      setShowSuccess(true)
    } catch (error) {
      console.error('Booking error:', error)
      toast.error('Failed to complete booking. Please try again.')
    }
  }

  const SuccessModal = () => (
   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
      <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600">Your reservation has been successfully confirmed.</p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => navigate('/')}
            className="w-full btn-primary"
          >
            Return to Home
          </button>
          <button
            onClick={() => navigate('/bookings')}
            className="w-full btn-secondary"
          >
            View My Bookings
          </button>
        </div>
      </div>
    </div>
  )

  if (loading || !listing) {
    return <LoadingSpinner fullScreen />
  }

  const isWishlisted = wishlist.includes(id)
  const numberOfNights = Math.round((dateRange.endDate - dateRange.startDate) / (1000 * 60 * 60 * 24))
  const subtotal = listing.price_value * numberOfNights
  const serviceFee = Math.round(subtotal * 0.15)
  const total = subtotal + serviceFee

  const ConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Confirm Booking</h2>
          <button onClick={() => setShowConfirmation(false)} className="text-gray-500">
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
                <span>${listing.price_value} × {numberOfNights} nights</span>
                <span>${subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Service fee</span>
                <span>${serviceFee}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Payment Method</h3>
            <select 
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-2 border rounded-lg mb-2"
            >
              <option value="">Select payment method</option>
              <option value="jazzcash">JazzCash</option>
              <option value="easypaisa">EasyPaisa</option>
              <option value="card">Card</option>
              <option value="arrival">Pay upon arrival</option>
            </select>

            {paymentMethod && paymentMethod !== 'arrival' && (
              <input
                type="text"
                value={paymentNumber}
                onChange={(e) => setPaymentNumber(e.target.value)}
                placeholder="Enter 11-digit number"
                className="w-full p-2 border rounded-lg"
                maxLength="11"
              />
            )}
          </div>

          <button
            onClick={handleBooking}
            disabled={!paymentMethod}
            className={`w-full btn-primary ${!paymentMethod ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Confirm and Pay
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="container-custom py-6">
      <button onClick={handleBack} className="flex items-center text-airbnb-dark hover:text-airbnb-primary transition-colors mb-4">
        <FaArrowLeft className="mr-2" />
        <span>Back to search</span>
      </button>

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold mb-2">{listing.title}</h1>
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-8 rounded-xl overflow-hidden relative">
        <div className="md:col-span-2 md:row-span-2 h-64 md:h-auto">
          <img 
            src={listing.images[0].url} 
            alt={listing.images[0].caption || listing.title} 
            className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
            onClick={() => setSelectedImage(0)}
          />
        </div>
        {listing.images.slice(1, 5).map((image, index) => (
          <div key={index} className="h-32 md:h-auto">
            <img 
              src={image.url} 
              alt={image.caption || `${listing.title} - view ${index + 2}`}
              className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => setSelectedImage(index + 1)}
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-start pb-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold">
                Hosted by {listing.host.name}
              </h2>
              <p className="text-airbnb-light">
                {listing.guest_count} guests · {listing.bed_count} beds · {listing.bathroom_count} baths
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
            
            <div className="h-80 rounded-lg overflow-hidden">
              <Map 
                latitude={parseFloat(listing.latitude)}
                longitude={parseFloat(listing.longitude)}
                zoom={14}
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
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
                    {dateRange.startDate.toLocaleDateString()} - {dateRange.endDate.toLocaleDateString()}
                  </div>
                </div>
                <FaRegCalendarAlt />
              </button>
            </div>
            
            {isDatePickerOpen && (
              <div className="absolute left-0 right-0 mt-1 bg-white rounded-2xl shadow-lg z-10 border border-gray-200">
                <DateRangePicker 
                  ranges={[dateRange]}
                  onChange={item => setDateRange(item.selection)}
                  onClose={() => setIsDatePickerOpen(false)}
                  disabledDates={bookedDates}
                />
              </div>
            )}
            
            <button
              className="w-full btn-primary mb-4"
              onClick={() => setShowConfirmation(true)}
            >
              Reserve
            </button>
            
            <p className="text-center text-sm text-airbnb-light mb-4">You won't be charged yet</p>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="underline">${listing.price_value} × {numberOfNights} nights</span>
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
        </div>
      </div>

      {showConfirmation && <ConfirmationModal />}
      {showSuccess && <SuccessModal />}
    </div>
  )
}

export default ListingDetailsPage