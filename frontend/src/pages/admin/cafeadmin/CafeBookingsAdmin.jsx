import React, { useState, useEffect } from "react";
import axios from "../../../utils/axios";

const CafeBookingsAdmin = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/admin/cafe-bookings?status=${statusFilter}`
      );
      setBookings(response.data.bookings);
    } catch (error) {
      console.error("Error fetching cafe bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      await axios.patch(`/admin/cafe-bookings/${bookingId}/status`, {
        status: newStatus,
      });
      fetchBookings(); // Refresh the list
    } catch (error) {
      console.error("Error updating booking status:", error);
      alert("Failed to update booking status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-AU", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    const [hour] = timeString.split(":");
    const hourNum = parseInt(hour);
    if (hourNum === 12) return "12:00 PM";
    return hourNum > 12 ? `${hourNum - 12}:00 PM` : `${hourNum}:00 AM`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Cafe Bookings Management
        </h1>
        <div className="flex items-center space-x-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Bookings</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={fetchBookings}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No cafe bookings found</div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chairs
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.customerName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.customerEmail}
                      </div>
                      {booking.customerPhone && (
                        <div className="text-sm text-gray-500">
                          {booking.customerPhone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(booking.date)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTime(booking.time)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {booking.chairIds.map((chairId) => (
                          <span
                            key={chairId}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                          >
                            {chairId}
                          </span>
                        ))}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {booking.chairIds.length} chair
                        {booking.chairIds.length > 1 ? "s" : ""}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.duration} hour{booking.duration > 1 ? "s" : ""}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      ${booking.totalCost.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {booking.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                updateBookingStatus(booking._id, "confirmed")
                              }
                              className="text-green-600 hover:text-green-900 px-2 py-1 bg-green-100 rounded"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() =>
                                updateBookingStatus(booking._id, "cancelled")
                              }
                              className="text-red-600 hover:text-red-900 px-2 py-1 bg-red-100 rounded"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {booking.status === "confirmed" && (
                          <button
                            onClick={() =>
                              updateBookingStatus(booking._id, "completed")
                            }
                            className="text-blue-600 hover:text-blue-900 px-2 py-1 bg-blue-100 rounded"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">
            {bookings.filter((b) => b.status === "pending").length}
          </div>
          <div className="text-sm text-gray-600">Pending Bookings</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">
            {bookings.filter((b) => b.status === "confirmed").length}
          </div>
          <div className="text-sm text-gray-600">Confirmed Bookings</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-600">
            {bookings.filter((b) => b.status === "completed").length}
          </div>
          <div className="text-sm text-gray-600">Completed Bookings</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">
            $
            {bookings
              .filter((b) => b.status !== "cancelled")
              .reduce((sum, b) => sum + b.totalCost, 0)
              .toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">Total Revenue</div>
        </div>
      </div>
    </div>
  );
};

export default CafeBookingsAdmin;
