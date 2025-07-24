import React, { useEffect, useState } from "react";
import { Gamepad2, Star, Users } from "lucide-react";
import axios from "../../utils/axios";

/**
 * BoothInfo Component
 * Displays all static information about the N64 booths, including
 * features, pricing, and images.
 */
const BoothInfo = () => {
  const [booth, setBooth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBooth() {
      try {
        setLoading(true);
        const res = await axios.get("/n64-rooms");
        if (res.data && res.data.booths && res.data.booths.length > 0) {
          setBooth(res.data.booths[0]);
        } else {
          setError("No booth info available.");
        }
      } catch (err) {
        setError("Failed to load booth info.");
      } finally {
        setLoading(false);
      }
    }
    fetchBooth();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500"></div>
      </div>
    );
  }
  if (error) {
    return <div className="text-center text-red-400 py-8">{error}</div>;
  }
  if (!booth) return null;

  return (
    <div className="space-y-8">
      {/* Main Image */}
      <div className="bg-black/50 border border-pink-500/30 rounded-lg overflow-hidden">
        <img
          src={
            booth.imageUrl ||
            "https://placehold.co/600x400/1a202c/9f7aea?text=N64+Booth"
          }
          alt={booth.name}
          className="w-full h-64 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/600x400/1a202c/9f7aea?text=N64+Booth";
          }}
        />
        <div className="p-6">
          <h2 className="font-['Orbitron'] text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            {booth.name}
          </h2>
          <p className="text-gray-300 mb-4">{booth.description}</p>
        </div>
      </div>

      {/* Includes Section */}
      <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
        <h3 className="font-['Orbitron'] text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
          ✨ What's Included
        </h3>
        <div className="space-y-4">
          {booth.inclusions?.features?.map((feature, idx) => (
            <div className="flex items-center space-x-3" key={idx}>
              {idx === 0 && <Gamepad2 className="h-5 w-5 text-pink-400" />}
              {idx === 1 && <Star className="h-5 w-5 text-cyan-400" />}
              {idx === 2 && <Users className="h-5 w-5 text-yellow-400" />}
              {idx > 2 && <Star className="h-5 w-5 text-cyan-400" />}
              <span className="text-gray-300">{feature}</span>
            </div>
          ))}
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
            <span className="text-2xl font-bold text-green-400">
              ${booth.pricePerHour}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoothInfo;
