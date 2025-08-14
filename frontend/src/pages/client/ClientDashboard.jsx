import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios";
import AllBookingsList from "./components/AllBookingsList";
import CalendarView from "./components/CalendarView";
import ManualBooking from "./components/ManualBooking";
import { MdLogout, MdList, MdCalendarToday, MdAdd } from "react-icons/md";

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState("bookings");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call client logout endpoint
      await api.post("/client/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear client session data
      localStorage.removeItem("clientUser");
      localStorage.removeItem("clientToken");
      navigate("/staff/login");
    }
  };

  const tabs = [
    {
      id: "bookings",
      label: "All Bookings",
      icon: <MdList size={20} />,
      component: <AllBookingsList />,
    },
    {
      id: "calendar",
      label: "Calendar View",
      icon: <MdCalendarToday size={20} />,
      component: <CalendarView />,
    },
    {
      id: "manual",
      label: "Manual Booking",
      icon: <MdAdd size={20} />,
      component: <ManualBooking />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with tabs and logout */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold text-gray-900">
                Staff Dashboard
              </h1>

              {/* Tabs */}
              <nav className="flex space-x-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MdLogout size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {tabs.find((tab) => tab.id === activeTab)?.component}
      </div>
    </div>
  );
};

export default ClientDashboard;
