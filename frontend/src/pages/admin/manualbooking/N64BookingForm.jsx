import React from "react";
import { Gamepad2, Users, Calendar, Clock } from "lucide-react";
import { InputField, SelectField } from "./FormComponents";
import TimeSlotSelector from "./TimeSlotSelector";

const N64BookingForm = ({
  bookingData,
  resources,
  roomAvailability,
  loadingRoomAvailability,
  handleBookingDataChange,
  getSlotDate,
  getBlockedSlots,
}) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Room and Basic Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <SelectField
          label="Room"
          icon={<Gamepad2 size={16} />}
          value={bookingData.n64.roomId}
          onChange={(e) => {
            const selectedRoom = resources.n64.find(
              (r) => r._id === e.target.value
            );
            handleBookingDataChange("n64", "roomId", e.target.value);
            handleBookingDataChange("n64", "startDateTime", "");
            if (selectedRoom) {
              handleBookingDataChange("n64", "roomType", selectedRoom.roomType);
            }
          }}
          required
        >
          <option value="">Select Room</option>
          {resources.n64.map((room) => (
            <option key={room._id} value={room._id}>
              {room.name} - ${room.pricePerHour}/hr (Max: {room.maxPeople})
            </option>
          ))}
        </SelectField>

        <InputField
          label="Number of People"
          icon={<Users size={16} />}
          type="number"
          min="1"
          max="4"
          value={bookingData.n64.numberOfPeople}
          onChange={(e) =>
            handleBookingDataChange(
              "n64",
              "numberOfPeople",
              parseInt(e.target.value)
            )
          }
          required
        />
      </div>

      {/* Date and Duration Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <InputField
          label="Date"
          icon={<Calendar size={16} />}
          type="date"
          value={
            bookingData.n64.startDateTime
              ? bookingData.n64.startDateTime.split("T")[0]
              : ""
          }
          onChange={(e) => {
            const date = e.target.value;
            handleBookingDataChange(
              "n64",
              "startDateTime",
              date ? `${date}T00:00` : ""
            );
          }}
          min={new Date().toISOString().split("T")[0]}
          required
        />

        <SelectField
          label="Duration"
          icon={<Clock size={16} />}
          value={bookingData.n64.durationHours}
          onChange={(e) =>
            handleBookingDataChange(
              "n64",
              "durationHours",
              parseInt(e.target.value)
            )
          }
          required
        >
          {Array.from({ length: 4 }, (_, i) => i + 1).map((num) => (
            <option key={num} value={num}>
              {num} {num === 1 ? "hour" : "hours"}
            </option>
          ))}
        </SelectField>
      </div>

      {/* Time Slot Selection */}
      {bookingData.n64.roomId && bookingData.n64.startDateTime && (
        <div className="space-y-2 sm:space-y-3">
          <label className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm font-medium text-gray-700">
            <Clock size={14} className="sm:w-4 sm:h-4" />
            <span>Select Start Time</span>
          </label>

          <TimeSlotSelector
            timeSlots={roomAvailability.n64.timeSlots}
            blockedSlots={(() => {
              const date = bookingData.n64.startDateTime.split("T")[0];
              return getBlockedSlots(
                "n64",
                date,
                bookingData.n64.durationHours
              );
            })()}
            selectedTime={
              bookingData.n64.startDateTime.includes("T")
                ? bookingData.n64.startDateTime.split("T")[1]
                : ""
            }
            date={bookingData.n64.startDateTime.split("T")[0]}
            onTimeSelect={(dateTime) =>
              handleBookingDataChange("n64", "startDateTime", dateTime)
            }
            getSlotDate={getSlotDate}
            loading={loadingRoomAvailability}
          />
        </div>
      )}
    </div>
  );
};

export default N64BookingForm;
