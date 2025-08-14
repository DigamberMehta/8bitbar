import React, { useState, useEffect } from "react";
import {
  MdAdd,
  MdEvent,
  MdPerson,
  MdPhone,
  MdEmail,
  MdAccessTime,
  MdLocationOn,
} from "react-icons/md";
import PinInputModal from "../../components/admin/PinInputModal";
import api from "../../utils/axios";

const ManualBooking = () => {
  const [activeService, setActiveService] = useState("karaoke");
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
      roomType: "mickey",
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
  const [showPinModal, setShowPinModal] = useState(false);
  const [staffInfo, setStaffInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [bookingInProgress, setBookingInProgress] = useState(false);

  // Fetch available rooms/options
  const [karaokeRooms, setKaraokeRooms] = useState([]);
  const [n64Rooms, setN64Rooms] = useState([]);
  const [cafeChairs, setCafeChairs] = useState([]);

  useEffect(() => {
    fetchAvailableOptions();
  }, []);

  const fetchAvailableOptions = async () => {
    try {
      // Fetch karaoke rooms
      const karaokeResponse = await api.get("/admin/karaoke/rooms");
      if (karaokeResponse.data.success) {
        setKaraokeRooms(karaokeResponse.data.rooms);
      }

      // Fetch N64 rooms
      const n64Response = await api.get("/admin/n64/rooms");
      if (n64Response.data.success) {
        setN64Rooms(n64Response.data.rooms);
      }

      // Fetch cafe chairs
      const cafeResponse = await api.get("/admin/cafe/chairs");
      if (cafeResponse.data.success) {
        setCafeChairs(cafeResponse.data.chairs);
      }
    } catch (error) {
      console.error("Error fetching available options:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

  const createBooking = async (staffInfo) => {
    console.log("🔍 createBooking called");
    console.log("📋 Form Data:", formData);
    console.log("📅 Booking Data:", bookingData[activeService]);
    console.log("👤 Staff:", staffInfo?.staffName || "None");
    console.log("🎯 Active Service:", activeService);

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

    console.log("🔍 Required fields check:", requiredFields);

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
      console.log("❌ Missing required fields:", missingFields);
      setResult({
        success: false,
        message: `Missing required fields: ${missingFields
          .map(([key]) => key)
          .join(", ")}`,
      });
      return;
    }

    console.log("✅ All required fields are filled");

    try {
      const payload = {
        ...formData,
        ...bookingData[activeService],
        staffPin: staffInfo.pin,
      };

      console.log("📤 Sending payload:", payload);
      console.log("🌐 API endpoint:", `/admin/bookings/${activeService}`);

      const response = await api.post(
        `/admin/bookings/${activeService}`,
        payload
      );

      console.log("✅ API response:", response.data);

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
                roomType: "mickey",
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

    console.log("🔍 handleSubmit called");
    console.log("📋 Form Data:", formData);
    console.log("📅 Booking Data:", bookingData[activeService]);
    console.log("👤 Staff:", staffInfo?.staffName || "None");

    // PIN is required for manual bookings
    if (!staffInfo) {
      console.log("❌ No staff info, showing PIN modal");
      setShowPinModal(true);
      return;
    }

    console.log("✅ Staff info found, proceeding with booking creation");
    await createBooking(staffInfo);
  };

  const handlePinVerified = async (verifiedStaffInfo) => {
    console.log(
      "🎯 handlePinVerified called with staff:",
      verifiedStaffInfo.staffName
    );
    setStaffInfo(verifiedStaffInfo);
    setBookingInProgress(true);
    console.log("✅ Staff info set, booking in progress");

    // Automatically create the booking after PIN verification
    console.log("🚀 Auto-creating booking...");
    console.log("📋 Current form data:", formData);
    console.log("📅 Current booking data:", bookingData[activeService]);

    try {
      await createBooking(verifiedStaffInfo);
      console.log("✅ createBooking completed successfully");
      // Close modal after successful booking creation
      setShowPinModal(false);
      setBookingInProgress(false);
    } catch (error) {
      console.error("❌ Error in createBooking:", error);
      setResult({
        success: false,
        message: `Error creating booking: ${error.message}`,
      });
      // Close modal even on error so user can see the error message
      setShowPinModal(false);
      setBookingInProgress(false);
    }
  };

  const serviceTabs = [
    {
      id: "karaoke",
      label: "Karaoke",
      icon: <MdEvent className="text-purple-500" size={20} />,
    },
    {
      id: "n64",
      label: "N64 Gaming",
      icon: <MdEvent className="text-blue-500" size={20} />,
    },
    {
      id: "cafe",
      label: "Cafe",
      icon: <MdEvent className="text-green-500" size={20} />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manual Booking</h1>
        <p className="text-gray-600 mt-1">
          Create manual bookings for customers. Staff PIN verification is
          required.
        </p>
      </div>

      {/* Service Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {serviceTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveService(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeService === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <MdPerson className="mr-2" />
                Customer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="customerName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="customerEmail"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Customer Email *
                  </label>
                  <input
                    type="email"
                    id="customerEmail"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="customerPhone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Customer Phone
                  </label>
                  <input
                    type="tel"
                    id="customerPhone"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="customerDob"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Customer Date of Birth
                  </label>
                  <input
                    type="date"
                    id="customerDob"
                    name="customerDob"
                    value={formData.customerDob}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Service-Specific Booking Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <MdEvent className="mr-2" />
                {activeService === "karaoke" && "Karaoke Booking Details"}
                {activeService === "n64" && "N64 Gaming Booking Details"}
                {activeService === "cafe" && "Cafe Booking Details"}
              </h3>

              {activeService === "karaoke" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="roomId"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Room *
                    </label>
                    <select
                      id="roomId"
                      value={bookingData.karaoke.roomId}
                      onChange={(e) =>
                        handleBookingDataChange(
                          "karaoke",
                          "roomId",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select a room</option>
                      {karaokeRooms.map((room) => (
                        <option key={room._id} value={room._id}>
                          {room.name} - {room.capacity} people
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="startDateTime"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Start Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      id="startDateTime"
                      value={bookingData.karaoke.startDateTime}
                      onChange={(e) =>
                        handleBookingDataChange(
                          "karaoke",
                          "startDateTime",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="numberOfPeople"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Number of People
                    </label>
                    <input
                      type="number"
                      id="numberOfPeople"
                      min="1"
                      value={bookingData.karaoke.numberOfPeople}
                      onChange={(e) =>
                        handleBookingDataChange(
                          "karaoke",
                          "numberOfPeople",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="durationHours"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Duration (hours)
                    </label>
                    <input
                      type="number"
                      id="durationHours"
                      min="1"
                      max="8"
                      value={bookingData.karaoke.durationHours}
                      onChange={(e) =>
                        handleBookingDataChange(
                          "karaoke",
                          "durationHours",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {activeService === "n64" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="n64RoomId"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Room *
                    </label>
                    <select
                      id="n64RoomId"
                      value={bookingData.n64.roomId}
                      onChange={(e) =>
                        handleBookingDataChange("n64", "roomId", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select a room</option>
                      {n64Rooms.map((room) => (
                        <option key={room._id} value={room._id}>
                          {room.name} - {room.roomType}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="n64StartDateTime"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Start Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      id="n64StartDateTime"
                      value={bookingData.n64.startDateTime}
                      onChange={(e) =>
                        handleBookingDataChange(
                          "n64",
                          "startDateTime",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="n64NumberOfPeople"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Number of People
                    </label>
                    <input
                      type="number"
                      id="n64NumberOfPeople"
                      min="1"
                      value={bookingData.n64.numberOfPeople}
                      onChange={(e) =>
                        handleBookingDataChange(
                          "n64",
                          "numberOfPeople",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="n64DurationHours"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Duration (hours)
                    </label>
                    <input
                      type="number"
                      id="n64DurationHours"
                      min="1"
                      max="8"
                      value={bookingData.n64.durationHours}
                      onChange={(e) =>
                        handleBookingDataChange(
                          "n64",
                          "durationHours",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {activeService === "cafe" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="cafeDate"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Date *
                    </label>
                    <input
                      type="date"
                      id="cafeDate"
                      value={bookingData.cafe.date}
                      onChange={(e) =>
                        handleBookingDataChange("cafe", "date", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="cafeTime"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Time *
                    </label>
                    <input
                      type="time"
                      id="cafeTime"
                      value={bookingData.cafe.time}
                      onChange={(e) =>
                        handleBookingDataChange("cafe", "time", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="cafeDuration"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Duration (hours)
                    </label>
                    <input
                      type="number"
                      id="cafeDuration"
                      min="1"
                      max="8"
                      value={bookingData.cafe.duration}
                      onChange={(e) =>
                        handleBookingDataChange(
                          "cafe",
                          "duration",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="cafeSpecialRequests"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Special Requests
                    </label>
                    <textarea
                      id="cafeSpecialRequests"
                      value={bookingData.cafe.specialRequests}
                      onChange={(e) =>
                        handleBookingDataChange(
                          "cafe",
                          "specialRequests",
                          e.target.value
                        )
                      }
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Any special requests or notes..."
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Staff Information Display */}
            {staffInfo && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="text-lg font-medium text-blue-900 mb-2 flex items-center">
                  <MdPerson className="mr-2" />
                  Staff Information
                </h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>
                    <strong>Name:</strong> {staffInfo.staffName}
                  </p>
                  <p>
                    <strong>PIN:</strong> {staffInfo.pin}
                  </p>
                  <p>
                    <strong>Admin Account:</strong> {staffInfo.adminName}
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading
                  ? "Creating Booking..."
                  : staffInfo
                  ? "Create Booking"
                  : "Verify PIN to Continue"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Result Display */}
      {result && (
        <div
          className={`p-4 rounded-lg ${
            result.success
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          <div
            className={`font-medium ${
              result.success ? "text-green-800" : "text-red-800"
            }`}
          >
            {result.success ? "✅ Success!" : "❌ Error"}
          </div>
          <div
            className={`text-sm mt-1 ${
              result.success ? "text-green-700" : "text-red-700"
            }`}
          >
            {result.message}
          </div>
          {result.success && result.staffInfo && (
            <div className="mt-2 text-sm text-green-700">
              <strong>Staff:</strong> {result.staffInfo.staffName} (PIN:{" "}
              {result.staffInfo.pin})
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
    </div>
  );
};

export default ManualBooking;
