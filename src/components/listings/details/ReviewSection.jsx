import { useState, useRef, useCallback } from 'react';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import supabase from '../../../supabase/supabase';

function ReviewSection({
  reviews,
  setReviews,
  currentUser,
  hasBooked,
  hasReviewed,
  setHasReviewed,
  listingId
}) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userReview, setUserReview] = useState("");
  const [userRating, setUserRating] = useState(5);
  const reviewTextRef = useRef(null);

  const handleReviewTextChange = useCallback((e) => {
    setUserReview(e.target.value);
  }, []);

  const handleStarHover = useCallback((index, isHalf) => {
    const rating = isHalf ? index + 0.5 : index + 1;
    setUserRating(rating);
  }, []);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error('Please log in to leave a review');
      return;
    }

    try {
      const { error } = await supabase.rpc("create_review_with_check", {
      p_listing_id: listingId,
      p_guest_id: currentUser.id,
      p_review_text: userReview,
      p_rating: userRating,
    });

      if (error) throw error;

      toast.success('Review submitted successfully!');
      setUserReview('');
      setUserRating(5);
      setShowReviewForm(false);
      setHasReviewed(true);
      
      // Refresh reviews
      const { data: newReviews, error: reviewsError } = await supabase
  .rpc('get_reviews_with_user_info', {
    p_listing_id: listingId,
  });

if (reviewsError) {
  console.error('Error fetching reviews:', reviewsError);
} else {
  console.log('Fetched reviews:', newReviews);
}
      setReviews(newReviews);
    } catch (err) {
      toast.error('Error submitting review: ' + err.message);
    }
  };

  return (
    <motion.div 
      className="mt-8 p-6 bg-gradient-to-br from-white via-amber-50/30 to-white rounded-2xl border border-gray-200 shadow-card"
      id='review-section'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Guest Reviews ({reviews.length})
        </h2>
        <FaQuoteLeft className="text-3xl text-amber-300" />
      </div>

      {currentUser && !hasReviewed && hasBooked && (
        <motion.button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="mb-6 px-6 py-3 bg-gradient-to-r from-[#0F1520] to-[#1a2332] text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          {showReviewForm ? 'Cancel Review' : 'Leave a Review'}
        </motion.button>
      )}

      <AnimatePresence>
        {showReviewForm && (
          <motion.form 
            onSubmit={handleReviewSubmit} 
            className="mb-8 p-6 bg-white rounded-xl border-2 border-gray-300 shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <label className="block text-sm font-bold mb-3 text-gray-700">Your Rating</label>
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, index) => (
                  <motion.div
                    key={index}
                    className="relative cursor-pointer"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <div
                      className="w-6 h-12 absolute top-0 left-0"
                      style={{ width: '50%' }}
                      onMouseEnter={() => handleStarHover(index, true)}
                    />
                    <div
                      className="w-6 h-12 absolute top-0 right-0"
                      style={{ width: '50%' }}
                      onMouseEnter={() => handleStarHover(index, false)}
                    />
                    <FaStar
                      className={`text-3xl transition-colors ${
                        userRating >= index + 1
                          ? 'text-yellow-400'
                          : userRating > index
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </motion.div>
                ))}
                <span className="ml-3 text-xl font-bold text-gray-700">{userRating}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold mb-3 text-gray-700">Your Review</label>
              <textarea
                ref={reviewTextRef}
                value={userReview}
                onChange={handleReviewTextChange}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#0F1520] focus:ring-2 focus:ring-blue-200 transition-all"
                rows="4"
                placeholder="Share your experience..."
                required
              />
            </div>

            <motion.button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#0F1520] to-[#1a2332] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Submit Review
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {reviews.map((review, idx) => (
          <motion.div 
            key={review.id} 
            className="p-6 bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.01, y: -2 }}
          >
            <div className="flex items-start gap-4 mb-4">
              <motion.img
                src={review.profile_image || `https://api.dicebear.com/7.x/initials/svg?seed=${review.fullname}`}
                alt={review.fullname}
                className="w-12 h-12 rounded-full border-2 border-gray-300 shadow-md"
                whileHover={{ scale: 1.1, rotate: 5 }}
              />
              <div className="flex-1">
                <p className="font-bold text-gray-900">{review.fullname}</p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-full border border-yellow-200">
                    <FaStar className="text-yellow-400 text-sm" />
                    <span className="font-semibold text-sm">{review.rating}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500 text-sm">
                    {new Date(review.created_at).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">{review.review_text}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default ReviewSection;