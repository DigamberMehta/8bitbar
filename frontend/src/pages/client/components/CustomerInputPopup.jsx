import React, { useState } from "react";
import { MdClose, MdPerson, MdEmail, MdPhone, MdCake } from "react-icons/md";

const CustomerInputPopup = ({ isOpen, onClose, onCustomerSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    customerName: initialData.customerName || "",
    customerEmail: initialData.customerEmail || "",
    customerPhone: initialData.customerPhone || "",
    customerDob: initialData.customerDob || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCustomerSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Customer Information</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <MdClose size={28} />
            </button>
          </div>
          <p className="text-blue-100 mt-2 text-lg">
            Please fill in your details below
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="flex items-center space-x-3 text-lg font-semibold text-gray-700">
              <MdPerson size={24} className="text-blue-600" />
              <span>Full Name *</span>
            </label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="flex items-center space-x-3 text-lg font-semibold text-gray-700">
              <MdEmail size={24} className="text-green-600" />
              <span>Email Address *</span>
            </label>
            <input
              type="email"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
              placeholder="Enter your email address"
            />
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <label className="flex items-center space-x-3 text-lg font-semibold text-gray-700">
              <MdPhone size={24} className="text-purple-600" />
              <span>Phone Number *</span>
            </label>
            <input
              type="tel"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              placeholder="Enter your phone number"
            />
          </div>

          {/* Date of Birth Field */}
          <div className="space-y-2">
            <label className="flex items-center space-x-3 text-lg font-semibold text-gray-700">
              <MdCake size={24} className="text-orange-600" />
              <span>Date of Birth</span>
            </label>
            <input
              type="date"
              name="customerDob"
              value={formData.customerDob}
              onChange={handleInputChange}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-bold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Submit Information
          </button>
        </form>

        {/* Footer */}
        <div className="bg-gray-50 p-4 rounded-b-2xl text-center">
          <p className="text-gray-600 text-sm">
            Your information will be securely stored and used only for this booking.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerInputPopup;
