import React, { useState, useEffect } from "react";
import api from "../../utils/axios";
import FinanceCalendar from "../../components/admin/FinanceCalendar";
import {
  MdCalendarToday,
  MdFilterList,
  MdSearch,
  MdMusicNote,
  MdVideogameAsset,
  MdLocalCafe,
  MdSchedule,
  MdEvent,
} from "react-icons/md";

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [calendarData, setCalendarData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    serviceType: "all",
    status: "all",
    startDate: "",
    endDate: "",
  });
  const [dateRange, setDateRange] = useState(() => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of current month

    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    };
  });

  useEffect(() => {
    fetchData();
  }, [filters, dateRange.startDate, dateRange.endDate]);

  const fetchData = async () => {
    console.log("Fetching data with date range:", dateRange);
    setLoading(true);
    try {
      // Fetch all bookings
      const bookingsResponse = await api.get("/admin/all-bookings", {
        params: {
          ...filters,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        },
      });

      // Fetch calendar data
      const calendarResponse = await api.get("/admin/all-bookings/calendar", {
        params: {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        },
      });

      console.log("Bookings response:", bookingsResponse.data);
      console.log("Calendar response:", calendarResponse.data);

      setBookings(bookingsResponse.data.bookings || []);
      setCalendarData(calendarResponse.data.calendarData || []);
    } catch (error) {
      console.error("Error fetching all bookings data:", error);
      console.error("Error details:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleDateRangeChange = (key, value) => {
    setDateRange((prev) => ({ ...prev, [key]: value }));
  };

  const handleMonthChange = (monthInfo) => {
    console.log("Month change detected in AllBookings:", monthInfo);
    // Update the date range to cover the entire month being displayed
    setDateRange({
      startDate: monthInfo.startDate,
      endDate: monthInfo.endDate,
    });
  };

  const getServiceIcon = (serviceType) => {
    switch (serviceType) {
      case "karaoke":
        return <MdMusicNote className="text-purple-500" />;
      case "n64":
        return <MdVideogameAsset className="text-blue-500" />;
      case "cafe":
        return <MdLocalCafe className="text-green-500" />;
      default:
        return <MdEvent className="text-gray-500" />;
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "confirmed":
        return { color: "bg-green-100 text-green-800", text: "Confirmed" };
      case "pending":
        return { color: "bg-yellow-100 text-yellow-800", text: "Pending" };
      case "cancelled":
        return { color: "bg-red-100 text-red-800", text: "Cancelled" };
      case "completed":
        return { color: "bg-blue-100 text-blue-800", text: "Completed" };
      default:
        return { color: "bg-gray-100 text-gray-800", text: status };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleEventClick = (event) => {
    // Handle event click - could open a modal with booking details
    console.log("Event clicked:", event);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            All Bookings
          </h1>
          <p className="text-gray-600">
            View and manage all bookings across all services
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <MdFilterList className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Filters:
              </span>
            </div>

            {/* Service Type Filter */}
            <select
              value={filters.serviceType}
              onChange={(e) =>
                handleFilterChange("serviceType", e.target.value)
              }
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
            >
              <option value="all">All Services</option>
              <option value="karaoke">Karaoke</option>
              <option value="n64">N64</option>
              <option value="cafe">Cafe</option>
            </select>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Date Range */}
            <div className="flex items-center gap-2">
              <MdCalendarToday className="text-gray-600" />
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) =>
                  handleDateRangeChange("startDate", e.target.value)
                }
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              />
              <span className="text-gray-600">to</span>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) =>
                  handleDateRangeChange("endDate", e.target.value)
                }
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              />
            </div>
          </div>
        </div>

        {/* Calendar View */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MdCalendarToday className="text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-900">
                Booking Calendar
              </h2>
            </div>
            <div className="text-sm text-gray-600">
              Showing:{" "}
              {new Date(dateRange.startDate).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>
          <FinanceCalendar
            events={calendarData}
            onEventClick={handleEventClick}
            onMonthChange={handleMonthChange}
          />
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              All Bookings ({bookings.length})
            </h2>
            {loading && <div className="text-sm text-gray-500">Loading...</div>}
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No bookings found for the selected criteria
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getServiceIcon(booking.serviceType)}
                          <span className="ml-2 text-sm font-medium text-gray-900 capitalize">
                            {booking.serviceType}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900">
                            {booking.customerName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.customerEmail}
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatDate(booking.bookingDate)} at{" "}
                            {formatTime(booking.bookingDate)}
                          </div>
                          <div className="text-sm text-gray-700">
                            {booking.serviceType === "karaoke" && (
                              <span>Room: {booking.roomName}</span>
                            )}
                            {booking.serviceType === "n64" && (
                              <span>Booth: {booking.boothName}</span>
                            )}
                            {booking.serviceType === "cafe" && (
                              <span>Table: {booking.tableName}</span>
                            )}
                          </div>
                          {booking.isManualBooking && booking.staffName && (
                            <div className="text-xs text-blue-600 mt-1">
                              Staff: {booking.staffName}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {(() => {
                          const statusInfo = getStatusInfo(booking.status);
                          return (
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}
                            >
                              {statusInfo.text}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${booking.amount || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllBookings;
