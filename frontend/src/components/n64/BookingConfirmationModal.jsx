import React from "react";
import { Calendar, Clock, Users, Gamepad2, CheckCircle } from "lucide-react";

/**
 * BookingConfirmationModal Component
 * A reusable modal to display N64 Booth booking confirmation details.
 */
const BookingConfirmationModal = ({ isOpen, onClose, details }) => {
  if (!isOpen || !details) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border-2 border-green-500 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 p-8 text-white">
        <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4 animate-pulse" />
            <h2 className="font-['Orbitron'] text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
              Booking Requested!
            </h2>
            <p className="text-gray-400 mb-6">
              Your request has been sent. Please await a confirmation email.
            </p>
        </div>

        <div className="bg-black/50 border border-gray-700 rounded-lg p-6 space-y-4 mb-8">
            <div className="flex items-center">
                <Gamepad2 className="h-5 w-5 text-pink-400 mr-3"/>
                <span className="text-gray-300">Booth:</span>
                <span className="ml-auto font-mono">{details.booth}</span>
            </div>
            <div className="flex items-center">
                <Calendar className="h-5 w-5 text-cyan-400 mr-3"/>
                <span className="text-gray-300">Date:</span>
                <span className="ml-auto font-mono">{details.date}</span>
            </div>
            <div className="flex items-center">
                <Clock className="h-5 w-5 text-cyan-400 mr-3"/>
                <span className="text-gray-300">Time:</span>
                <span className="ml-auto font-mono">{details.time}</span>
            </div>
            <div className="flex items-center">
                <Users className="h-5 w-5 text-cyan-400 mr-3"/>
                <span className="text-gray-300">Guests:</span>
                <span className="ml-auto font-mono">{details.people}</span>
            </div>
            <div className="border-t border-gray-600 my-4"></div>
            <div className="flex items-center text-xl">
                <span className="text-white font-bold">Total:</span>
                <span className="ml-auto font-bold text-green-400">${details.totalCost}</span>
            </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-green-500 to-cyan-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl neon-glow-green"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmationModal;
