import { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Calendar,
  Tag,
} from "lucide-react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";

const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState("Gods/Murti");
  const [hoveredImage, setHoveredImage] = useState(null);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const q = query(collection(db, "gallery"), orderBy("year", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Fetched gallery images:", data);
        setGalleryImages(data);
      } catch (error) {
        console.error("Error fetching gallery images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  const godsImages = galleryImages.filter(
    (img) => img.category === "Gods/Murti"
  );
  const charityImages = galleryImages.filter(
    (img) => img.category === "Charity"
  );

  const allImages =
    activeCategory === "Gods/Murti" ? godsImages : charityImages;

  const handleImageClick = (image, index) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const nextIndex = (currentImageIndex + 1) % allImages.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(allImages[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex =
      currentImageIndex === 0 ? allImages.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(allImages[prevIndex]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-white border-t-transparent rounded-full"
            />
          </div>
          <p className="text-gray-600 font-medium">
            Loading beautiful memories...
          </p>
        </motion.div>
      </div>
    );
  }

  if (galleryImages.length === 0) {
    return (
      <div className="text-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6"
        >
          <Tag className="h-10 w-10 text-gray-400" />
        </motion.div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No Images Yet
        </h3>
        <p className="text-gray-500">
          We're preparing to share our beautiful moments with you.
        </p>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            📸 Our Journey Through Years
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore the beautiful moments and divine blessings captured over the
            years
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-16"
        >
          <div className="flex bg-white rounded-2xl p-2 shadow-xl border border-gray-100">
            {[
              {
                key: "Gods/Murti",
                label: "Gods & Murti",
                icon: "🕉️",
                count: godsImages.length,
              },
              {
                key: "Charity",
                label: "Charity Work",
                icon: "❤️",
                count: charityImages.length,
              },
            ].map((category) => (
              <button
                key={category.key}
                onClick={() => setActiveCategory(category.key)}
                className={`relative px-8 py-4 rounded-xl text-sm font-semibold transition-all duration-500 ${
                  activeCategory === category.key
                    ? "text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {activeCategory === category.key && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <span className="text-lg">{category.icon}</span>
                  <span>{category.label}</span>
                  <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                    {category.count}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          <AnimatePresence mode="wait">
            {allImages.map((image, index) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer bg-white hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                onClick={() => handleImageClick(image, index)}
                onMouseEnter={() => setHoveredImage(image.id)}
                onMouseLeave={() => setHoveredImage(null)}
              >
                {/* Image Container */}
                <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  <motion.img
                    src={image.imageUrl}
                    alt={image.title || "Gallery Image"}
                    className="w-full h-full object-cover object-center"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    onError={() => {
                      console.error("Failed to load image:", image.imageUrl);
                    }}
                  />
                </div>

                {/* Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredImage === image.id ? 1 : 0 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"
                >
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-bold text-xl text-white mb-2">
                      {image.title || "Untitled"}
                    </h3>
                    <div className="flex items-center gap-3 text-white/90">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">
                          {image.year || "Unknown"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Tag className="h-4 w-4" />
                        <span className="text-sm">{image.category}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Zoom Icon */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: hoveredImage === image.id ? 1 : 0,
                    scale: hoveredImage === image.id ? 1 : 0,
                  }}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg"
                >
                  <ZoomIn className="h-5 w-5 text-gray-700" />
                </motion.div>

                {/* Year Badge */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg">
                  <span className="text-sm font-bold text-gray-800">
                    {image.year || "N/A"}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
              onClick={closeModal}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="relative max-w-[95vw] max-h-[95vh] w-auto h-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title || "Gallery Image"}
                  className="max-w-full max-h-full w-auto h-auto object-contain rounded-2xl shadow-2xl"
                  style={{
                    maxWidth: "95vw",
                    maxHeight: "95vh",
                    width: "auto",
                    height: "auto",
                  }}
                />

                {/* Navigation Buttons */}
                {allImages.length > 1 && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={prevImage}
                      className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-4 rounded-full transition-all duration-200 backdrop-blur-sm"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-7 w-7" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={nextImage}
                      className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-4 rounded-full transition-all duration-200 backdrop-blur-sm"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-7 w-7" />
                    </motion.button>
                  </>
                )}

                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeModal}
                  className="absolute -top-6 -right-6 bg-red-500 hover:bg-red-600 text-white p-4 rounded-full transition-all duration-200 shadow-lg"
                  aria-label="Close modal"
                >
                  <X className="h-6 w-6" />
                </motion.button>

                {/* Image Info */}
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-8 rounded-b-2xl"
                >
                  <div className="text-center text-white">
                    <h3 className="text-2xl font-bold mb-3">
                      {selectedImage.title || "Untitled"}
                    </h3>
                    <div className="flex items-center justify-center gap-6 text-white/90">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        <span>{selectedImage.year || "Unknown year"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Tag className="h-5 w-5" />
                        <span>{selectedImage.category || "Uncategorized"}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Image Counter */}
                {allImages.length > 1 && (
                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="absolute top-6 left-6 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm"
                  >
                    {currentImageIndex + 1} of {allImages.length}
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Gallery;
