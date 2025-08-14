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
            handleBookingDataChange("n64", "roomId", e.target.value);
            handleBookingDataChange("n64", "startDateTime", "");
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

      {/* Duration Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <InputField
          label="Duration"
          icon={<Clock size={16} />}
          type="number"
          min="1"
          max="4"
          value={bookingData.n64.durationHours}
          onChange={(e) =>
            handleBookingDataChange(
              "n64",
              "durationHours",
              parseInt(e.target.value)
            )
          }
          required
        />
      </div>

      {/* Date Selection */}
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

        <div className="flex items-end">
          <p className="text-sm text-gray-500">
            Select a date to see available time slots
          </p>
        </div>
      </div>

      {/* Time Slot Selection */}
      {bookingData.n64.roomId && bookingData.n64.startDateTime && (
        <div className="space-y-2 sm:space-y-3">
          <h4 className="text-sm sm:text-base font-medium text-gray-700">
            Available Time Slots
          </h4>
          <TimeSlotSelector
            service="n64"
            date={bookingData.n64.startDateTime.split("T")[0]}
            duration={bookingData.n64.durationHours}
            roomAvailability={roomAvailability}
            loading={loadingRoomAvailability}
            getSlotDate={getSlotDate}
            getBlockedSlots={getBlockedSlots}
            selectedTime={
              bookingData.n64.startDateTime &&
              bookingData.n64.startDateTime !== "" &&
              !bookingData.n64.startDateTime.endsWith("T00:00")
                ? new Date(bookingData.n64.startDateTime)
                    .toTimeString()
                    .slice(0, 5)
                : ""
            }
            onTimeSelect={(time) => {
              const date = bookingData.n64.startDateTime.split("T")[0];
              const [hour, minute] = time.split(":");
              const dateTime = new Date(date);
              dateTime.setHours(parseInt(hour), parseInt(minute), 0, 0);
              handleBookingDataChange(
                "n64",
                "startDateTime",
                dateTime.toISOString()
              );
            }}
          />
        </div>
      )}

      {/* Room Information */}
      {roomAvailability.n64.room && (
        <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm sm:text-base font-medium text-blue-800 mb-2">
            Room Information
          </h4>
          <div className="text-sm text-blue-700">
            <p>Room: {roomAvailability.n64.room.name}</p>
            <p>Price: ${roomAvailability.n64.room.pricePerHour}/hour</p>
            <p>Max Capacity: {roomAvailability.n64.room.maxPeople} people</p>
            <p>Type: {roomAvailability.n64.room.roomType}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default N64BookingForm;
