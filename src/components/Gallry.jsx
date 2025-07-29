import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";

const Gallery = ({ currentColors }) => {
  const safeColors = currentColors || {
    background: "#f9f9f9",
    primary: "#e65100",
    secondary: "#ff9800",
  };

  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState("Gods/Murti");

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

  const handleKeyDown = (e) => {
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
  };

  useEffect(() => {
    if (selectedImage) {
      console.log("Selected image:", selectedImage);
    }
  }, [selectedImage]);

  if (loading) {
    return (
      <section
        className="py-16 px-4"
        style={{ backgroundColor: safeColors.background }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading gallery...</p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="py-16 px-4"
      style={{ backgroundColor: safeColors.background }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{ color: safeColors.primary }}
          >
            📸 Our Journey Through Years
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Relive the magical moments of Ganesh Chaturthi celebrations and our
            charitable activities
          </p>
        </div>

        {/* Category Tabs */}
        <div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-8"
        >
          <div className="flex bg-white rounded-lg shadow-md p-1">
            {["Gods/Murti", "Charity"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-md transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-orange-500 text-white"
                    : "text-gray-600 hover:text-orange-500"
                }`}
              >
                {cat === "Gods/Murti" ? "🕉️ Gods/Murti" : "❤️ Charity"}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allImages.map((image, index) => (
            <motion.div
              key={image.id}
              className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer bg-white"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleImageClick(image, index)}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={image.imageUrl}
                  alt={image.title || "Untitled Image"}
                  className="w-full h-full object-contain object-center group-hover:scale-110 transition-transform duration-300"
                  onError={() => {
                    console.error("Failed to load image:", image.imageUrl);
                    // Don't hide the image completely. Optional: show a placeholder.
                  }}
                  onLoad={() => {
                    console.log("Image loaded:", image.imageUrl);
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-semibold text-lg">
                    {image.title || "Untitled"}
                  </h3>
                  <p className="text-sm opacity-90">
                    {image.year || "Unknown year"}
                  </p>
                </div>
              </div>
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                {image.year || "N/A"}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {allImages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg">
              No {activeCategory.toLowerCase()} images available yet.
            </p>
          </motion.div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            {/* Close */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
            >
              <X className="h-6 w-6 text-white" />
            </button>

            {/* Navigation */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30"
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>

            {/* Modal Image */}
            <div className="relative w-full h-full flex items-center justify-center p-8">
              <motion.img
                key={currentImageIndex}
                src={selectedImage.imageUrl}
                alt={selectedImage.title || "Image"}
                className="max-w-none max-h-none w-auto h-auto object-contain object-center rounded-lg shadow-2xl"
                style={{ maxWidth: "100vw", maxHeight: "100vh" }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
              <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Ganesh Utsav</p>
                    <p className="text-lg font-bold">
                      {selectedImage.year || "Year unknown"}
                    </p>
                  </div>
                  <div className="text-sm opacity-75">
                    {currentImageIndex + 1} of {allImages.length}
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              Use arrow keys to navigate • ESC to close
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
