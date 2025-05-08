import { FaTimes } from 'react-icons/fa';

function AmenitiesModal({ amenitiesByCategory, onClose }) {
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="sticky top-0 bg-white z-10 py-4 px-6 border-b">
        <div className="container-custom flex justify-between items-center">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FaTimes className="text-2xl" />
          </button>
          <h2 className="text-2xl font-semibold">What this place offers</h2>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="container-custom py-8">
        {Object.entries(amenitiesByCategory).map(([category, items]) => (
          <div key={category} className="mb-8">
            <h3 className="text-xl font-semibold mb-4">{category}</h3>
            <div className="space-y-4">
              {items.map((amenity) => (
                <div key={amenity.id} className="flex items-center">
                  <span className="text-lg mr-4">✓</span>
                  <span>{amenity.title}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AmenitiesModal;