import React, { useState, useEffect } from "react";
import api from "../../utils/axios";
import {
  MdMusicNote,
  MdVideogameAsset,
  MdMeetingRoom,
  MdSportsEsports,
  MdLocalCafe,
  MdAttachMoney,
  MdPeople,
  MdAdminPanelSettings,
} from "react-icons/md";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalKaraokeBookings: 0,
    totalN64Bookings: 0,
    totalKaraokeRooms: 0,
    totalN64Rooms: 0,
    totalCafeBookings: 0,
    karaokeRevenue: 0,
    n64Revenue: 0,
    cafeRevenue: 0,
    totalUsers: 0,
    totalAdmins: 0,
    totalAccounts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch counts and revenue for all booking types
      const [
        karaokeBookings,
        n64Bookings,
        karaokeRooms,
        n64Rooms,
        cafeBookings,
        karaokeRevenue,
        n64Revenue,
        cafeRevenue,
        userStats,
      ] = await Promise.all([
        api.get("/admin/karaoke/karaoke-bookings/count"),
        api.get("/admin/n64/n64-bookings/count"),
        api.get("/admin/karaoke/karaoke-rooms/count"),
        api.get("/admin/n64/n64-rooms/count"),
        api.get("/admin/cafe/cafe-bookings/count"),
        api.get("/admin/karaoke/karaoke-bookings/revenue"),
        api.get("/admin/n64/n64-bookings/revenue"),
        api.get("/admin/cafe/cafe-bookings/revenue"),
        api.get("/admin/users/stats"),
      ]);

      setStats({
        totalKaraokeBookings: karaokeBookings.data.count || 0,
        totalN64Bookings: n64Bookings.data.count || 0,
        totalKaraokeRooms: karaokeRooms.data.count || 0,
        totalN64Rooms: n64Rooms.data.count || 0,
        totalCafeBookings: cafeBookings.data.count || 0,
        karaokeRevenue: karaokeRevenue.data.revenue || 0,
        n64Revenue: n64Revenue.data.revenue || 0,
        cafeRevenue: cafeRevenue.data.revenue || 0,
        totalUsers: userStats.data.totalUsers || 0,
        totalAdmins: userStats.data.totalAdmins || 0,
        totalAccounts: userStats.data.totalAccounts || 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, isRevenue = false }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-xs font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {isRevenue ? `$${value.toFixed(2)}` : value}
          </p>
        </div>
        <div className="text-3xl text-gray-400">{icon}</div>
      </div>
    </div>
  );

  const totalRevenue =
    stats.karaokeRevenue + stats.n64Revenue + stats.cafeRevenue;

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

      {/* Revenue Summary */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Revenue Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={totalRevenue}
            icon={<MdAttachMoney size={28} />}
            color="border-green-500"
            isRevenue={true}
          />
          <StatCard
            title="Karaoke Revenue"
            value={stats.karaokeRevenue}
            icon={<MdMusicNote size={28} />}
            color="border-blue-500"
            isRevenue={true}
          />
          <StatCard
            title="N64 Revenue"
            value={stats.n64Revenue}
            icon={<MdVideogameAsset size={28} />}
            color="border-green-500"
            isRevenue={true}
          />
          <StatCard
            title="Cafe Revenue"
            value={stats.cafeRevenue}
            icon={<MdLocalCafe size={28} />}
            color="border-yellow-500"
            isRevenue={true}
          />
        </div>
      </div>

      {/* Booking Counts */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Booking Counts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
            title="Cafe Bookings"
            value={stats.totalCafeBookings}
            icon={<MdLocalCafe size={28} />}
            color="border-yellow-500"
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
      </div>

      {/* User Statistics */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          User Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<MdPeople size={28} />}
            color="border-blue-500"
          />
          <StatCard
            title="Total Admins"
            value={stats.totalAdmins}
            icon={<MdAdminPanelSettings size={28} />}
            color="border-purple-500"
          />
          <StatCard
            title="Total Accounts"
            value={stats.totalAccounts}
            icon={<MdPeople size={28} />}
            color="border-green-500"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
