import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdMusicNote,
  MdVideogameAsset,
  MdMeetingRoom,
  MdSportsEsports,
  MdMenu,
  MdClose,
  MdRestaurant,
  MdLocalCafe,
} from "react-icons/md";

const AdminLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: <MdDashboard size={20} />,
    },
    {
      path: "/admin/karaoke-bookings",
      label: "Karaoke Bookings",
      icon: <MdMusicNote size={20} />,
    },
    {
      path: "/admin/n64-bookings",
      label: "N64 Bookings",
      icon: <MdVideogameAsset size={20} />,
    },
    {
      path: "/admin/cafe-bookings",
      label: "Cafe Bookings",
      icon: <MdLocalCafe size={20} />,
    },
    {
      path: "/admin/cafe-settings",
      label: "Cafe Settings",
      icon: <MdLocalCafe size={20} />,
    },
    {
      path: "/admin/karaoke-rooms",
      label: "Karaoke Rooms",
      icon: <MdMeetingRoom size={20} />,
    },
    {
      path: "/admin/n64-rooms",
      label: "N64 Rooms",
      icon: <MdSportsEsports size={20} />,
    },
    {
      path: "/admin/cafe-layout",
      label: "Cafe Layout",
      icon: <MdRestaurant size={20} />,
    },
  ];

  // Overlay for mobile sidebar
  const SidebarOverlay = ({ open, onClose }) =>
    open ? (
      <div
        className="fixed inset-0 z-30 bg-black bg-opacity-40 md:hidden"
        onClick={onClose}
        aria-label="Close sidebar overlay"
      />
    ) : null;

  // Header height offset (top-16 = 64px)
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Hamburger for mobile */}
        <button
          className="md:hidden fixed top-20 left-4 z-50 bg-gray-800 text-white p-2 rounded-lg shadow-lg focus:outline-none"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
          style={{ top: "72px" }} // visually a bit below header
        >
          <MdMenu size={28} />
        </button>
        {/* Sidebar overlay for mobile */}
        <SidebarOverlay
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        {/* Overlay offset for header */}
        <style>{`
          .fixed.inset-0.z-30.bg-black.bg-opacity-40.md\:hidden {
            top: 64px !important;
          }
        `}</style>
        {/* Sidebar */}
        <div
          className={`fixed left-0 z-40 md:static md:inset-auto md:z-auto transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          } w-64 bg-gray-800 text-white min-h-screen md:relative md:block top-16 md:top-0`}
          style={{ minHeight: "100vh" }}
        >
          {/* Close button for mobile */}
          <div className="md:hidden flex justify-end p-2">
            <button
              className="text-white p-2 focus:outline-none"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <MdClose size={28} />
            </button>
          </div>
          <div className="p-4 pt-0 md:pt-4">
            <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
            <nav>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                        location.pathname === item.path
                          ? "bg-blue-600 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="text-gray-400">{item.icon}</span>
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
