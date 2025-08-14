import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Music,
  Gamepad2,
  Building2,
  Trophy,
  Menu,
  X,
  UtensilsCrossed,
  Coffee,
  Users,
  Plus,
  DollarSign,
  Calendar,
  Lock,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const AdminLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem("adminSidebarCollapsed");
    return saved ? JSON.parse(saved) : false;
  });
  const { user } = useAuth();

  // Save sidebar state to localStorage
  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem("adminSidebarCollapsed", JSON.stringify(newState));
  };

  // Define all available navigation items
  const allNavItems = [
    // Dashboard
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={22} />,
      roles: ["superadmin"],
    },

    // Finance Section
    {
      path: "/admin/finance",
      label: "Finance",
      icon: <DollarSign size={22} />,
      roles: ["superadmin"],
    },

    // All Bookings
    {
      path: "/admin/all-bookings",
      label: "All Bookings",
      icon: <Calendar size={22} />,
      roles: ["admin", "superadmin"],
    },

    // Manual Booking
    {
      path: "/admin/manual-booking",
      label: "Manual Booking",
      icon: <Plus size={22} />,
      roles: ["admin", "superadmin"],
    },

    // Karaoke Section
    {
      path: "/admin/karaoke-bookings",
      label: "Karaoke Bookings",
      icon: <Music size={22} />,
      roles: ["admin", "superadmin"],
    },
    {
      path: "/admin/karaoke/karaoke-rooms",
      label: "Karaoke Rooms",
      icon: <Building2 size={22} />,
      roles: ["superadmin"],
    },

    // N64 Section
    {
      path: "/admin/n64-bookings",
      label: "N64 Bookings",
      icon: <Gamepad2 size={22} />,
      roles: ["admin", "superadmin"],
    },
    {
      path: "/admin/n64-rooms",
      label: "N64 Rooms",
      icon: <Trophy size={22} />,
      roles: ["superadmin"],
    },

    // Cafe Section
    {
      path: "/admin/cafe-bookings",
      label: "Cafe Bookings",
      icon: <Coffee size={22} />,
      roles: ["admin", "superadmin"],
    },
    {
      path: "/admin/cafe-layout",
      label: "Cafe Layout",
      icon: <UtensilsCrossed size={22} />,
      roles: ["superadmin"],
    },
    {
      path: "/admin/cafe-settings",
      label: "Cafe Settings",
      icon: <Coffee size={22} />,
      roles: ["superadmin"],
    },

    // User Management
    {
      path: "/admin/users",
      label: "Users",
      icon: <Users size={22} />,
      roles: ["superadmin"],
    },

    // PIN Management
    {
      path: "/admin/pin-management",
      label: "PIN Management",
      icon: <Lock size={22} />,
      roles: ["superadmin"],
    },
  ];

  // Filter navigation items based on user role
  const navItems = allNavItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  // Debug logging to verify role-based filtering
  console.log("User role:", user?.role);
  console.log(
    "Available nav items:",
    navItems.map((item) => ({ label: item.label, roles: item.roles }))
  );

  // Overlay for screens < 1200px
  const SidebarOverlay = ({ open, onClose }) =>
    open ? (
      <div
        className="fixed inset-0 z-30 bg-black bg-opacity-40 xl:hidden"
        onClick={onClose}
        aria-label="Close sidebar overlay"
      />
    ) : null;

  // Header height offset (top-16 = 64px)
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Hamburger for screens < 1200px */}
        <button
          className="xl:hidden fixed top-20 left-4 z-50 bg-gray-800 text-white p-1 rounded-lg shadow-lg focus:outline-none"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
          style={{ top: "72px" }} // visually a bit below header
        >
          {/* Larger icon on mobile, smaller on iPad/Desktop */}
          <span className="block md:hidden">
            <Menu size={28} />
          </span>
          <span className="hidden md:block">
            <Menu size={22} />
          </span>
        </button>
        {/* Sidebar overlay for mobile */}
        <SidebarOverlay
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        {/* Overlay offset for header */}
        <style>{`
          .fixed.inset-0.z-30.bg-black.bg-opacity-40.xl\:hidden {
            top: 64px !important;
          }
        `}</style>
        {/* Sidebar */}
        <div
          className={`fixed left-0 z-40 xl:static xl:inset-auto xl:z-auto transition-all duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full xl:translate-x-0"
          } ${
            sidebarCollapsed ? "w-16" : "w-64"
          } bg-gray-800 text-white min-h-screen xl:relative xl:block top-16 xl:top-0`}
          style={{ minHeight: "100vh" }}
        >
          {/* Header with collapse toggle and close button */}
          <div className="flex items-center justify-between p-4 md:p-3 border-b border-gray-700">
            {/* Title - hidden when collapsed */}
            {!sidebarCollapsed && (
              <h2 className="text-xl md:text-lg font-bold text-white">
                Admin Panel
              </h2>
            )}

            {/* Collapse toggle button - only visible on xl+ screens */}
            <button
              className="hidden xl:block text-gray-400 hover:text-white transition-colors"
              onClick={toggleSidebar}
              aria-label={
                sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
              }
            >
              {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
            </button>

            {/* Close button for mobile */}
            <button
              className="xl:hidden text-gray-400 hover:text-white transition-colors"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-4 md:p-3 pt-3">
            <nav>
              <ul className="space-y-2 md:space-y-2">
                {navItems.map((item) => (
                  <li key={item.path} className="relative">
                    <Link
                      to={item.path}
                      className={`group flex items-center ${
                        sidebarCollapsed
                          ? "justify-center"
                          : "space-x-3 md:space-x-3"
                      } p-3 md:p-3 rounded-lg transition-colors ${
                        location.pathname === item.path
                          ? "bg-blue-600 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      {/* Tooltip for collapsed state */}
                      {sidebarCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                          {item.label}
                        </div>
                      )}
                      <span className="text-gray-400">{item.icon}</span>
                      {!sidebarCollapsed && (
                        <span className="text-base md:text-sm font-medium">
                          {item.label}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
        {/* Main Content */}
        <div
          className={`flex-1 transition-all duration-300 ${
            sidebarCollapsed ? "xl:ml-0" : ""
          }`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
