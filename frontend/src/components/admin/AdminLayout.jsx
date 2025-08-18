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
  MdPeople,
  MdAdd,
  MdAttachMoney,
  MdEvent,
  MdLock,
  MdCardGiftcard,
  MdShoppingCart,
  MdExpandMore,
  MdExpandLess,
  MdBookOnline,
  MdSettings,
  MdAdminPanelSettings,
} from "react-icons/md";
import { useAuth } from "../../contexts/AuthContext";

const AdminLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem("adminSidebarCollapsed");
    return saved ? JSON.parse(saved) : false;
  });
  const [collapsedSections, setCollapsedSections] = useState(() => {
    const saved = localStorage.getItem("adminCollapsedSections");
    return saved
      ? JSON.parse(saved)
      : {
          bookings: false,
          karaoke: false,
          n64: false,
          cafe: false,
          management: false,
          giftcards: false,
        };
  });
  const { user } = useAuth();

  // Save sidebar state to localStorage
  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem("adminSidebarCollapsed", JSON.stringify(newState));
  };

  // Toggle section collapse
  const toggleSection = (section) => {
    const newCollapsedSections = {
      ...collapsedSections,
      [section]: !collapsedSections[section],
    };
    setCollapsedSections(newCollapsedSections);
    localStorage.setItem(
      "adminCollapsedSections",
      JSON.stringify(newCollapsedSections)
    );
  };

  // Define all available navigation items with sections
  const allNavItems = [
    // Dashboard
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: <MdDashboard size={20} />,
      roles: ["superadmin"],
      section: "main",
    },

    // Finance Section
    {
      path: "/admin/finance",
      label: "Finance",
      icon: <MdAttachMoney size={20} />,
      roles: ["superadmin"],
      section: "main",
    },

    // All Bookings
    {
      path: "/admin/all-bookings",
      label: "All Bookings",
      icon: <MdEvent size={20} />,
      roles: ["admin", "superadmin"],
      section: "bookings",
    },

    // Manual Booking
    {
      path: "/admin/manual-booking",
      label: "Manual Booking",
      icon: <MdAdd size={20} />,
      roles: ["admin", "superadmin"],
      section: "bookings",
    },

    // Karaoke Section
    {
      path: "/admin/karaoke-bookings",
      label: "Karaoke Bookings",
      icon: <MdMusicNote size={20} />,
      roles: ["admin", "superadmin"],
      section: "karaoke",
    },
    {
      path: "/admin/karaoke/karaoke-rooms",
      label: "Karaoke Rooms",
      icon: <MdMeetingRoom size={20} />,
      roles: ["superadmin"],
      section: "karaoke",
    },

    // N64 Section
    {
      path: "/admin/n64-bookings",
      label: "N64 Bookings",
      icon: <MdVideogameAsset size={20} />,
      roles: ["admin", "superadmin"],
      section: "n64",
    },
    {
      path: "/admin/n64-rooms",
      label: "N64 Rooms",
      icon: <MdSportsEsports size={20} />,
      roles: ["superadmin"],
      section: "n64",
    },

    // Cafe Section
    {
      path: "/admin/cafe-bookings",
      label: "Cafe Bookings",
      icon: <MdLocalCafe size={20} />,
      roles: ["admin", "superadmin"],
      section: "cafe",
    },
    {
      path: "/admin/cafe-layout",
      label: "Cafe Layout",
      icon: <MdRestaurant size={20} />,
      roles: ["superadmin"],
      section: "cafe",
    },
    {
      path: "/admin/cafe-settings",
      label: "Cafe Settings",
      icon: <MdLocalCafe size={20} />,
      roles: ["superadmin"],
      section: "cafe",
    },

    // User Management
    {
      path: "/admin/users",
      label: "Users",
      icon: <MdPeople size={20} />,
      roles: ["superadmin"],
      section: "management",
    },

    // PIN Management
    {
      path: "/admin/pin-management",
      label: "PIN Management",
      icon: <MdLock size={20} />,
      roles: ["superadmin"],
      section: "management",
    },

    // Gift Card Management
    {
      path: "/admin/gift-cards",
      label: "Gift Cards",
      icon: <MdCardGiftcard size={20} />,
      roles: ["superadmin"],
      section: "giftcards",
    },
    {
      path: "/admin/purchased-gift-cards",
      label: "Purchased Gift Cards",
      icon: <MdShoppingCart size={20} />,
      roles: ["superadmin"],
      section: "giftcards",
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
          className="xl:hidden fixed top-20 left-4 z-50 bg-gray-800 text-white p-2 rounded-lg shadow-lg focus:outline-none"
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
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            {/* Title - hidden when collapsed */}
            {!sidebarCollapsed && (
              <h2 className="text-xl font-bold text-white">Admin Panel</h2>
            )}

            {/* Collapse toggle button - only visible on xl+ screens */}
            <button
              className="hidden xl:block text-gray-400 hover:text-white transition-colors"
              onClick={toggleSidebar}
              aria-label={
                sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
              }
            >
              {sidebarCollapsed ? <MdMenu size={20} /> : <MdClose size={20} />}
            </button>

            {/* Close button for mobile */}
            <button
              className="xl:hidden text-gray-400 hover:text-white transition-colors"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <MdClose size={20} />
            </button>
          </div>

          <div className="p-4 pt-2">
            <nav>
              <ul className="space-y-2">
                {/* Main Section */}
                {navItems
                  .filter((item) => item.section === "main")
                  .map((item) => (
                    <li key={item.path} className="relative">
                      <Link
                        to={item.path}
                        className={`group flex items-center ${
                          sidebarCollapsed ? "justify-center" : "space-x-3"
                        } p-3 rounded-lg transition-colors ${
                          location.pathname === item.path
                            ? "bg-blue-600 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white"
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        {sidebarCollapsed && (
                          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                            {item.label}
                          </div>
                        )}
                        <span className="text-gray-400">{item.icon}</span>
                        {!sidebarCollapsed && (
                          <span className="text-sm">{item.label}</span>
                        )}
                      </Link>
                    </li>
                  ))}

                {/* Divider */}
                {!sidebarCollapsed && (
                  <li className="my-4">
                    <div className="border-t border-gray-600"></div>
                  </li>
                )}

                {/* Bookings Section */}
                {navItems.filter((item) => item.section === "bookings").length >
                  0 && (
                  <li>
                    <button
                      onClick={() => toggleSection("bookings")}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors text-gray-300 hover:bg-gray-700 hover:text-white bg-gray-700/30 ${
                        sidebarCollapsed ? "justify-center" : ""
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <MdBookOnline size={20} className="text-gray-400" />
                        {!sidebarCollapsed && (
                          <span className="text-sm font-medium">Bookings</span>
                        )}
                      </div>
                      {!sidebarCollapsed &&
                        (collapsedSections.bookings ? (
                          <MdExpandMore size={16} />
                        ) : (
                          <MdExpandLess size={16} />
                        ))}
                    </button>
                    {!collapsedSections.bookings && (
                      <ul className="ml-4 mt-2 space-y-1 border-l border-gray-600 pl-2">
                        {navItems
                          .filter((item) => item.section === "bookings")
                          .map((item) => (
                            <li key={item.path} className="relative">
                              <Link
                                to={item.path}
                                className={`group flex items-center space-x-3 p-2 rounded-lg transition-colors text-sm ${
                                  location.pathname === item.path
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-400 hover:bg-gray-700 hover:text-white"
                                }`}
                                onClick={() => setSidebarOpen(false)}
                              >
                                <span className="text-gray-400">
                                  {item.icon}
                                </span>
                                <span>{item.label}</span>
                              </Link>
                            </li>
                          ))}
                      </ul>
                    )}
                  </li>
                )}

                {/* Karaoke Section */}
                {navItems.filter((item) => item.section === "karaoke").length >
                  0 && (
                  <li>
                    <button
                      onClick={() => toggleSection("karaoke")}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors text-gray-300 hover:bg-gray-700 hover:text-white bg-gray-700/30 ${
                        sidebarCollapsed ? "justify-center" : ""
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <MdMusicNote size={20} className="text-gray-400" />
                        {!sidebarCollapsed && (
                          <span className="text-sm font-medium">Karaoke</span>
                        )}
                      </div>
                      {!sidebarCollapsed &&
                        (collapsedSections.karaoke ? (
                          <MdExpandMore size={16} />
                        ) : (
                          <MdExpandLess size={16} />
                        ))}
                    </button>
                    {!collapsedSections.karaoke && (
                      <ul className="ml-4 mt-2 space-y-1 border-l border-gray-600 pl-2">
                        {navItems
                          .filter((item) => item.section === "karaoke")
                          .map((item) => (
                            <li key={item.path} className="relative">
                              <Link
                                to={item.path}
                                className={`group flex items-center space-x-3 p-2 rounded-lg transition-colors text-sm ${
                                  location.pathname === item.path
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-400 hover:bg-gray-700 hover:text-white"
                                }`}
                                onClick={() => setSidebarOpen(false)}
                              >
                                <span className="text-gray-400">
                                  {item.icon}
                                </span>
                                <span>{item.label}</span>
                              </Link>
                            </li>
                          ))}
                      </ul>
                    )}
                  </li>
                )}

                {/* N64 Section */}
                {navItems.filter((item) => item.section === "n64").length >
                  0 && (
                  <li>
                    <button
                      onClick={() => toggleSection("n64")}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors text-gray-300 hover:bg-gray-700 hover:text-white bg-gray-700/30 ${
                        sidebarCollapsed ? "justify-center" : ""
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <MdVideogameAsset size={20} className="text-gray-400" />
                        {!sidebarCollapsed && (
                          <span className="text-sm font-medium">
                            N64 Gaming
                          </span>
                        )}
                      </div>
                      {!sidebarCollapsed &&
                        (collapsedSections.n64 ? (
                          <MdExpandMore size={16} />
                        ) : (
                          <MdExpandLess size={16} />
                        ))}
                    </button>
                    {!collapsedSections.n64 && (
                      <ul className="ml-4 mt-2 space-y-1 border-l border-gray-600 pl-2">
                        {navItems
                          .filter((item) => item.section === "n64")
                          .map((item) => (
                            <li key={item.path} className="relative">
                              <Link
                                to={item.path}
                                className={`group flex items-center space-x-3 p-2 rounded-lg transition-colors text-sm ${
                                  location.pathname === item.path
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-400 hover:bg-gray-700 hover:text-white"
                                }`}
                                onClick={() => setSidebarOpen(false)}
                              >
                                <span className="text-gray-400">
                                  {item.icon}
                                </span>
                                <span>{item.label}</span>
                              </Link>
                            </li>
                          ))}
                      </ul>
                    )}
                  </li>
                )}

                {/* Cafe Section */}
                {navItems.filter((item) => item.section === "cafe").length >
                  0 && (
                  <li>
                    <button
                      onClick={() => toggleSection("cafe")}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors text-gray-300 hover:bg-gray-700 hover:text-white bg-gray-700/30 ${
                        sidebarCollapsed ? "justify-center" : ""
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <MdLocalCafe size={20} className="text-gray-400" />
                        {!sidebarCollapsed && (
                          <span className="text-sm font-medium">Cafe</span>
                        )}
                      </div>
                      {!sidebarCollapsed &&
                        (collapsedSections.cafe ? (
                          <MdExpandMore size={16} />
                        ) : (
                          <MdExpandLess size={16} />
                        ))}
                    </button>
                    {!collapsedSections.cafe && (
                      <ul className="ml-4 mt-2 space-y-1 border-l border-gray-600 pl-2">
                        {navItems
                          .filter((item) => item.section === "cafe")
                          .map((item) => (
                            <li key={item.path} className="relative">
                              <Link
                                to={item.path}
                                className={`group flex items-center space-x-3 p-2 rounded-lg transition-colors text-sm ${
                                  location.pathname === item.path
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-400 hover:bg-gray-700 hover:text-white"
                                }`}
                                onClick={() => setSidebarOpen(false)}
                              >
                                <span className="text-gray-400">
                                  {item.icon}
                                </span>
                                <span>{item.label}</span>
                              </Link>
                            </li>
                          ))}
                      </ul>
                    )}
                  </li>
                )}

                {/* Management Section */}
                {navItems.filter((item) => item.section === "management")
                  .length > 0 && (
                  <li>
                    <button
                      onClick={() => toggleSection("management")}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors text-gray-300 hover:bg-gray-700 hover:text-white bg-gray-700/30 ${
                        sidebarCollapsed ? "justify-center" : ""
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <MdAdminPanelSettings
                          size={20}
                          className="text-gray-400"
                        />
                        {!sidebarCollapsed && (
                          <span className="text-sm font-medium">
                            Management
                          </span>
                        )}
                      </div>
                      {!sidebarCollapsed &&
                        (collapsedSections.management ? (
                          <MdExpandMore size={16} />
                        ) : (
                          <MdExpandLess size={16} />
                        ))}
                    </button>
                    {!collapsedSections.management && (
                      <ul className="ml-4 mt-2 space-y-1 border-l border-gray-600 pl-2">
                        {navItems
                          .filter((item) => item.section === "management")
                          .map((item) => (
                            <li key={item.path} className="relative">
                              <Link
                                to={item.path}
                                className={`group flex items-center space-x-3 p-2 rounded-lg transition-colors text-sm ${
                                  location.pathname === item.path
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-400 hover:bg-gray-700 hover:text-white"
                                }`}
                                onClick={() => setSidebarOpen(false)}
                              >
                                <span className="text-gray-400">
                                  {item.icon}
                                </span>
                                <span>{item.label}</span>
                              </Link>
                            </li>
                          ))}
                      </ul>
                    )}
                  </li>
                )}

                {/* Gift Cards Section */}
                {navItems.filter((item) => item.section === "giftcards")
                  .length > 0 && (
                  <li>
                    <button
                      onClick={() => toggleSection("giftcards")}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors text-gray-300 hover:bg-gray-700 hover:text-white bg-gray-700/30 ${
                        sidebarCollapsed ? "justify-center" : ""
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <MdCardGiftcard size={20} className="text-gray-400" />
                        {!sidebarCollapsed && (
                          <span className="text-sm font-medium">
                            Gift Cards
                          </span>
                        )}
                      </div>
                      {!sidebarCollapsed &&
                        (collapsedSections.giftcards ? (
                          <MdExpandMore size={16} />
                        ) : (
                          <MdExpandLess size={16} />
                        ))}
                    </button>
                    {!collapsedSections.giftcards && (
                      <ul className="ml-4 mt-2 space-y-1 border-l border-gray-600 pl-2">
                        {navItems
                          .filter((item) => item.section === "giftcards")
                          .map((item) => (
                            <li key={item.path} className="relative">
                              <Link
                                to={item.path}
                                className={`group flex items-center space-x-2 p-2 rounded-lg transition-colors text-sm ${
                                  location.pathname === item.path
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-400 hover:bg-gray-700 hover:text-white"
                                }`}
                                onClick={() => setSidebarOpen(false)}
                              >
                                <span className="text-gray-400">
                                  {item.icon}
                                </span>
                                <span>{item.label}</span>
                              </Link>
                            </li>
                          ))}
                      </ul>
                    )}
                  </li>
                )}
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
          <div className="min-h-screen bg-gray-50">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
