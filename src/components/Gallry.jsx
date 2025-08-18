import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";

const Gallery = () => {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (galleryImages.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No images available yet.</p>
      </div>
    );
  }

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Category Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-md">
            {["Gods/Murti", "Charity"].map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? "bg-orange-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allImages.map((image, index) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer bg-white"
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
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedImage && (
            <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
              <div className="relative max-w-none max-h-none w-auto h-auto">
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title || "Gallery Image"}
                  className="max-w-none max-h-none w-auto h-auto object-contain"
                />

                {/* Navigation Buttons */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>

                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>

                {/* Image Info */}
                <div className="absolute bottom-4 left-4 right-4 text-center text-white">
                  <h3 className="text-lg font-semibold mb-1">
                    {selectedImage.title || "Untitled"}
                  </h3>
                  <p className="text-sm opacity-90">
                    {selectedImage.year || "Unknown year"} •{" "}
                    {selectedImage.category || "Uncategorized"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Gallery;
