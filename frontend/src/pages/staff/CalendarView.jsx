import React, { useState, useEffect } from "react";
import {
  MdChevronLeft,
  MdChevronRight,
  MdEvent,
  MdPerson,
} from "react-icons/md";
import api from "../../utils/axios";

const CalendarView = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

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

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const getBookingsForDate = (date) => {
    if (!date) return [];

    const dateStr = date.toISOString().split("T")[0];
    return bookings.filter((booking) => {
      if (booking.startDateTime) {
        const bookingDate = new Date(booking.startDateTime)
          .toISOString()
          .split("T")[0];
        return bookingDate === dateStr;
      } else if (booking.date) {
        const bookingDate = new Date(booking.date).toISOString().split("T")[0];
        return bookingDate === dateStr;
      }
      return false;
    });
  };

  const getServiceColor = (service) => {
    switch (service) {
      case "karaoke":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "n64":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cafe":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getServiceName = (service) => {
    switch (service) {
      case "karaoke":
        return "Karaoke";
      case "n64":
        return "N64";
      case "cafe":
        return "Cafe";
      default:
        return service;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      case "completed":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

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

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar View</h1>
          <p className="text-gray-600 mt-1">
            View all bookings in a calendar format
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

      {/* Calendar Navigation */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateMonth("prev")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MdChevronLeft size={24} />
          </button>

          <h2 className="text-xl font-semibold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>

          <button
            onClick={() => navigateMonth("next")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MdChevronRight size={24} />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="p-2 text-center text-sm font-medium text-gray-500"
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map((day, index) => {
            const dayBookings = getBookingsForDate(day);
            const hasBookings = dayBookings.length > 0;

            return (
              <div
                key={index}
                className={`min-h-[120px] p-2 border border-gray-200 ${
                  isToday(day) ? "bg-blue-50 border-blue-300" : ""
                } ${
                  isSelected(day) ? "bg-blue-100 border-blue-400" : ""
                } hover:bg-gray-50 transition-colors cursor-pointer`}
                onClick={() => setSelectedDate(day)}
              >
                {day && (
                  <>
                    <div
                      className={`text-sm font-medium mb-1 ${
                        isToday(day) ? "text-blue-700" : "text-gray-900"
                      }`}
                    >
                      {day.getDate()}
                    </div>

                    {/* Bookings for this day */}
                    <div className="space-y-1">
                      {dayBookings.slice(0, 3).map((booking, bookingIndex) => (
                        <div
                          key={booking._id}
                          className={`text-xs p-1 rounded border ${getServiceColor(
                            booking.service
                          )}`}
                          title={`${getServiceName(booking.service)}: ${
                            booking.customerName || "N/A"
                          }`}
                        >
                          <div className="flex items-center space-x-1">
                            <div
                              className={`w-2 h-2 rounded-full ${getStatusColor(
                                booking.status
                              )}`}
                            ></div>
                            <span className="truncate">
                              {getServiceName(booking.service)}
                            </span>
                          </div>
                          <div className="truncate text-xs">
                            {booking.customerName || "N/A"}
                          </div>
                        </div>
                      ))}

                      {dayBookings.length > 3 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{dayBookings.length - 3} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Bookings for {selectedDate.toLocaleDateString()}
          </h3>

          {getBookingsForDate(selectedDate).length === 0 ? (
            <p className="text-gray-500">No bookings for this date</p>
          ) : (
            <div className="space-y-3">
              {getBookingsForDate(selectedDate).map((booking) => (
                <div
                  key={booking._id}
                  className="p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <MdEvent className="text-gray-400" size={18} />
                      <span className="font-medium text-gray-900">
                        {getServiceName(booking.service)} Booking
                      </span>
                    </div>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        booking.status
                      )
                        .replace("bg-", "bg-")
                        .replace("text-", "text-")}`}
                    >
                      {booking.status === "confirmed"
                        ? "Paid"
                        : booking.status === "pending"
                        ? "Not Paid"
                        : booking.status}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MdPerson className="text-gray-400" size={16} />
                    <span>{booking.customerName || "N/A"}</span>
                  </div>

                  {booking.startDateTime && (
                    <div className="text-sm text-gray-600 mt-1">
                      Time:{" "}
                      {new Date(booking.startDateTime).toLocaleTimeString()}
                    </div>
                  )}

                  {booking.time && (
                    <div className="text-sm text-gray-600 mt-1">
                      Time: {booking.time}
                    </div>
                  )}

                  {booking.isManualBooking && booking.staffName && (
                    <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                      <div className="text-xs text-blue-700">
                        Staff: {booking.staffName} (PIN: {booking.staffPin})
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarView;
