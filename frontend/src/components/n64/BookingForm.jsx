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
  const maxPeople = selectedBooth ? selectedBooth.maxPeople : 4;
  const pricePerHour = selectedBooth ? selectedBooth.pricePerHour : null;
  const totalCost = selectedBooth ? pricePerHour * duration : null;

  // Helper: check if a date falls on an available week day for a booth
  const isDateAvailable = (dateStr, booth) => {
    if (!booth?.weekDays || booth.weekDays.length === 0) return true; // If no week days specified, allow all
    const date = new Date(dateStr);
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayName = dayNames[date.getDay()];
    return booth.weekDays.includes(dayName);
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

  // Get all slots that would be blocked by the selected duration for a specific booth
  const getBlockedSlots = (dateStr, boothId) => {
    const booth = booths.find((b) => b._id === boothId);
    if (!booth) return [];

    return booth.timeSlots.filter((slot) => {
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
          if (bookingBoothId !== boothId) return false;
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

  const handleAddToCart = () => {
    if (selectedDate && selectedTime && selectedBooth) {
      const cartItem = {
        type: "n64",
        title: "N64 Booth",
        boothName: selectedBooth.name,
        roomId: selectedBooth._id, // Store roomId for easier checkout
        roomType:
          selectedBooth.roomType ||
          (selectedBooth.name?.toLowerCase().includes("mickey")
            ? "mickey"
            : "minnie"),
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

        {/* Date Selection - Now First */}
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
              setSelectedBoothId("");
            }}
            min={new Date().toISOString().split("T")[0]}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-pink-500 focus:outline-none transition-colors"
          />
        </div>

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

        {/* Booth and Time Selection - Show after date is selected */}
        {selectedDate && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Booth and Time *
            </label>
            <div className="space-y-4">
              {booths.map((booth) => {
                const isAvailable = isDateAvailable(selectedDate, booth);
                const blockedSlots = isAvailable
                  ? getBlockedSlots(selectedDate, booth._id)
                  : [];
                const availableSlots = booth.timeSlots.filter(
                  (slot) => !blockedSlots.includes(slot)
                );

                return (
                  <div
                    key={booth._id}
                    className="border border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex items-center mb-3">
                      <Gamepad2 className="h-5 w-5 text-pink-500 mr-2" />
                      <span className="font-medium text-white">
                        {booth.name}
                      </span>
                      {!isAvailable && (
                        <span className="ml-2 text-red-400 text-sm">
                          (Not available on{" "}
                          {new Date(selectedDate).toLocaleDateString("en-US", {
                            weekday: "long",
                          })}
                          )
                        </span>
                      )}
                    </div>

                    {isAvailable && availableSlots.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {booth.timeSlots.map((time) => {
                          const isBlocked = blockedSlots.includes(time);
                          const isSelected =
                            selectedBoothId === booth._id &&
                            selectedTime === time;

                          return (
                            <button
                              key={time}
                              onClick={() => {
                                if (!isBlocked) {
                                  setSelectedBoothId(booth._id);
                                  setSelectedTime(time);
                                }
                              }}
                              disabled={isBlocked}
                              className={`p-2 border rounded text-center transition-all duration-300 text-sm ${
                                isBlocked
                                  ? "opacity-50 cursor-not-allowed border-gray-700 bg-gray-800 text-gray-500"
                                  : isSelected
                                  ? "border-pink-500 bg-pink-500/20 text-pink-400"
                                  : "border-gray-700 hover:border-green-500 hover:bg-green-500/20 hover:text-green-400"
                              }`}
                            >
                              <Clock className="h-3 w-3 mx-auto mb-1" />
                              <span className="text-xs font-mono">{time}</span>
                            </button>
                          );
                        })}
                      </div>
                    ) : isAvailable ? (
                      <div className="text-gray-500 text-sm">
                        No available times for this booth
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Booking Time Info */}
        {selectedTime && duration && (
          <div className="text-sm text-red-300 px-4 py-3 bg-red-900/30 rounded-lg border border-red-500/50">
            ⚠️ <strong>Actual N64 time:</strong> {selectedTime} -{" "}
            {(() => {
              const match = selectedTime.match(/(\d+):(\d+) (AM|PM)/);
              if (!match) return selectedTime;
              const [_, hour, minute, period] = match;
              let endHour = parseInt(hour);
              if (period === "PM" && endHour !== 12) endHour += 12;
              if (period === "AM" && endHour === 12) endHour = 0;
              endHour += duration;
              let endMinute = parseInt(minute) - 5;
              if (endMinute < 0) {
                endMinute += 60;
                endHour -= 1;
              }

              // Handle day rollover (24+ hours)
              endHour = endHour % 24;

              let displayHour = endHour;
              let displayPeriod = "AM";
              if (endHour >= 12) {
                displayPeriod = "PM";
                if (endHour > 12) displayHour = endHour - 12;
              }
              if (endHour === 0) displayHour = 12;
              return `${displayHour}:${endMinute
                .toString()
                .padStart(2, "0")} ${displayPeriod}`;
            })()}{" "}
            (5 min reserved for cleaning)
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
          disabled={!selectedBooth || !selectedDate || !selectedTime}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl neon-glow-pink disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          🛒 ADD TO CART
        </button>
      </div>
    </div>
  );
};

export default BookingForm;
