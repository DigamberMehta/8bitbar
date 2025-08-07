import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { CreditCard, Globe, Calendar, Clock, Users, Home } from "lucide-react";
import axios from "../utils/axios";
import SquarePaymentForm from "../components/payments/SquarePaymentForm";

const CheckoutPage = () => {
  const { user } = useAuth(); // Get user details from AuthContext
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
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

  // Helper: calculate end time with 5 min cleaning time
  const calculateEndTime = (startTime, duration, isHourFormat = false) => {
    // Handle 24-hour format (cafe)
    if (isHourFormat) {
      const [hour, minute] = startTime.split(":");
      let endHour = parseInt(hour) + duration;
      let endMinute = parseInt(minute) - 5;

      if (endMinute < 0) {
        endMinute += 60;
        endHour -= 1;
      }

      // Handle day rollover
      endHour = endHour % 24;

      return `${endHour.toString().padStart(2, "0")}:${endMinute
        .toString()
        .padStart(2, "0")}`;
    }

    // Handle AM/PM format (karaoke, n64)
    const match = startTime.match(/(\d+):(\d+) (AM|PM)/);
    if (!match) return startTime;
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

    // Handle day rollover
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
  };

  const estimatedTotal = cart.reduce(
    (total, item) => total + (item.totalCost || 0),
    0
  );

  const handlePaymentSuccess = async (payment) => {
    setPaymentCompleted(true);
    setPaymentData(payment);

    setLoading(true);
    try {
      // Convert Square payment status to lowercase for database compatibility
      const paymentStatus = payment.status.toLowerCase();

      // Now create bookings after successful payment
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
            paymentId: payment.id, // Link booking to payment
            paymentStatus: paymentStatus,
          });
        } else if (item.type === "karaoke") {
          // Handle karaoke booking
          await axios.post("/karaoke-rooms/bookings", {
            customerName:
              `${billingDetails.firstName} ${billingDetails.lastName}`.trim() ||
              user.name,
            customerEmail: billingDetails.email || user.email,
            customerPhone: billingDetails.phone,
            numberOfPeople: item.people,
            roomId: item.roomId,
            date: item.date,
            time: item.time,
            durationHours: item.duration,
            totalPrice: item.totalCost,
            paymentId: payment.id,
            paymentStatus: paymentStatus,
          });
        } else if (item.type === "n64") {
          // Handle N64 booking
          await axios.post("/n64-rooms/bookings", {
            customerName:
              `${billingDetails.firstName} ${billingDetails.lastName}`.trim() ||
              user.name,
            customerEmail: billingDetails.email || user.email,
            customerPhone: billingDetails.phone,
            numberOfPeople: item.people,
            roomId: item.roomId,
            roomType: item.roomType,
            date: item.date,
            time: item.time,
            durationHours: item.duration,
            totalPrice: item.totalCost,
            paymentId: payment.id,
            paymentStatus: paymentStatus,
          });
        }
      }

      // Clear cart after successful booking
      localStorage.removeItem("cart");
      setCart([]);

      alert(
        "Payment successful! Your booking has been confirmed. Check your bookings in your account."
      );
    } catch (error) {
      console.error("Booking creation failed after payment:", error);
      alert(
        "Payment was successful, but there was an issue creating your booking. Please contact support with payment ID: " +
          payment.id
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentError = (error) => {
    console.error("Payment failed:", error);
    alert("Payment failed: " + error);
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
          {/* Left Column: Your Details */}
          <div className="lg:w-2/3 bg-black/60 border border-pink-500/30 rounded-lg p-8 shadow-lg">
            <h2 className="font-['Orbitron'] text-2xl font-bold text-white mb-6">
              Your Details
            </h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInputField("firstName", "First Name", "Alice", true)}
                {renderInputField("lastName", "Last Name", "Wonderland", true)}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Country/Region <span className="text-pink-500">*</span>
                </label>
                <div className="flex items-center bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white">
                  <Globe className="h-5 w-5 text-pink-500 mr-3" />
                  <span>Australia</span>
                </div>
              </div>
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
              {renderInputField(
                "phone",
                "Phone",
                "Your phone number",
                true,
                "tel"
              )}
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
                  <div key={index} className="border-b border-gray-700 pb-3">
                    <div className="flex justify-between text-gray-300 mb-2">
                      <span>
                        {item.title || item.roomName} x {item.duration}h
                      </span>
                      <span className="font-medium">
                        ${item.totalCost.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 mb-2">
                      <div className="flex items-center mb-1">
                        <Calendar className="h-4 w-4 text-pink-500 mr-2" />
                        <span>Date: {item.date}</span>
                      </div>
                      <div className="flex items-center mb-1">
                        <Clock className="h-4 w-4 text-pink-500 mr-2" />
                        <span>
                          Time: {item.time} -{" "}
                          {calculateEndTime(
                            item.time,
                            item.duration,
                            item.type === "cafe"
                          )}
                        </span>
                      </div>
                      {item.people && (
                        <div className="flex items-center mb-1">
                          <Users className="h-4 w-4 text-pink-500 mr-2" />
                          <span>People: {item.people}</span>
                        </div>
                      )}
                      {item.roomName && (
                        <div className="flex items-center mb-1">
                          <Home className="h-4 w-4 text-pink-500 mr-2" />
                          <span>Room: {item.roomName}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-red-300 px-3 py-2 bg-red-900/30 rounded-lg border border-red-500/50">
                      ⚠️ <strong>Actual time:</strong> {item.time} -{" "}
                      {calculateEndTime(
                        item.time,
                        item.duration,
                        item.type === "cafe"
                      )}{" "}
                      (5 min reserved for cleaning)
                    </div>
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

                {/* Payment Method Logos */}
                <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
                        <img
                          src="https://www.svgrepo.com/show/449176/payment-square.svg"
                          alt="Square Payment"
                          className="w-6 h-6"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-6 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">VISA</span>
                    </div>
                    <div className="w-8 h-6 bg-red-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">MC</span>
                    </div>
                    <div className="w-8 h-6 bg-green-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">AMEX</span>
                    </div>
                    <div className="w-8 h-6 bg-gray-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">DISC</span>
                    </div>
                    <div className="w-8 h-6 bg-yellow-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">JCB</span>
                    </div>
                  </div>
                </div>

                {paymentCompleted ? (
                  <div className="bg-green-800 border border-green-600 rounded-lg p-6">
                    <div className="text-center">
                      <div className="text-green-400 text-2xl mb-2">✓</div>
                      <h3 className="text-white font-bold mb-2">
                        Payment Successful!
                      </h3>
                      <p className="text-green-300 text-sm">
                        Payment ID: {paymentData?.id}
                      </p>
                      <p className="text-green-300 text-sm">
                        Amount: $
                        {(paymentData?.amountMoney?.amount / 100).toFixed(2)}{" "}
                        {paymentData?.amountMoney?.currency}
                      </p>
                    </div>
                  </div>
                ) : (
                  <SquarePaymentForm
                    amount={estimatedTotal}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                    disabled={loading || cart.length === 0}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
