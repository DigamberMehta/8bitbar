import React, { useState, useEffect } from "react";
import {
  MdLock,
  MdPerson,
  MdEmail,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import StaffLoginModal from "../../components/auth/StaffLoginModal";
import StaffSignupModal from "../../components/auth/StaffSignupModal";

const StaffLoginPage = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  useEffect(() => {
    // Check if staff is already logged in
    const token = localStorage.getItem("staffToken");
    const user = localStorage.getItem("staffUser");

    if (token && user) {
      // Redirect to staff dashboard if already logged in
      window.location.href = "/staff";
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <MdLock className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Staff Portal
          </h1>
          <p className="text-gray-600">
            Access the staff interface for managing bookings and customer
            services
          </p>
        </div>

        {/* Login/Signup Cards */}
        <div className="space-y-4">
          {/* Login Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <div className="text-center mb-4">
              <MdPerson className="mx-auto text-blue-600 mb-2" size={32} />
              <h2 className="text-xl font-semibold text-gray-900">
                Already have an account?
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Sign in to access the staff dashboard
              </p>
            </div>
            <button
              onClick={() => setShowLoginModal(true)}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
            >
              Sign In
            </button>
          </div>

          {/* Signup Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <div className="text-center mb-4">
              <MdEmail className="mx-auto text-green-600 mb-2" size={32} />
              <h2 className="text-xl font-semibold text-gray-900">
                New staff member?
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Create a new admin account to get started
              </p>
            </div>
            <button
              onClick={() => setShowSignupModal(true)}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium"
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Only authorized admin users can access the staff portal
          </p>
          <div className="mt-2">
            <a
              href="/"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              ← Back to main site
            </a>
          </div>
        </div>
      </div>

      {/* Modals */}
      <StaffLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignup={() => {
          setShowLoginModal(false);
          setShowSignupModal(true);
        }}
      />

      <StaffSignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSwitchToLogin={() => {
          setShowSignupModal(false);
          setShowLoginModal(true);
        }}
      />
    </div>
  );
};

export default StaffLoginPage;
