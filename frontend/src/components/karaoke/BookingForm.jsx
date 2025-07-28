import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";

/**
 * BookingForm Component
 * * This component handles all aspects of the booking process. It manages
 * the form state (date, time, people, duration), user input, validation,
 * and submission. It now receives room data as a prop and does not fetch or show confirmation modal.
 */
const BookingForm = ({ room }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState(2);
  const [numberOfHours, setNumberOfHours] = useState(1);
  const [error, setError] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch bookings for this specific room only
    const fetchBookings = async () => {
      try {
        const res = await axios.get(
          `/karaoke-rooms/bookings?roomId=${room._id}`
        );
        const data = res.data;
        if (data.success) {
          setBookings(data.bookings);
        }
      } catch (err) {
        // Optionally handle error
      } finally {
        setLoadingBookings(false);
      }
    };
    fetchBookings();
  }, [room._id]);

  if (!room) return null;

  const timeSlots = room.timeSlots || [];
  const maxPeople = room.maxPeople || 12;
  const pricePerHour =
    room && room.pricePerHour !== undefined ? room.pricePerHour : 60;
  const totalCost = pricePerHour * numberOfHours;

  // Helper: get all booked slots for the selected date (overlapping logic)
  const getBookedTimesForDate = (dateStr) => {
    return timeSlots.filter((slot) => {
      // Convert slot (e.g., "6:00 PM") to a Date object on the selected date
      const match = slot.match(/(\d+):(\d+) (AM|PM)/);
      if (!match) return false;
      const [_, slotHour, slotMinute, slotPeriod] = match;
      let hour = parseInt(slotHour, 10);
      if (slotPeriod === "PM" && hour !== 12) hour += 12;
      if (slotPeriod === "AM" && hour === 12) hour = 0;
      const slotDate = new Date(dateStr);
      slotDate.setHours(hour, parseInt(slotMinute, 10), 0, 0);

      // Check if this slot overlaps with any booking
      return bookings.some((b) => {
        const bookingStart = new Date(b.startDateTime);
        const bookingEnd = new Date(b.endDateTime);
        return slotDate >= bookingStart && slotDate < bookingEnd;
      });
    });
  };

  // Helper: get the Date object for a slot on a given date
  const getSlotDate = (dateStr, slot) => {
    const match = slot.match(/(\d+):(\d+) (AM|PM)/);
    if (!match) return null;
    const [_, slotHour, slotMinute, slotPeriod] = match;
    let hour = parseInt(slotHour, 10);
    if (slotPeriod === "PM" && hour !== 12) hour += 12;
    if (slotPeriod === "AM" && hour === 12) hour = 0;
    const slotDate = new Date(dateStr);
    slotDate.setHours(hour, parseInt(slotMinute, 10), 0, 0);
    return slotDate;
  };

  // Get all slots that would be blocked by the selected duration
  const getBlockedSlots = (dateStr) => {
    return timeSlots.filter((slot, idx) => {
      const slotStart = getSlotDate(dateStr, slot);
      if (!slotStart) return false;
      // Calculate the end time for this booking if started at this slot
      const slotEnd = new Date(slotStart);
      slotEnd.setHours(slotEnd.getHours() + numberOfHours);
      // For each hour in the duration, check if any hour overlaps with a booking
      for (let d = 0; d < numberOfHours; d++) {
        const checkStart = new Date(slotStart);
        checkStart.setHours(checkStart.getHours() + d);
        const checkEnd = new Date(checkStart);
        checkEnd.setHours(checkEnd.getHours() + 1);
        // Check for overlap with any booking
        const overlap = bookings.some((b) => {
          const bookingStart = new Date(b.startDateTime);
          const bookingEnd = new Date(b.endDateTime);
          // Overlap if checkStart < bookingEnd && checkEnd > bookingStart
          return checkStart < bookingEnd && checkEnd > bookingStart;
        });
        if (overlap) return true;
      }
      return false;
    });
  };
  const blockedSlots = selectedDate ? getBlockedSlots(selectedDate) : [];

  const bookedTimes = selectedDate ? getBookedTimesForDate(selectedDate) : [];

  const handleAddToCart = () => {
    if (selectedDate && selectedTime) {
      // If it's a free booking (price is 0), book directly without going to cart
      if (pricePerHour === 0) {
        handleDirectBooking();
        return;
      }

      // Prepare cart item
      const cartItem = {
        type: "karaoke",
        title: "Karaoke Room",
        roomName: room.name,
        roomId: room._id, // Store roomId for potential future use
        imageUrl:
          room.imageUrl ||
          "https://placehold.co/600x400/1a202c/ed64a6?text=Karaoke+Room",
        date: selectedDate,
        time: selectedTime,
        duration: numberOfHours,
        people: numberOfPeople,
        totalCost,
      };
      // Get existing cart from localStorage (common cart)
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      cart.push(cartItem);
      localStorage.setItem("cart", JSON.stringify(cart));
      // Redirect to cart page
      navigate("/cart");
    } else {
      setError("Please select a date and a start time to proceed.");
    }
  };

  const handleDirectBooking = async () => {
    try {
      setError("");

      const bookingData = {
        customerName: "Free Booking User", // You might want to get this from user context
        customerEmail: "free@booking.com", // You might want to get this from user context
        customerPhone: "",
        numberOfPeople,
        date: selectedDate,
        time: selectedTime,
        durationHours: numberOfHours,
        totalPrice: 0,
        roomId: room._id,
        paymentId: "FREE_BOOKING",
        paymentStatus: "completed",
      };

      const response = await axios.post("/karaoke-rooms/bookings", bookingData);

      if (response.data.success) {
        alert(
          "Free karaoke room booking confirmed successfully! You can now use your room."
        );
        setSelectedDate("");
        setSelectedTime("");
        setNumberOfPeople(2);
        setNumberOfHours(1);
        // Refresh bookings to show the new booking
        const res = await axios.get("/karaoke-rooms/bookings");
        if (res.data.success) {
          setBookings(res.data.bookings);
        }
      }
    } catch (error) {
      console.error("Failed to book free karaoke room:", error);
      setError("Failed to book room. Please try again.");
    }
  };

  // Helper: get all booked dates (for disabling in date picker)
  const bookedDatesSet = new Set(
    bookings.map((b) => new Date(b.startDateTime).toISOString().split("T")[0])
  );

  // Date input: disable dates that are fully booked (all slots taken)
  const isDateFullyBooked = (dateStr) => {
    const bookedTimesForDate = getBookedTimesForDate(dateStr);
    return bookedTimesForDate.length >= timeSlots.length;
  };

  // For disabling dates in the date picker, we need to use min/max/step, but native input doesn't support disabling arbitrary dates.
  // We'll show a warning if the selected date is fully booked.

  return (
    <div className="bg-black/50 border border-pink-500/30 rounded-lg p-8 h-fit">
      <h3 className="font-['Orbitron'] text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400">
        BOOK YOUR WONDERLAND EXPERIENCE
      </h3>

      <div className="space-y-6">
        {/* Number of People */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Number of People (Max {maxPeople})
          </label>
          <select
            value={numberOfPeople}
            onChange={(e) => setNumberOfPeople(parseInt(e.target.value))}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-pink-500 focus:outline-none transition-colors"
          >
            {Array.from({ length: maxPeople }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "person" : "people"}
              </option>
            ))}
          </select>
        </div>

        {/* Duration Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Duration
          </label>
          <select
            value={numberOfHours}
            onChange={(e) => setNumberOfHours(parseInt(e.target.value))}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-pink-500 focus:outline-none transition-colors"
          >
            {Array.from({ length: 4 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "hour" : "hours"}
              </option>
            ))}
          </select>
        </div>

        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Date *
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedTime(""); // reset time when date changes
            }}
            min={new Date().toISOString().split("T")[0]}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-pink-500 focus:outline-none transition-colors"
          />
          {selectedDate && isDateFullyBooked(selectedDate) && (
            <div className="text-red-400 text-sm mt-2">
              All time slots are booked for this date. Please select another
              date.
            </div>
          )}
        </div>

        {/* Time Selection */}
        {selectedDate && !isDateFullyBooked(selectedDate) && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Start Time *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  disabled={blockedSlots.includes(time)}
                  className={`p-3 border rounded-lg text-center transition-all duration-300 ${
                    blockedSlots.includes(time)
                      ? "opacity-50 cursor-not-allowed border-gray-700 bg-gray-800 text-gray-500"
                      : selectedTime === time
                      ? "border-pink-500 bg-pink-500/20 text-pink-400"
                      : "border-gray-700 hover:border-green-500 hover:bg-green-500/20 hover:text-green-400"
                  }`}
                >
                  <Clock className="h-4 w-4 mx-auto mb-1" />
                  <span className="text-sm font-mono">{time}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Total Cost */}
        <div className="border-t border-gray-700 pt-6">
          <div className="flex justify-between items-center text-lg mb-4">
            <span className="text-gray-300">
              Price ({numberOfHours} {numberOfHours > 1 ? "hours" : "hour"}):
            </span>
            <span className="text-white">
              {pricePerHour === 0 ? (
                <span className="text-green-400 font-bold">FREE</span>
              ) : (
                `$${totalCost}`
              )}
            </span>
          </div>
          <div className="flex justify-between items-center text-xl">
            <span className="text-gray-300 font-semibold">Total:</span>
            <span className="text-green-400 font-bold">
              {pricePerHour === 0 ? (
                <span className="text-green-400 font-bold">FREE</span>
              ) : (
                `$${totalCost}`
              )}
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-400 text-center text-sm">{error}</p>}

        {/* Booking Button */}
        <button
          onClick={handleAddToCart}
          disabled={
            !selectedDate || !selectedTime || isDateFullyBooked(selectedDate)
          }
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl neon-glow-pink disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {pricePerHour === 0 ? "🎉 BOOK FREE ROOM" : "🛒 ADD TO CART"}
        </button>
      </div>
    </div>
  );
};

export default BookingForm;
