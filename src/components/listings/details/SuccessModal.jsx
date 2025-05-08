import { useNavigate } from 'react-router-dom';

function SuccessModal() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
      <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600">
            Your reservation has been successfully confirmed.
          </p>
        </div>

        <div className="space-y-4">
          <button onClick={() => navigate("/")} className="w-full btn-primary">
            Return to Home
          </button>
          <button
            onClick={() => navigate("/bookings")}
            className="w-full btn-secondary"
          >
            View My Bookings
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuccessModal;