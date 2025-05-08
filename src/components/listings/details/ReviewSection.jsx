import { useState, useRef, useCallback } from 'react';
import { FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import supabase from '../../../supabase/supabase';

function ReviewSection({
  reviews,
  setReviews,
  currentUser,
  hasBooked,
  hasReviewed,
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

    if (!hasBooked) {
      toast.error('You must book this listing before leaving a review');
      return;
    }

    if (hasReviewed) {
      toast.error('You have already reviewed this listing');
      return;
    }

    try {
      const { error } = await supabase
        .from('reviews')
        .insert([{
          listing_id: listingId,
          guest_id: currentUser.id,
          review_text: userReview,
          rating: userRating,
        }]);

      if (error) throw error;

      toast.success('Review submitted successfully!');
      setUserReview('');
      setUserRating(5);
      setShowReviewForm(false);

      // Refresh reviews
      const { data: newReviews, error: reviewsError } = await supabase
        .from('reviews')
        .select(`
          *,
          users (
            id,
            fullname,
            profile_image
          )
        `)
        .eq('listing_id', listingId)
        .order('created_at', { ascending: false });

      if (reviewsError) throw reviewsError;
      setReviews(newReviews);
    } catch (err) {
      toast.error('Error submitting review: ' + err.message);
    }
  };

  return (
    <div className="py-6 border-t border-gray-200">
      <h2 className="text-xl font-semibold mb-4">
        Reviews ({reviews.length})
      </h2>

      {currentUser && !hasReviewed && hasBooked && (
        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="mb-4 px-4 py-2 bg-airbnb-primary text-white rounded-lg hover:bg-opacity-90"
        >
          Leave a Review
        </button>
      )}

      {showReviewForm && (
        <form onSubmit={handleReviewSubmit} className="mb-6 p-4 border rounded-lg">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="relative"
                  style={{ cursor: 'pointer' }}
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
                    className={`text-2xl ${
                      userRating >= index + 1
                        ? 'text-yellow-400'
                        : userRating > index
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </div>
              ))}
              <span className="ml-2">{userRating}</span>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Your Review</label>
            <textarea
              ref={reviewTextRef}
              value={userReview}
              onChange={handleReviewTextChange}
              className="w-full p-2 border rounded-lg"
              rows="4"
              required
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-airbnb-primary text-white rounded-lg hover:bg-opacity-90"
          >
            Submit Review
          </button>
        </form>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-4">
            <div className="flex items-center mb-2">
              <img
                src={review.users.profile_image || `https://api.dicebear.com/7.x/initials/svg?seed=${review.users.fullname}`}
                alt={review.users.fullname}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <p className="font-medium">{review.users.fullname}</p>
                <div className="flex items-center">
                  <div className="flex items-center text-yellow-400">
                    <FaStar className="mr-1" />
                    <span>{review.rating}</span>
                  </div>
                  <span className="mx-2">•</span>
                  <span className="text-airbnb-light text-sm">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-gray-700">{review.review_text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewSection;