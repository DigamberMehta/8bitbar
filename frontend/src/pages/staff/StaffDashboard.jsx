import React, { useState, useEffect } from "react";
import {
  MdLogout,
  MdEvent,
  MdList,
  MdAdd,
  MdCalendarMonth,
} from "react-icons/md";
import AllBookings from "./AllBookings";
import ManualBooking from "./ManualBooking";
import CalendarView from "./CalendarView";

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState("all-bookings");
  const [staffUser, setStaffUser] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // "list" or "calendar"

  useEffect(() => {
    // Check if staff is logged in
    const token = localStorage.getItem("staffToken");
    const user = localStorage.getItem("staffUser");

    if (!token || !user) {
      // Redirect to staff login if not authenticated
      window.location.href = "/staff-login";
      return;
    }

    try {
      setStaffUser(JSON.parse(user));
    } catch (error) {
      console.error("Error parsing staff user:", error);
      localStorage.removeItem("staffToken");
      localStorage.removeItem("staffUser");
      window.location.href = "/staff-login";
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("staffToken");
    localStorage.removeItem("staffUser");
    window.location.href = "/staff-login";
  };

  if (!staffUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Tabs */}
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab("all-bookings")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "all-bookings"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <MdEvent size={20} />
                <span>All Bookings</span>
              </button>

              <button
                onClick={() => setActiveTab("manual-booking")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "manual-booking"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <MdAdd size={20} />
                <span>Manual Booking</span>
              </button>
            </div>

            {/* Right side - User info and logout */}
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                <span className="font-medium">{staffUser.name}</span>
                <span className="text-gray-500 ml-2">({staffUser.role})</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MdLogout size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Mode Toggle for All Bookings */}
      {activeTab === "all-bookings" && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-2 py-3">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === "list"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <MdList size={18} />
                <span>List View</span>
              </button>

              <button
                onClick={() => setViewMode("calendar")}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === "calendar"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <MdCalendarMonth size={18} />
                <span>Calendar View</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "all-bookings" && (
          <div>{viewMode === "list" ? <AllBookings /> : <CalendarView />}</div>
        )}

        {activeTab === "manual-booking" && <ManualBooking />}
      </div>
    </div>
  );
};

export default StaffDashboard;
