import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Gallery = ({ currentColors }) => {
  const safeColors = currentColors || {
    background: "#f9f9f9",
    primary: "#e65100",
    secondary: "#ff9800",
  };

  const galleryData = [
    { year: 2019, images: ["/gallery/2019.jpg"] },
    { year: 2020, images: ["/gallery/2020.jpg"] },
    { year: 2021, images: ["/gallery/2021.jpg"] },
    { year: 2022, images: ["/gallery/2022.jpg"] },
    { year: 2023, images: ["/gallery/2023.jpg"] },
    { year: 2024, images: ["/gallery/2024.jpg"] },
  ];

  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <motion.section
      className="py-12 px-4"
      style={{ backgroundColor: safeColors.background }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="max-w-6xl mx-auto text-center">
        <h2
          className="text-3xl font-bold mb-10"
          style={{ color: safeColors.primary }}
        >
          📸 Gallery
        </h2>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {galleryData.map((section, sIndex) =>
            section.images.map((img, index) => (
              <motion.div
                key={`${section.year}-${index}`}
                className="relative group overflow-hidden rounded-xl shadow-md cursor-pointer bg-white"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (sIndex + index), duration: 0.4 }}
                onClick={() => setSelectedImage({ img, year: section.year })}
              >
                <div className="w-full h-64 flex items-center justify-center">
                  <img
                    src={img}
                    alt={`ganesh-${section.year}`}
                    className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm py-2 px-3 text-left">
                  📅 {section.year}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.img
              src={selectedImage.img}
              alt={`ganesh-full-${selectedImage.year}`}
              className="max-h-[90vh] max-w-full object-contain rounded-lg shadow-2xl border-4 border-white"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default Gallery;
