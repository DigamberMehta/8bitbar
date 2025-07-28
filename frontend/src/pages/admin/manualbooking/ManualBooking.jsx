import React, { useState, useEffect } from "react";
import api from "../../../utils/axios";
import {
  MdMusicNote,
  MdVideogameAsset,
  MdLocalCafe,
  MdAttachMoney,
} from "react-icons/md";
import { ServiceTab, CustomerInfoForm } from "./FormComponents";
import KaraokeBookingForm from "./KaraokeBookingForm";
import N64BookingForm from "./N64BookingForm";
import CafeBookingForm from "./CafeBookingForm";

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
    },
    n64: {
      roomId: "",
      roomType: "mickey",
      numberOfPeople: 1,
      startDateTime: "",
      durationHours: 1,
    },
    cafe: {
      chairIds: [],
      date: "",
      time: "",
      duration: 1,
      specialRequests: "",
    },
  });
  const [result, setResult] = useState(null);

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
      const response = await api.get(
        `/admin/bookings/${service}/availability`,
        {
          params: { date, roomId },
        }
      );
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setResult(null);

      const payload = {
        ...formData,
        ...bookingData[activeService],
      };

      const response = await api.post(
        `/admin/bookings/${activeService}`,
        payload
      );

      setResult({
        success: true,
        message: response.data.message,
        booking: response.data.booking,
        userInfo: response.data.userInfo,
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
              }
            : activeService === "n64"
            ? {
                roomId: "",
                roomType: "mickey",
                numberOfPeople: 1,
                startDateTime: "",
                durationHours: 1,
              }
            : {
                chairIds: [],
                date: "",
                time: "",
                duration: 1,
                specialRequests: "",
              },
      }));
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
    <div className="p-2 sm:p-4 md:p-6 bg-gray-100 min-h-screen">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8">Manual Booking</h1>

      {/* Service Selection */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-4">
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

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 md:space-y-8">
        {/* Customer Information */}
        <CustomerInfoForm
          formData={formData}
          handleInputChange={handleInputChange}
        />

        {/* Booking Details */}
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6">
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
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
                <MdAttachMoney size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
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
            disabled={loading}
            className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 bg-blue-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Booking..." : "Create Booking"}
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
              <p className="text-yellow-800 text-xs sm:text-sm font-medium">New User Created!</p>
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
        </div>
      )}
    </div>
  );
};

export default ManualBooking;
