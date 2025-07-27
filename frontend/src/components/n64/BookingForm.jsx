import React, { useState } from "react";
import { Clock, Gamepad2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * BookingForm Component
 * Manages the entire N64 booth booking process, including state for
 * all form fields, user interaction, validation, and submission.
 * Now uses dynamic booths and bookings props.
 */
const BookingForm = ({ booths, bookings }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedBoothId, setSelectedBoothId] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [duration, setDuration] = useState(1);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Find selected booth object
  const selectedBooth = booths.find((b) => b._id === selectedBoothId);
  const timeSlots = selectedBooth ? selectedBooth.timeSlots : [];
  const maxPeople = selectedBooth ? selectedBooth.maxPeople : 4;
  const pricePerHour = selectedBooth ? selectedBooth.pricePerHour : null;
  const totalCost = selectedBooth ? pricePerHour * duration : null;

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
      slotEnd.setHours(slotEnd.getHours() + duration);
      // For each hour in the duration, check if any hour overlaps with a booking
      for (let d = 0; d < duration; d++) {
        const checkStart = new Date(slotStart);
        checkStart.setHours(checkStart.getHours() + d);
        const checkEnd = new Date(checkStart);
        checkEnd.setHours(checkEnd.getHours() + 1);
        // Check for overlap with any booking for this booth
        const overlap = bookings.some((b) => {
          const bookingBoothId =
            b.roomId && b.roomId._id ? b.roomId._id : b.roomId;
          if (bookingBoothId !== selectedBoothId) return false;
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
  const blockedSlots =
    selectedDate && selectedBoothId ? getBlockedSlots(selectedDate) : [];

  const handleAddToCart = () => {
    if (selectedDate && selectedTime && selectedBooth) {
      const cartItem = {
        type: "n64",
        title: "N64 Booth",
        boothName: selectedBooth.name,
        roomId: selectedBooth._id, // Store roomId for easier checkout
        roomType: selectedBooth.roomType || (selectedBooth.name?.toLowerCase().includes("mickey") ? "mickey" : "minnie"),
        imageUrl:
          "https://8bitbar.com.au/wp-content/uploads/2025/03/20250419_212301-scaled.jpg",
        date: selectedDate,
        time: selectedTime,
        duration,
        people: numberOfPeople,
        totalCost,
      };
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      cart.push(cartItem);
      localStorage.setItem("cart", JSON.stringify(cart));
      navigate("/cart");
    } else {
      setError("Please select a date, booth, and time to proceed.");
    }
  };

  return (
    <div className="bg-black/50 border border-pink-500/30 rounded-lg p-8 h-fit">
      <h3 className="font-['Orbitron'] text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400">
        BOOK YOUR N64 EXPERIENCE
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
              setSelectedTime("");
            }}
            min={new Date().toISOString().split("T")[0]}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-pink-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Booth Selection */}
        {selectedDate && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Booth *
            </label>
            <div className="grid grid-cols-2 gap-4">
              {booths.map((booth) => (
                <button
                  key={booth._id}
                  onClick={() => {
                    setSelectedBoothId(booth._id);
                    setSelectedTime("");
                  }}
                  className={`p-4 border rounded-lg text-center transition-all duration-300 flex flex-col items-center justify-center ${
                    selectedBoothId === booth._id
                      ? "border-pink-500 bg-pink-500/20 text-pink-400"
                      : "border-gray-700 hover:border-pink-500"
                  }`}
                >
                  <Gamepad2 className="h-6 w-6 mb-2" />
                  <span className="font-medium">{booth.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Duration Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Duration
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-pink-500 focus:outline-none transition-colors"
          >
            {Array.from({ length: 4 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "hour" : "hours"}
              </option>
            ))}
          </select>
        </div>

        {/* Time Selection */}
        {selectedBooth && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Start Time *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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

        {/* Total Cost Display */}
        <div className="border-t border-gray-700 pt-6">
          <div className="flex justify-between items-center text-xl">
            <span className="text-gray-300 font-semibold">Total Cost:</span>
            <span className="text-green-400 font-bold">
              {selectedBooth ? `$${totalCost}` : "--"}
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-400 text-center text-sm">{error}</p>}

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!selectedDate || !selectedTime || !selectedBooth}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl neon-glow-pink disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          🛒 ADD TO CART
        </button>
      </div>
    </div>
  );
};

export default BookingForm;
