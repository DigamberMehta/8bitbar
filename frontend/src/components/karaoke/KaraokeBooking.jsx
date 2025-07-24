import React, { useEffect, useState } from "react";
import RoomInfo from "./RoomInfo";
import BookingForm from "./BookingForm";
import axios from "../../utils/axios";

/**
 * KaraokeBooking Component
 * * This component sets up the main layout for the karaoke booking page.
 * It arranges the RoomInfo and BookingForm components in a responsive grid.
 * Now fetches room data and passes it to children.
 */
const KaraokeBooking = () => {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await axios.get("/karaoke-rooms");
        const data = res.data;
        if (data.success && data.rooms.length > 0) {
          setRoom(data.rooms[0]);
        } else {
          setError("No karaoke room data found.");
        }
      } catch (err) {
        setError("Failed to fetch room info.");
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, []);

  if (loading)
    return <div className="text-center py-12">Loading room info...</div>;
  if (error)
    return <div className="text-center text-red-400 py-12">{error}</div>;
  if (!room) return null;

  return (
    <div className="min-h-screen bg-gray-900 py-12 text-white">
      <div className="w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-['Orbitron'] text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400">
            🎤 KARAOKE ROOM BOOKING
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Welcome to Wonderland! Book your unforgettable karaoke experience in
            our Alice in Wonderland-themed room.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-12">
          <RoomInfo room={room} />
          <BookingForm room={room} />
        </div>
      </div>
    </div>
  );
};

export default KaraokeBooking;
