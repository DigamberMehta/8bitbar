import React, { useState, useEffect } from "react";
import api from "../../../utils/axios";
import {
  MdMusicNote,
  MdVideogameAsset,
  MdLocalCafe,
  MdAttachMoney,
  MdPersonAdd,
} from "react-icons/md";
import { ServiceTab, CustomerInfoForm } from "./FormComponents";
import KaraokeBookingForm from "./KaraokeBookingForm";
import N64BookingForm from "./N64BookingForm";
import CafeBookingForm from "./CafeBookingForm";
import PinInputModal from "../../../components/admin/PinInputModal";
import CustomerInputPopup from "./CustomerInputPopup";

const ManualBooking = () => {
  const [activeService, setActiveService] = useState("karaoke");
  const [resources, setResources] = useState({
    karaoke: [],
    n64: [],
    cafe: null,
  });
  const [loading, setLoading] = useState(false);
  const [chairsWithAvailability, setChairsWithAvailability] = useState([]);
  const [loadingChairs, setLoadingChairs] = useState(false);
  const [roomAvailability, setRoomAvailability] = useState({
    karaoke: { room: null, bookings: [], timeSlots: [] },
    n64: { room: null, bookings: [], timeSlots: [] },
  });
  const [loadingRoomAvailability, setLoadingRoomAvailability] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerDob: "",
  });
  const [bookingData, setBookingData] = useState({
    karaoke: {
      roomId: "",
      numberOfPeople: 1,
      startDateTime: "",
      durationHours: 1,
      status: "pending",
    },
    n64: {
      roomId: "",
      numberOfPeople: 1,
      startDateTime: "",
      durationHours: 1,
      status: "pending",
    },
    cafe: {
      chairIds: [],
      date: "",
      time: "",
      duration: 1,
      specialRequests: "",
      status: "pending",
    },
  });
  const [result, setResult] = useState(null);

  // PIN-related state
  const [showPinModal, setShowPinModal] = useState(false);
  const [staffInfo, setStaffInfo] = useState(null);
  const [bookingInProgress, setBookingInProgress] = useState(false);

  // Customer popup state
  const [showCustomerPopup, setShowCustomerPopup] = useState(false);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/bookings/resources");
      setResources(response.data.resources);
    } catch (error) {
      console.error("Error fetching resources:", error);
      alert("Failed to fetch resources");
    } finally {
      setLoading(false);
    }
  };

  const fetchChairAvailability = async (date, time, duration) => {
    if (!date || !time || !duration) {
      setChairsWithAvailability([]);
      return;
    }

    try {
      setLoadingChairs(true);
      const response = await api.get(
        "/admin/bookings/cafe/chairs/availability",
        {
          params: { date, time, duration },
        }
      );
      setChairsWithAvailability(response.data.chairs);
    } catch (error) {
      console.error("Error fetching chair availability:", error);
      setChairsWithAvailability([]);
    } finally {
      setLoadingChairs(false);
    }
  };

  const fetchRoomAvailability = async (service, date, roomId) => {
    if (!date || !roomId) {
      setRoomAvailability((prev) => ({
        ...prev,
        [service]: { room: null, bookings: [], timeSlots: [] },
      }));
      return;
    }

    try {
      setLoadingRoomAvailability(true);
      console.log(
        `Fetching ${service} availability for date: ${date}, roomId: ${roomId}`
      );

      const response = await api.get(
        `/admin/bookings/${service}/availability`,
        {
          params: { date, roomId },
        }
      );

      console.log(`${service} availability response:`, response.data);

      setRoomAvailability((prev) => ({
        ...prev,
        [service]: {
          room: response.data.room,
          bookings: response.data.bookings,
          timeSlots: response.data.timeSlots,
        },
      }));
    } catch (error) {
      console.error(`Error fetching ${service} availability:`, error);
      console.error(`Error details:`, error.response?.data || error.message);
      setRoomAvailability((prev) => ({
        ...prev,
        [service]: { room: null, bookings: [], timeSlots: [] },
      }));
    } finally {
      setLoadingRoomAvailability(false);
    }
  };

  // Helper function to get slot date
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

  // Helper function to get blocked slots
  const getBlockedSlots = (service, dateStr, duration) => {
    const { bookings, timeSlots } = roomAvailability[service];

    return timeSlots.filter((slot) => {
      const slotStart = getSlotDate(dateStr, slot);
      if (!slotStart) return false;

      // For each hour in the duration, check if any hour overlaps with a booking
      for (let d = 0; d < duration; d++) {
        const checkStart = new Date(slotStart);
        checkStart.setHours(checkStart.getHours() + d);
        const checkEnd = new Date(checkStart);
        checkEnd.setHours(checkEnd.getHours() + 1);

        // Check for overlap with any booking
        const overlap = bookings.some((booking) => {
          const bookingStart = new Date(booking.startDateTime);
          const bookingEnd = new Date(booking.endDateTime);
          return checkStart < bookingEnd && checkEnd > bookingStart;
        });

        if (overlap) return true;
      }
      return false;
    });
  };

  // Fetch chair availability when cafe booking details change
  useEffect(() => {
    if (activeService === "cafe") {
      const { date, time, duration } = bookingData.cafe;
      fetchChairAvailability(date, time, duration);
    }
  }, [
    activeService,
    bookingData.cafe.date,
    bookingData.cafe.time,
    bookingData.cafe.duration,
  ]);

  // Fetch room availability when karaoke booking details change
  useEffect(() => {
    if (activeService === "karaoke") {
      const { roomId, startDateTime } = bookingData.karaoke;
      const date = startDateTime ? startDateTime.split("T")[0] : "";
      fetchRoomAvailability("karaoke", date, roomId);
    }
  }, [
    activeService,
    bookingData.karaoke.roomId,
    bookingData.karaoke.startDateTime,
  ]);

  // Fetch room availability when N64 booking details change
  useEffect(() => {
    if (activeService === "n64") {
      const { roomId, startDateTime } = bookingData.n64;
      const date = startDateTime ? startDateTime.split("T")[0] : "";
      fetchRoomAvailability("n64", date, roomId);
    }
  }, [activeService, bookingData.n64.roomId, bookingData.n64.startDateTime]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBookingDataChange = (service, field, value) => {
    setBookingData((prev) => ({
      ...prev,
      [service]: {
        ...prev[service],
        [field]: value,
      },
    }));
  };

  const calculatePrice = () => {
    const current = bookingData[activeService];

    switch (activeService) {
      case "karaoke":
        const karaokeRoom = resources.karaoke.find(
          (r) => r._id === current.roomId
        );
        return karaokeRoom
          ? karaokeRoom.pricePerHour * current.durationHours
          : 0;

      case "n64":
        const n64Room = resources.n64.find((r) => r._id === current.roomId);
        return n64Room ? n64Room.pricePerHour * current.durationHours : 0;

      case "cafe":
        return resources.cafe
          ? current.chairIds.length *
              resources.cafe.pricePerChairPerHour *
              current.duration
          : 0;

      default:
        return 0;
    }
  };

  // Function to create booking
  const createBooking = async (staffInfo) => {
    setLoading(true);
    setResult(null);

    // Check if all required fields are filled
    const requiredFields = {
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      ...(activeService === "karaoke" && {
        roomId: bookingData.karaoke.roomId,
        startDateTime: bookingData.karaoke.startDateTime,
      }),
      ...(activeService === "n64" && {
        roomId: bookingData.n64.roomId,
        startDateTime: bookingData.n64.startDateTime,
      }),
      ...(activeService === "cafe" && {
        chairIds: bookingData.cafe.chairIds,
        date: bookingData.cafe.date,
        time: bookingData.cafe.time,
      }),
    };

    // Check for missing required fields
    const missingFields = Object.entries(requiredFields).filter(
      ([key, value]) => {
        if (Array.isArray(value)) {
          return value.length === 0;
        }
        return !value || value.trim() === "";
      }
    );

    if (missingFields.length > 0) {
      setResult({
        success: false,
        message: `Missing required fields: ${missingFields
          .map(([key]) => key)
          .join(", ")}`,
      });
      return;
    }

    try {
      // Prepare payload based on service type
      let payload;

      if (activeService === "cafe") {
        // For cafe, ensure we send the correct data structure
        payload = {
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          customerDob: formData.customerDob,
          chairIds: bookingData.cafe.chairIds,
          date: bookingData.cafe.date,
          time: bookingData.cafe.time,
          duration: bookingData.cafe.duration,
          specialRequests: bookingData.cafe.specialRequests,
          status: bookingData.cafe.status, // Use selected status
          staffPin: staffInfo.pin,
        };
      } else {
        // For other services, use existing logic
        payload = {
          ...formData,
          ...bookingData[activeService],
          staffPin: staffInfo.pin,
        };
      }

      const response = await api.post(
        `/admin/bookings/${activeService}`,
        payload
      );

      setResult({
        success: true,
        message: response.data.message,
        booking: response.data.booking,
        userInfo: response.data.userInfo,
        staffInfo: response.data.staffInfo,
      });

      // Reset form
      setFormData({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        customerDob: "",
      });

      setBookingData((prev) => ({
        ...prev,
        [activeService]:
          activeService === "karaoke"
            ? {
                roomId: "",
                numberOfPeople: 1,
                startDateTime: "",
                durationHours: 1,
                status: "pending",
              }
            : activeService === "n64"
            ? {
                roomId: "",
                numberOfPeople: 1,
                startDateTime: "",
                durationHours: 1,
                status: "pending",
              }
            : {
                chairIds: [],
                date: "",
                time: "",
                duration: 1,
                specialRequests: "",
                status: "pending",
              },
      }));

      // Reset staff info after successful booking
      setStaffInfo(null);
    } catch (error) {
      console.error("Error creating booking:", error);
      setResult({
        success: false,
        message: error.response?.data?.message || "Failed to create booking",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // PIN is required for manual bookings
    if (!staffInfo) {
      setShowPinModal(true);
      return;
    }

    await createBooking(staffInfo);
  };

  const handlePinVerified = async (verifiedStaffInfo) => {
    setStaffInfo(verifiedStaffInfo);
    setBookingInProgress(true);

    try {
      await createBooking(verifiedStaffInfo);
      setShowPinModal(false);
      setBookingInProgress(false);
    } catch (error) {
      console.error("Error in createBooking:", error);
      setResult({
        success: false,
        message: `Error creating booking: ${error.message}`,
      });
      setShowPinModal(false);
      setBookingInProgress(false);
    }
  };

  const handleCustomerSubmit = (customerData) => {
    setFormData(customerData);
    setShowCustomerPopup(false);
  };

  if (loading && !resources.karaoke.length) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-2 sm:p-4 md:p-6 bg-gray-100 min-h-screen">
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8">
        Manual Booking
      </h1>

      {/* Staff Information Display */}
      {staffInfo && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg
                className="w-5 h-5 text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-blue-800 font-medium">
                Staff: {staffInfo.staffName}
              </span>
            </div>
            <button
              onClick={() => setStaffInfo(null)}
              className="text-blue-600 hover:text-blue-800 text-sm underline"
            >
              Change Staff
            </button>
          </div>
        </div>
      )}

      {/* PIN Requirement Notice */}
      {!staffInfo && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-yellow-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-yellow-800">
              Staff PIN required. Please enter your PIN before creating a
              booking.
            </span>
          </div>
        </div>
      )}

      {/* Service Selection */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xs sm:text-sm md:text-base font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-4">
          Select Service
        </h2>
        <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4">
          <ServiceTab
            service="karaoke"
            icon={<MdMusicNote size={20} />}
            label="Karaoke"
            isActive={activeService === "karaoke"}
            onClick={() => setActiveService("karaoke")}
          />
          <ServiceTab
            service="n64"
            icon={<MdVideogameAsset size={20} />}
            label="N64"
            isActive={activeService === "n64"}
            onClick={() => setActiveService("n64")}
          />
          <ServiceTab
            service="cafe"
            icon={<MdLocalCafe size={20} />}
            label="Cafe"
            isActive={activeService === "cafe"}
            onClick={() => setActiveService("cafe")}
          />
        </div>
      </div>

      {/* Status Selection */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xs sm:text-sm md:text-base font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-4">
          Payment Status
        </h2>
        <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="status"
              value="pending"
              checked={bookingData[activeService].status === "pending"}
              onChange={(e) =>
                handleBookingDataChange(activeService, "status", e.target.value)
              }
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-xs sm:text-sm text-gray-700">Not Paid</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="status"
              value="confirmed"
              checked={bookingData[activeService].status === "confirmed"}
              onChange={(e) =>
                handleBookingDataChange(activeService, "status", e.target.value)
              }
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-xs sm:text-sm text-gray-700">Paid</span>
          </label>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 sm:space-y-6 md:space-y-8"
      >
        {/* Customer Information */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
              Customer Information
            </h3>
            <button
              type="button"
              onClick={() => setShowCustomerPopup(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-md"
            >
              <MdPersonAdd size={20} />
              <span className="text-base font-medium">Customer Input</span>
            </button>
          </div>
          <CustomerInfoForm
            formData={formData}
            handleInputChange={handleInputChange}
          />
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6">
          <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-800 mb-3 sm:mb-4">
            {activeService.charAt(0).toUpperCase() + activeService.slice(1)}{" "}
            Booking Details
          </h3>

          {activeService === "karaoke" && (
            <KaraokeBookingForm
              bookingData={bookingData}
              resources={resources}
              roomAvailability={roomAvailability}
              loadingRoomAvailability={loadingRoomAvailability}
              handleBookingDataChange={handleBookingDataChange}
              getSlotDate={getSlotDate}
              getBlockedSlots={getBlockedSlots}
            />
          )}

          {activeService === "n64" && (
            <N64BookingForm
              bookingData={bookingData}
              resources={resources}
              roomAvailability={roomAvailability}
              loadingRoomAvailability={loadingRoomAvailability}
              handleBookingDataChange={handleBookingDataChange}
              getSlotDate={getSlotDate}
              getBlockedSlots={getBlockedSlots}
            />
          )}

          {activeService === "cafe" && resources.cafe && (
            <CafeBookingForm
              bookingData={bookingData}
              resources={resources}
              chairsWithAvailability={chairsWithAvailability}
              loadingChairs={loadingChairs}
              handleBookingDataChange={handleBookingDataChange}
            />
          )}

          {/* Price Display */}
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base md:text-lg font-semibold text-gray-700">
                <MdAttachMoney
                  size={16}
                  className="sm:w-5 sm:h-5 md:w-6 md:h-6"
                />
                <span>Total Price:</span>
              </span>
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">
                ${calculatePrice().toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || showPinModal}
            className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 bg-blue-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Creating Booking..."
              : showPinModal
              ? "Enter PIN Required"
              : staffInfo
              ? "Create Booking"
              : "Enter PIN & Create Booking"}
          </button>
        </div>
      </form>

      {/* Result Display */}
      {result && (
        <div
          className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg ${
            result.success
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          <div
            className={`text-sm sm:text-base font-semibold ${
              result.success ? "text-green-800" : "text-red-800"
            }`}
          >
            {result.success ? "✅ Success!" : "❌ Error"}
          </div>
          <p
            className={`mt-1 text-xs sm:text-sm ${
              result.success ? "text-green-700" : "text-red-700"
            }`}
          >
            {result.message}
          </p>

          {result.success && result.userInfo?.isNewUser && (
            <div className="mt-3 p-2 sm:p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-yellow-800 text-xs sm:text-sm font-medium">
                New User Created!
              </p>
              <p className="text-yellow-700 text-xs sm:text-sm">
                Temporary Password:{" "}
                <code className="bg-yellow-100 px-1 rounded text-xs">
                  {result.userInfo.tempPassword}
                </code>
              </p>
              <p className="text-yellow-600 text-xs mt-1">
                Please share this password with the customer securely.
              </p>
            </div>
          )}

          {result.success && result.staffInfo && (
            <div className="mt-3 p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-blue-800 text-xs sm:text-sm font-medium">
                Booking Created by Staff
              </p>
              <p className="text-blue-700 text-xs sm:text-sm">
                Staff Member: {result.staffInfo.staffName}
              </p>
            </div>
          )}
        </div>
      )}

      {/* PIN Input Modal */}
      <PinInputModal
        isOpen={showPinModal}
        onClose={() => !bookingInProgress && setShowPinModal(false)}
        onPinVerified={handlePinVerified}
        bookingInProgress={bookingInProgress}
      />

      {/* Customer Input Popup */}
      <CustomerInputPopup
        isOpen={showCustomerPopup}
        onClose={() => setShowCustomerPopup(false)}
        onCustomerSubmit={handleCustomerSubmit}
        initialData={formData}
      />
    </div>
  );
};

export default ManualBooking;
