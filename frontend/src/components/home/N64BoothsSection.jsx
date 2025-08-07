import React from "react";
import { Link } from "react-router-dom";

const N64BoothsSection = () => {
  return (
    <section className="py-12 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-['Orbitron'] text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
              N64 booths for hire!
            </h2>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Get your retro game on with our N64 gaming booths – Mickey &
              Minnie! Each booth includes a classic Nintendo 64 console, 4
              controllers, and your choice of 5 legendary games. Perfect for
              friendly battles, or nostalgic throwbacks.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300">Booth booked 1hr sessions</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <span className="text-gray-300">
                  2 booths "Mickey & Minnie"
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                <span className="text-gray-300">
                  5 multiplayer games to pick from
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-gray-300">Genuine original N64</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-gray-300">Food packages</span>
              </div>
            </div>

            <Link
              to="/n64-booth-booking"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-cyan-600 text-white font-bold rounded-lg text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl neon-glow-green"
            >
              🎮 BOOK N64 BOOTH
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://8bitbar.com.au/wp-content/uploads/2025/03/20250419_212301-scaled.jpg"
              alt="N64 Gaming Booth"
              className="w-full h-48 object-cover rounded-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/600x400/1a202c/9f7aea?text=N64+Booth";
              }}
            />
            <img
              src="https://8bitbar.com.au/wp-content/uploads/2025/05/20250419_225434-1153x2048.jpg"
              alt="N64 Booth Interior"
              className="w-full h-48 object-cover rounded-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/600x400/1a202c/9f7aea?text=N64+Interior";
              }}
            />
            <img
              src="https://8bitbar.com.au/wp-content/uploads/2025/03/mario-kart.jpeg"
              alt="Mario Kart N64"
              className="w-full h-48 object-cover rounded-lg col-span-2"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/600x400/1a202c/9f7aea?text=Mario+Kart";
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default N64BoothsSection;
