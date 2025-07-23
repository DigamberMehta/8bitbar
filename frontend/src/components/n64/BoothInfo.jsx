import React from "react";
import { Gamepad2, Star, Users } from "lucide-react";

/**
 * BoothInfo Component
 * Displays all static information about the N64 booths, including
 * features, pricing, and images.
 */
const BoothInfo = () => {
  return (
    <div className="space-y-8">
      {/* Main Image */}
      <div className="bg-black/50 border border-pink-500/30 rounded-lg overflow-hidden">
        <img
          src="https://8bitbar.com.au/wp-content/uploads/2025/03/20250419_212301-scaled.jpg"
          alt="N64 Gaming Booth"
          className="w-full h-64 object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/1a202c/9f7aea?text=N64+Booth'; }}
        />
        <div className="p-6">
          <h2 className="font-['Orbitron'] text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            N64 Gaming Booths
          </h2>
          <p className="text-gray-300 mb-4">
            Experience the golden age of gaming with our premium N64 booths.
            Each booth comes with classic games and comfortable seating for up
            to 4 people.
          </p>
        </div>
      </div>

      {/* Includes Section */}
      <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
        <h3 className="font-['Orbitron'] text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
          ✨ What's Included
        </h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Gamepad2 className="h-5 w-5 text-pink-400" />
            <span className="text-gray-300">
              Original N64 console with authentic controllers
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Star className="h-5 w-5 text-cyan-400" />
            <span className="text-gray-300">
              Selection of classic N64 games (Mario Kart, GoldenEye, etc.)
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Users className="h-5 w-5 text-yellow-400" />
            <span className="text-gray-300">
              Comfortable seating for up to 4 players
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-black/50 border border-purple-500/30 rounded-lg p-6">
        <h3 className="font-['Orbitron'] text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          🕒 Booking Options
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg">
            <div>
              <span className="text-white font-semibold">1 Hour Session</span>
              <p className="text-gray-400 text-sm">
                Perfect for a retro gaming throwback
              </p>
            </div>
            <span className="text-2xl font-bold text-green-400">$20</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoothInfo;
