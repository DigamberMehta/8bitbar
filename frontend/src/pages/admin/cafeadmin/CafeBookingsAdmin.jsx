import React, { useState, useEffect } from "react";
import axios from "../../../utils/axios";
import BookingFilters from "./BookingFilters";
import BookingTable from "./BookingTable";
import BookingCards from "./BookingCards";

const CafeBookingsAdmin = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, statusFilter, dateFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/admin/cafe-bookings");
      setBookings(response.data.bookings);
    } catch (error) {
      console.error("Error fetching cafe bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookings;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    // Filter by date
    if (dateFilter) {
      filtered = filtered.filter((booking) => booking.date === dateFilter);
    }

    setFilteredBookings(filtered);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <BookingFilters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        onRefresh={fetchBookings}
        filteredCount={filteredBookings.length}
        totalCount={bookings.length}
      />

      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <div className="text-gray-500 text-lg">
            {bookings.length === 0
              ? "No cafe bookings found"
              : "No bookings match your filters"}
          </div>
          {(statusFilter !== "all" || dateFilter) && (
            <button
              onClick={() => {
                setStatusFilter("all");
                setDateFilter("");
              }}
              className="mt-2 text-blue-600 hover:text-blue-800 underline"
            >
              Clear filters to see all bookings
            </button>
          )}
        </div>
      ) : (
        <>
          <BookingTable
            bookings={filteredBookings}
            onUpdateStatus={updateBookingStatus}
          />
          <BookingCards
            bookings={filteredBookings}
            onUpdateStatus={updateBookingStatus}
          />
        </>
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
