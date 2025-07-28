import React, { useState, useEffect } from "react";
import api from "../../../utils/axios";

const KaraokeBookingsAdmin = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchBookings();
  }, [filter]); // Refetch when the status filter changes

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/admin/karaoke/karaoke-bookings?status=${filter}`
      );
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error("Error fetching karaoke bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      await api.patch(`/admin/karaoke/karaoke-bookings/${bookingId}/status`, {
        status: newStatus,
      });
      fetchBookings(); // Refresh the list
    } catch (error) {
      console.error("Error updating booking status:", error);
      alert("Failed to update booking status");
    }
  };

  // Helper function to format dates
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatTimeRange = (startDateTime, durationHours) => {
    const start = new Date(startDateTime);
    const end = new Date(start);
    end.setHours(end.getHours() + durationHours);
    
    const startTime = start.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const endTime = end.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    
    return `${startTime} - ${endTime}`;
  };

  // Helper function to get status badge colors
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

  // Memoize the filtered and sorted bookings to avoid re-calculating
  const processedBookings = React.useMemo(() => {
    return bookings
      .filter((booking) => {
        if (!dateFilter) return true;
        const bookingDate = new Date(booking.startDateTime)
          .toISOString()
          .slice(0, 10);
        return bookingDate === dateFilter;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "oldest":
            return new Date(a.startDateTime) - new Date(b.startDateTime);
          case "durationHigh":
            return b.durationHours - a.durationHours;
          case "durationLow":
            return a.durationHours - b.durationHours;
          case "newest":
          default:
            return new Date(b.startDateTime) - new Date(a.startDateTime);
        }
      });
  }, [bookings, dateFilter, sortBy]);

  // A reusable component for action buttons
  const ActionButtons = ({ booking }) => (
    <div className="flex items-center gap-4 mt-4 md:mt-0">
      {booking.status === "pending" && (
        <>
          <button
            onClick={() => updateBookingStatus(booking._id, "confirmed")}
            className="text-sm font-medium text-green-600 hover:text-green-800"
          >
            Confirm
          </button>
          <button
            onClick={() => updateBookingStatus(booking._id, "cancelled")}
            className="text-sm font-medium text-red-600 hover:text-red-800"
          >
            Cancel
          </button>
        </>
      )}
      {booking.status === "confirmed" && (
        <>
          <button
            onClick={() => updateBookingStatus(booking._id, "completed")}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Complete
          </button>
          <button
            onClick={() => updateBookingStatus(booking._id, "cancelled")}
            className="text-sm font-medium text-red-600 hover:text-red-800"
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Karaoke Bookings
          </h1>
          <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="newest">Sort: Newest</option>
              <option value="oldest">Sort: Oldest</option>
              <option value="durationHigh">Duration (High-Low)</option>
              <option value="durationLow">Duration (Low-High)</option>
            </select>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking Details
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Cost
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {processedBookings.map((booking) => (
                  <tr key={booking._id}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.customerName || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {booking.customerEmail || "N/A"}
                      </div>
                      {booking.customerPhone && (
                        <div className="text-sm text-gray-500">
                          {booking.customerPhone}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        Room: {booking.roomId?.name || "Karaoke Room"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(booking.startDateTime)} ({formatTimeRange(booking.startDateTime, booking.durationHours)})
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Payment:{" "}
                        {booking.paymentId ? (
                          <span className="text-green-600 font-mono text-xs">
                            {booking.paymentId}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">
                            No payment ID
                          </span>
                        )}{" "}
                        <span
                          className={`inline-flex px-1 py-0.5 text-xs font-semibold rounded ${
                            booking.paymentStatus === "completed"
                              ? "bg-green-100 text-green-800"
                              : booking.paymentStatus === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : booking.paymentStatus === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {booking.paymentStatus || "pending"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">
                        $
                        {booking.totalPrice
                          ? booking.totalPrice.toFixed(2)
                          : "0.00"}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <ActionButtons booking={booking} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {processedBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white shadow-md rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-bold text-gray-800 mb-1">
                    {booking.customerName || "N/A"}
                  </div>
                  <div className="text-sm text-gray-500 mb-1">
                    📧 {booking.customerEmail || "N/A"}
                  </div>
                  {booking.customerPhone && (
                    <div className="text-sm text-gray-500">
                      📞 {booking.customerPhone}
                    </div>
                  )}
                </div>
                <span
                  className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    booking.status
                  )}`}
                >
                  {booking.status}
                </span>
              </div>
              <div className="mt-4 border-t border-gray-200 pt-4">
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <dt className="text-sm font-medium text-gray-500">Room</dt>
                  <dd className="text-sm text-gray-900">
                    {booking.roomId?.name || "Karaoke Room"}
                  </dd>

                  <dt className="text-sm font-medium text-gray-500">Date</dt>
                  <dd className="text-sm text-gray-900">
                    {formatDate(booking.startDateTime)}
                  </dd>

                  <dt className="text-sm font-medium text-gray-500">Time Range</dt>
                  <dd className="text-sm text-gray-900">
                    {formatTimeRange(booking.startDateTime, booking.durationHours)}
                  </dd>

                  <dt className="text-sm font-medium text-gray-500">
                    Payment ID
                  </dt>
                  <dd className="text-sm text-gray-900 break-all">
                    {booking.paymentId ? (
                      <span className="text-green-600 font-mono text-xs break-words">
                        {booking.paymentId}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">
                        No payment ID
                      </span>
                    )}
                  </dd>

                  <dt className="text-sm font-medium text-gray-500">
                    Payment Status
                  </dt>
                  <dd className="text-sm text-gray-900">
                    <span
                      className={`inline-flex px-1 py-0.5 text-xs font-semibold rounded ${
                        booking.paymentStatus === "completed"
                          ? "bg-green-100 text-green-800"
                          : booking.paymentStatus === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : booking.paymentStatus === "failed"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {booking.paymentStatus || "pending"}
                    </span>
                  </dd>

                  <dt className="text-sm font-medium text-gray-500">
                    Total Cost
                  </dt>
                  <dd className="text-sm font-medium text-green-600">
                    $
                    {booking.totalPrice
                      ? booking.totalPrice.toFixed(2)
                      : "0.00"}
                  </dd>
                </dl>
              </div>
              <div className="mt-4 border-t border-gray-200 pt-4">
                <ActionButtons booking={booking} />
              </div>
            </div>
          ))}
        </div>

        {processedBookings.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-white shadow-md rounded-lg">
            No bookings found for the selected filters.
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
                .reduce((sum, b) => sum + b.totalPrice, 0)
                .toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KaraokeBookingsAdmin;
