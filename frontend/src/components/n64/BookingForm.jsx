import React, { useState } from "react";
import { Clock, Gamepad2 } from "lucide-react";
import BookingConfirmationModal from "./BookingConfirmationModal";

/**
 * BookingForm Component
 * Manages the entire N64 booth booking process, including state for
 * all form fields, user interaction, validation, and submission.
 */
const BookingForm = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedBooth, setSelectedBooth] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [error, setError] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  const timeSlots = {
    Mickey: ["02:00 PM", "03:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM"],
    Minnie: ["02:00 PM", "03:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "10:00 PM"],
  };

  const handleBooking = () => {
    if (selectedDate && selectedTime && selectedBooth) {
      const details = {
        booth: `N64 Booth - ${selectedBooth}`,
        date: selectedDate,
        time: selectedTime,
        people: numberOfPeople,
        totalCost: 20,
      };
      setBookingDetails(details);
      setIsModalOpen(true);
      setError(""); // Clear error on successful submission
    } else {
      setError("Please select a date, booth, and time to proceed.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setBookingDetails(null);
    // Reset form
    setSelectedDate("");
    setSelectedTime("");
    setSelectedBooth("");
    setNumberOfPeople(1);
  };

  return (
    <>
      <div className="bg-black/50 border border-pink-500/30 rounded-lg p-8 h-fit">
        <h3 className="font-['Orbitron'] text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400">
          BOOK YOUR N64 EXPERIENCE
        </h3>
        <div className="space-y-6">
          {/* Number of People */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Number of People (Max 4)
            </label>
            <select
              value={numberOfPeople}
              onChange={(e) => setNumberOfPeople(parseInt(e.target.value))}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-pink-500 focus:outline-none transition-colors"
            >
              {Array.from({ length: 4 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "person" : "people"}
                </option>
              ))}
            </select>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Select Date *</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-pink-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Booth Selection */}
          {selectedDate && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Select Booth *</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => { setSelectedBooth("Mickey"); setSelectedTime(""); }}
                  className={`p-4 border rounded-lg text-center transition-all duration-300 flex flex-col items-center justify-center ${selectedBooth === "Mickey" ? "border-pink-500 bg-pink-500/20 text-pink-400" : "border-gray-700 hover:border-pink-500"}`}
                >
                  <Gamepad2 className="h-6 w-6 mb-2" />
                  <span className="font-medium">Mickey</span>
                </button>
                <button
                  onClick={() => { setSelectedBooth("Minnie"); setSelectedTime(""); }}
                  className={`p-4 border rounded-lg text-center transition-all duration-300 flex flex-col items-center justify-center ${selectedBooth === "Minnie" ? "border-cyan-500 bg-cyan-500/20 text-cyan-400" : "border-gray-700 hover:border-cyan-500"}`}
                >
                  <Gamepad2 className="h-6 w-6 mb-2" />
                  <span className="font-medium">Minnie</span>
                </button>
              </div>
            </div>
          )}

          {/* Time Selection */}
          {selectedBooth && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Select Start Time *</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {timeSlots[selectedBooth].map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-3 border rounded-lg text-center transition-all duration-300 ${selectedTime === time ? "border-pink-500 bg-pink-500/20 text-pink-400" : "border-gray-700 hover:border-green-500"}`}
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
              <span className="text-green-400 font-bold">$20</span>
            </div>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-400 text-center text-sm">{error}</p>}
          
          {/* Book Button */}
          <button
            onClick={handleBooking}
            disabled={!selectedDate || !selectedTime || !selectedBooth}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl neon-glow-pink disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            🎮 BOOK N64 BOOTH
          </button>
        </div>
      </div>
      
      <BookingConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        details={bookingDetails}
      />
    </>
  );
};

export default BookingForm;
