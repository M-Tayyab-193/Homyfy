import { FaTimes, FaChevronRight } from 'react-icons/fa';

function ImageGallery({ images = [], selectedImage, setSelectedImage, showAllImages, setShowAllImages }) {
  // Add console.log to debug images prop
  console.log('ImageGallery received images:', images);
   
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-8 rounded-xl overflow-hidden relative">
        {Array.isArray(images) && images[0] && (
          <div className="md:col-span-2 md:row-span-2 h-64 md:h-auto">
            {/* Corrected field */}
            <img
              src={images[0].image_url}
              alt="Main view"
              className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => setSelectedImage(0)}
            />
          </div>
        )}

        {Array.isArray(images) && images.slice(1, 5).map((image, index) =>
          image ? (
            <div key={index} className="h-32 md:h-auto">
              {/* Corrected field */}
              <img
                src={image.image_url}
                alt={`View ${index + 2}`}
                className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                onClick={() => setSelectedImage(index + 1)}
              />
            </div>
          ) : null
        )}

        {Array.isArray(images) && images.length > 5 && (
          <button
            onClick={() => setShowAllImages(true)}
            className="absolute bottom-4 right-4 bg-white text-airbnb-dark px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-shadow z-10"
          >
            Show all photos ({images.length})
          </button>
        )}
      </div>

      {showAllImages && Array.isArray(images) && images.length > 0 && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="sticky top-0 bg-white z-10 py-4 px-6 border-b">
            <div className="container-custom flex justify-between items-center">
              <h2 className="text-2xl font-semibold">All photos</h2>
              <button
                onClick={() => setShowAllImages(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <FaTimes className="text-2xl" />
              </button>
            </div>
          </div>

          <div className="container-custom py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {images.map((image, index) =>
                image ? (
                  <div key={index} className="space-y-2">
                    {/* Corrected field */}
                    <img
                      src={image.image_url}
                      alt={`View ${index + 1}`}
                      className="w-full rounded-lg"
                      loading="lazy"
                    />
                  </div>
                ) : null
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ImageGallery;
