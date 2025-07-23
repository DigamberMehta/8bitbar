import React from "react";
import BoothInfo from "./BoothInfo";
import BookingForm from "./BookingForm";

/**
 * N64Booking Component
 * Sets up the main layout, including the header and the responsive
 * two-column grid for the information and booking form.
 */
const N64Booking = () => {
  return (
    <div className="min-h-screen bg-gray-900 py-12 text-white">
      <div className="w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-['Orbitron'] text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400">
            🎮 N64 BOOTH BOOKING
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Book your retro gaming session in one of our premium N64 booths.
            Choose between Mickey and Minnie booths!
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-12">
          <BoothInfo />
          <BookingForm />
        </div>
      </div>
    </div>
  );
};

export default N64Booking;
