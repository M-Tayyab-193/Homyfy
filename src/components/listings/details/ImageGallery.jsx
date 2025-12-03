import { motion } from 'framer-motion';
import ImageLightbox from '../../ui/ImageLightbox';

function ImageGallery({ images = [], selectedImage, setSelectedImage }) {
  console.log('ImageGallery received images:', images);
   
  return (
    <>
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-8 rounded-2xl overflow-hidden relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {Array.isArray(images) && images[0] && (
          <motion.div 
            className="md:col-span-2 md:row-span-2 h-64 md:h-auto relative group overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={images[0].image_url}
              alt="Main view"
              className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-110"
              onClick={() => setSelectedImage(0)}
            />
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white font-medium drop-shadow-lg">{images[0].caption}</p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {Array.isArray(images) && images.slice(1, 5).map((image, index) =>
          image ? (
            <motion.div 
              key={index} 
              className="h-32 md:h-auto relative group overflow-hidden rounded-lg"
              whileHover={{ scale: 1.05, zIndex: 10 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={image.image_url}
                alt={`View ${index + 2}`}
                className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-110"
                onClick={() => setSelectedImage(index + 1)}
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
          ) : null
        )}

        {Array.isArray(images) && images.length > 5 && (
          <motion.button
            onClick={() => setSelectedImage(0)}
            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md text-gray-900 px-5 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all z-20 border border-gray-200"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Show all photos ({images.length})
          </motion.button>
        )}
      </motion.div>

      <ImageLightbox
        images={images.map(img => img.image_url)}
        initialIndex={selectedImage}
        isOpen={selectedImage !== null}
        onClose={() => setSelectedImage(null)}
      />
    </>
  );
}

export default ImageGallery;
