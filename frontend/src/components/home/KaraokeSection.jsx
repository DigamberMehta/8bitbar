import React from "react";
import { Link } from "react-router-dom";

const KaraokeSection = () => {
  return (
    <section className="bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-1 lg:order-2">
            <h2 className="font-['Orbitron'] text-3xl md:text-4xl font-bold mb-6 pt-8 pb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Sing your heart out in our Karaoke room
            </h2>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Step through the looking glass into our enchanting Alice in
              Wonderland-themed karaoke room! Perfect for parties, celebrations,
              or just a magical night out. Equipped with 4 high-quality
              microphones and a massive library of songs—sing your heart out in
              a whimsical wonderland setting.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-gray-300">1hr plus bookings</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                <span className="text-gray-300">Words on big screen</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <span className="text-gray-300">4 Wireless microphones</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300">Food packages</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-gray-300">
                  Birthdays, hens, bucks or for fun
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span className="text-gray-300">
                  Private only for your group
                </span>
              </div>
            </div>

            <Link
              to="/karaoke-booking"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-lg text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl neon-glow-pink"
            >
              🎤 BOOK KARAOKE ROOM
            </Link>
          </div>

          <div className="order-2 lg:order-1 grid grid-cols-2 gap-4">
            <img
              src="https://8bitbar.com.au/wp-content/uploads/2025/05/0b42d0ef-96db-40f0-abf4-51edbb96ac42-e1748892865932.jpeg"
              alt="Alice in Wonderland Karaoke Room"
              className="w-full h-48 object-cover rounded-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/600x400/1a202c/ed64a6?text=Karaoke+Room";
              }}
            />
            <img
              src="https://8bitbar.com.au/wp-content/uploads/2025/05/eab1029c-b6c9-430c-b0e2-0e80fff6aa21.jpeg"
              alt="Karaoke Room Interior"
              className="w-full h-48 object-cover rounded-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/600x400/1a202c/ed64a6?text=Karaoke+Interior";
              }}
            />
            <img
              src="https://8bitbar.com.au/wp-content/uploads/2025/05/0b42d0ef-96db-40f0-abf4-51edbb96ac42-1536x865.jpeg"
              alt="Karaoke Room Setup"
              className="w-full h-48 object-cover rounded-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/600x400/1a202c/ed64a6?text=Karaoke+Setup";
              }}
            />
            <img
              src="https://8bitbar.com.au/wp-content/uploads/2025/05/275bbbcf-cb28-4acf-b4b2-2fede476aeca.jpeg"
              alt="Karaoke Room Atmosphere"
              className="w-full h-48 object-cover rounded-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/600x400/1a202c/ed64a6?text=Karaoke+Atmosphere";
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default KaraokeSection;
