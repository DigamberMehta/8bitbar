import React, { useState, useEffect } from "react";
import {
  MdEvent,
  MdPerson,
  MdPhone,
  MdEmail,
  MdAccessTime,
  MdLocationOn,
} from "react-icons/md";
import api from "../../utils/axios";

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all, karaoke, n64, cafe
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const fetchAllBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/all-bookings");
      if (response.data.success) {
        setBookings(response.data.bookings);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "confirmed":
        return { color: "bg-green-100 text-green-800", text: "Paid" };
      case "pending":
        return { color: "bg-yellow-100 text-yellow-800", text: "Not Paid" };
      case "cancelled":
        return { color: "bg-red-100 text-red-800", text: "Cancelled" };
      case "completed":
        return { color: "bg-blue-100 text-blue-800", text: "Completed" };
      default:
        return { color: "bg-gray-100 text-gray-800", text: status };
    }
  };

  const getServiceIcon = (service) => {
    switch (service) {
      case "karaoke":
        return <MdEvent className="text-purple-500" size={20} />;
      case "n64":
        return <MdEvent className="text-blue-500" size={20} />;
      case "cafe":
        return <MdEvent className="text-green-500" size={20} />;
      default:
        return <MdEvent className="text-gray-500" size={20} />;
    }
  };

  const getServiceName = (service) => {
    switch (service) {
      case "karaoke":
        return "Karaoke";
      case "n64":
        return "N64 Gaming";
      case "cafe":
        return "Cafe";
      default:
        return service;
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesFilter = filter === "all" || booking.service === filter;
    const matchesSearch =
      searchTerm === "" ||
      booking.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.staffName &&
        booking.staffName.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={fetchAllBookings}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Bookings</h1>
          <p className="text-gray-600 mt-1">
            Manage and view all customer and manual bookings
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={fetchAllBookings}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Service Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Service
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Services</option>
              <option value="karaoke">Karaoke</option>
              <option value="n64">N64 Gaming</option>
              <option value="cafe">Cafe</option>
            </select>
          </div>

          {/* Search */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by customer name, email, or staff name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-2">No bookings found</div>
            <div className="text-sm text-gray-400">
              {filter !== "all"
                ? `No ${getServiceName(filter)} bookings`
                : "No bookings match your search criteria"}
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Service and Status */}
                    <div className="flex items-center space-x-3 mb-3">
                      {getServiceIcon(booking.service)}
                      <span className="text-lg font-semibold text-gray-900">
                        {getServiceName(booking.service)} Booking
                      </span>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          getStatusInfo(booking.status).color
                        }`}
                      >
                        {getStatusInfo(booking.status).text}
                      </span>
                    </div>

                    {/* Customer Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <MdPerson className="text-gray-400" size={18} />
                        <span className="text-sm text-gray-600">
                          <span className="font-medium">Customer:</span>{" "}
                          {booking.customerName || "N/A"}
                        </span>
                      </div>

                      {booking.customerEmail && (
                        <div className="flex items-center space-x-2">
                          <MdEmail className="text-gray-400" size={18} />
                          <span className="text-sm text-gray-600">
                            <span className="font-medium">Email:</span>{" "}
                            {booking.customerEmail}
                          </span>
                        </div>
                      )}

                      {booking.customerPhone && (
                        <div className="flex items-center space-x-2">
                          <MdPhone className="text-gray-400" size={18} />
                          <span className="text-sm text-gray-600">
                            <span className="font-medium">Phone:</span>{" "}
                            {booking.customerPhone}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Booking Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      {booking.startDateTime && (
                        <div className="flex items-center space-x-2">
                          <MdAccessTime className="text-gray-400" size={18} />
                          <span className="text-sm text-gray-600">
                            <span className="font-medium">Date & Time:</span>{" "}
                            {new Date(booking.startDateTime).toLocaleString()}
                          </span>
                        </div>
                      )}

                      {booking.date && booking.time && (
                        <div className="flex items-center space-x-2">
                          <MdAccessTime className="text-gray-400" size={18} />
                          <span className="text-sm text-gray-600">
                            <span className="font-medium">Date:</span>{" "}
                            {new Date(booking.date).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                      {booking.durationHours && (
                        <div className="flex items-center space-x-2">
                          <MdAccessTime className="text-gray-400" size={18} />
                          <span className="text-sm text-gray-600">
                            <span className="font-medium">Duration:</span>{" "}
                            {booking.durationHours} hour(s)
                          </span>
                        </div>
                      )}

                      {booking.duration && (
                        <div className="flex items-center space-x-2">
                          <MdAccessTime className="text-gray-400" size={18} />
                          <span className="text-sm text-gray-600">
                            <span className="font-medium">Duration:</span>{" "}
                            {booking.duration} hour(s)
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Staff Information (for manual bookings) */}
                    {booking.isManualBooking && booking.staffName && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-2">
                          <MdPerson className="text-blue-500" size={18} />
                          <span className="text-sm text-blue-700">
                            <span className="font-medium">Staff:</span>{" "}
                            {booking.staffName} (PIN: {booking.staffPin})
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Additional Details */}
                    {booking.specialRequests && (
                      <div className="mt-3">
                        <span className="text-sm text-gray-600">
                          <span className="font-medium">Special Requests:</span>{" "}
                          {booking.specialRequests}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Booking ID */}
                  <div className="text-right">
                    <div className="text-xs text-gray-500 mb-1">Booking ID</div>
                    <div className="text-sm font-mono text-gray-700">
                      {booking._id.slice(-8)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="text-sm text-gray-600">
          Total Bookings:{" "}
          <span className="font-medium">{filteredBookings.length}</span>
          {filter !== "all" && (
            <>
              {" "}
              • {getServiceName(filter)}:{" "}
              <span className="font-medium">
                {filteredBookings.filter((b) => b.service === filter).length}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllBookings;
