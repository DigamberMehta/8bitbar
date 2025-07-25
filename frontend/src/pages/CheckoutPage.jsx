import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { CreditCard } from "lucide-react";
import axios from "../utils/axios";

const CheckoutPage = () => {
  const { user } = useAuth(); // Get user details from AuthContext
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    firstName: "",
    lastName: "",
    country: "Australia",
    street: "",
    apartment: "",
    suburb: "",
    state: "Queensland",
    postcode: "",
    phone: "",
    email: "",
  });

  // Load cart from localStorage when the component mounts
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, []);

  // Pre-fill form with user data if available
  useEffect(() => {
    if (user) {
      setBillingDetails((prev) => ({
        ...prev,
        firstName: user.name?.split(" ")[0] || "",
        lastName: user.name?.split(" ").slice(1).join(" ") || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const estimatedTotal = cart.reduce(
    (total, item) => total + (item.totalCost || 0),
    0
  );

  const handlePlaceOrder = async () => {
    if (!user) {
      alert("Please log in to place an order");
      return;
    }

    setLoading(true);
    try {
      // Process each item in the cart
      for (const item of cart) {
        if (item.type === "cafe") {
          // Handle cafe booking
          await axios.post("/cafe/bookings", {
            chairIds: item.chairIds,
            date: item.date,
            time: item.time,
            duration: item.duration,
            customerName:
              `${billingDetails.firstName} ${billingDetails.lastName}`.trim() ||
              user.name,
            customerEmail: billingDetails.email || user.email,
            customerPhone: billingDetails.phone,
            deviceType: item.deviceType,
          });
        }
        // Add other booking types here (karaoke, n64, etc.)
      }

      // Clear cart after successful booking
      localStorage.removeItem("cart");
      setCart([]);

      alert("Order placed successfully! Check your bookings in your account.");
    } catch (error) {
      console.error("Order placement failed:", error);
      alert(
        error.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderInputField = (
    name,
    label,
    placeholder,
    required = false,
    type = "text"
  ) => (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-300 mb-2"
      >
        {label} {required && <span className="text-pink-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        value={billingDetails[name]}
        onChange={handleBillingChange}
        placeholder={placeholder}
        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-pink-500 focus:outline-none transition-colors"
        required={required}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-['Orbitron'] text-4xl font-bold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400 text-center">
          Checkout
        </h1>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left Column: Billing Details */}
          <div className="lg:w-2/3 bg-black/60 border border-pink-500/30 rounded-lg p-8 shadow-lg">
            <h2 className="font-['Orbitron'] text-2xl font-bold text-white mb-6">
              Billing Details
            </h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInputField("firstName", "First Name", "Alice", true)}
                {renderInputField("lastName", "Last Name", "Wonderland", true)}
              </div>
              {renderInputField("country", "Country/Region", "", true)}
              {renderInputField(
                "street",
                "Street Address",
                "House number and street name",
                true
              )}
              {renderInputField(
                "apartment",
                "Apartment, suite, etc.",
                "Optional"
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInputField(
                  "suburb",
                  "Suburb",
                  "e.g., Fortitude Valley",
                  true
                )}
                {renderInputField("postcode", "Postcode", "e.g., 4006", true)}
              </div>
              {renderInputField("phone", "Phone", "Optional", false, "tel")}
              {renderInputField(
                "email",
                "Email Address",
                "you@wonderland.com",
                true,
                "email"
              )}
            </form>
          </div>

          {/* Right Column: Order Summary & Payment */}
          <div className="lg:w-1/3">
            <div className="bg-black/60 border border-pink-500/30 rounded-lg p-8 shadow-lg sticky top-24">
              <h2 className="font-['Orbitron'] text-2xl font-bold text-white mb-6 border-b border-pink-500/20 pb-4">
                Your Order
              </h2>
              <div className="space-y-4 mb-6">
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-gray-300"
                  >
                    <span>
                      {item.title || item.roomName} x {item.duration}h
                    </span>
                    <span className="font-medium">
                      ${item.totalCost.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-pink-500/20 pt-4 space-y-2">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>${estimatedTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white text-xl font-bold">
                  <span>Total</span>
                  <span className="text-green-400">
                    ${estimatedTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-['Orbitron'] text-xl font-bold text-white mb-4">
                  Payment Details
                </h3>
                <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
                  <div className="flex items-center gap-3 text-gray-400">
                    <CreditCard className="h-6 w-6 text-cyan-400" />
                    <p>Pay securely using your credit card.</p>
                  </div>
                  {/* Placeholder for a payment element like Stripe */}
                  <div className="mt-4 bg-gray-900 h-12 rounded-md border border-gray-500" />
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full mt-8 py-3 bg-gradient-to-r from-cyan-400 to-pink-500 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition-all duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  "Place Order"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
