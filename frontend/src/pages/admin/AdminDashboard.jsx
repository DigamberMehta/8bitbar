import React, { useState, useEffect } from "react";
import api from "../../utils/axios";
import {
  MdMusicNote,
  MdVideogameAsset,
  MdMeetingRoom,
  MdSportsEsports,
} from "react-icons/md";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalKaraokeBookings: 0,
    totalN64Bookings: 0,
    totalKaraokeRooms: 0,
    totalN64Rooms: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // You'll need to create these endpoints in your backend
      const [karaokeBookings, n64Bookings, karaokeRooms, n64Rooms] =
        await Promise.all([
          api.get("/admin/karaoke-bookings/count"),
          api.get("/admin/n64-bookings/count"),
          api.get("/admin/karaoke-rooms/count"),
          api.get("/admin/n64-rooms/count"),
        ]);

      setStats({
        totalKaraokeBookings: karaokeBookings.data.count || 0,
        totalN64Bookings: n64Bookings.data.count || 0,
        totalKaraokeRooms: karaokeRooms.data.count || 0,
        totalN64Rooms: n64Rooms.data.count || 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-xs font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="text-3xl text-gray-400">{icon}</div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Karaoke Bookings"
          value={stats.totalKaraokeBookings}
          icon={<MdMusicNote size={28} />}
          color="border-blue-500"
        />
        <StatCard
          title="N64 Bookings"
          value={stats.totalN64Bookings}
          icon={<MdVideogameAsset size={28} />}
          color="border-green-500"
        />
        <StatCard
          title="Karaoke Rooms"
          value={stats.totalKaraokeRooms}
          icon={<MdMeetingRoom size={28} />}
          color="border-purple-500"
        />
        <StatCard
          title="N64 Rooms"
          value={stats.totalN64Rooms}
          icon={<MdSportsEsports size={28} />}
          color="border-orange-500"
        />
      </div>
      {/* Quick Actions removed for a cleaner, more professional dashboard */}
    </div>
  );
};

export default AdminDashboard;
