import React, { useState } from "react";
import { X, Instagram, Camera } from "lucide-react";

const GalleryPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const galleryImages = [
    {
      id: 1,
      src: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg",
      alt: "Classic arcade machines in neon lighting",
      category: "arcade",
    },
    {
      id: 2,
      src: "https://images.pexels.com/photos/3769747/pexels-photo-3769747.jpeg",
      alt: "Neon-lit gaming booth with cocktails",
      category: "atmosphere",
    },
    {
      id: 3,
      src: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg",
      alt: "Karaoke room with neon ambiance",
      category: "karaoke",
    },
    {
      id: 4,
      src: "https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg",
      alt: "VIP gaming lounge interior",
      category: "interior",
    },
    {
      id: 5,
      src: "https://images.pexels.com/photos/1304540/pexels-photo-1304540.jpeg",
      alt: "Glowing cocktails at the bar",
      category: "drinks",
    },
    {
      id: 6,
      src: "https://images.pexels.com/photos/1108117/pexels-photo-1108117.jpeg",
      alt: "Delicious arcade-themed food",
      category: "food",
    },
    {
      id: 7,
      src: "https://images.pexels.com/photos/7991693/pexels-photo-7991693.jpeg",
      alt: "Party gaming room setup",
      category: "events",
    },
    {
      id: 8,
      src: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
      alt: "Dance floor with neon lights",
      category: "atmosphere",
    },
    {
      id: 9,
      src: "https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg",
      alt: "Comedy night stage setup",
      category: "events",
    },
    {
      id: 10,
      src: "https://images.pexels.com/photos/1106468/pexels-photo-1106468.jpeg",
      alt: "Trivia night crowd enjoying drinks",
      category: "events",
    },
    {
      id: 11,
      src: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg",
      alt: "Pixel art workshop in progress",
      category: "workshop",
    },
    {
      id: 12,
      src: "https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg",
      alt: "Neon wings with signature sauce",
      category: "food",
    },
  ];

  const openModal = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-['Orbitron'] text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400">
            NEON GALLERY
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            Experience the electric atmosphere of 8-Bit Bar through our stunning
            photo gallery. See the neon lights, classic games, and unforgettable
            moments!
          </p>

          <div className="flex justify-center space-x-4 mb-8">
            <a
              href="#"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 neon-glow-pink"
            >
              <Instagram className="mr-2 h-5 w-5" />
              Follow @8bitbar
            </a>
            <a
              href="#"
              className="inline-flex items-center px-6 py-3 border-2 border-cyan-400 text-cyan-400 font-semibold rounded-lg transition-all duration-300 hover:bg-cyan-400 hover:text-black hover:scale-105 neon-glow-cyan"
            >
              <Camera className="mr-2 h-5 w-5" />
              Tag Us!
            </a>
          </div>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {galleryImages.map((image) => (
            <div
              key={image.id}
              className="relative group cursor-pointer overflow-hidden rounded-lg transition-all duration-300 hover:scale-105"
              onClick={() => openModal(image.src)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white text-sm font-medium">{image.alt}</p>
                </div>
              </div>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-black/80 p-2 rounded-full">
                  <Camera className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Instagram Feed Section */}
        <div className="mt-20">
          <div className="bg-black/50 border border-pink-500/30 rounded-lg p-8 text-center">
            <h3 className="font-['Orbitron'] text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400">
              SHARE YOUR MOMENTS
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Captured an epic gaming moment or created the perfect neon selfie?
              Tag us @8bitbar and use #8BitBarAU to be featured in our gallery!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full text-sm font-semibold">
                #8BitBarAU
              </span>
              <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-full text-sm font-semibold">
                #NeonNights
              </span>
              <span className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full text-sm font-semibold">
                #RetroGaming
              </span>
              <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full text-sm font-semibold">
                #ArcadeBar
              </span>
            </div>
          </div>
        </div>

        {/* Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={closeModal}
                className="absolute -top-12 right-0 text-white hover:text-pink-400 transition-colors"
              >
                <X className="h-8 w-8" />
              </button>
              <img
                src={selectedImage}
                alt="Gallery image"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
