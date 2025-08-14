import React from "react";
import { Music, Users, Calendar, Clock } from "lucide-react";
import { InputField, SelectField } from "./FormComponents";
import TimeSlotSelector from "./TimeSlotSelector";

const KaraokeBookingForm = ({
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
          icon={<Music size={16} />}
          value={bookingData.karaoke.roomId}
          onChange={(e) => {
            handleBookingDataChange("karaoke", "roomId", e.target.value);
            handleBookingDataChange("karaoke", "startDateTime", "");
          }}
          required
        >
          <option value="">Select Room</option>
          {resources.karaoke.map((room) => (
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
          value={bookingData.karaoke.numberOfPeople}
          onChange={(e) =>
            handleBookingDataChange(
              "karaoke",
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
            bookingData.karaoke.startDateTime
              ? bookingData.karaoke.startDateTime.split("T")[0]
              : ""
          }
          onChange={(e) => {
            const date = e.target.value;
            handleBookingDataChange(
              "karaoke",
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
          value={bookingData.karaoke.durationHours}
          onChange={(e) =>
            handleBookingDataChange(
              "karaoke",
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
      {bookingData.karaoke.roomId && bookingData.karaoke.startDateTime && (
        <div className="space-y-2 sm:space-y-3">
          <h4 className="text-sm sm:text-base font-medium text-gray-700">
            Available Time Slots
          </h4>
          <TimeSlotSelector
            service="karaoke"
            date={bookingData.karaoke.startDateTime.split("T")[0]}
            duration={bookingData.karaoke.durationHours}
            roomAvailability={roomAvailability}
            loading={loadingRoomAvailability}
            getSlotDate={getSlotDate}
            getBlockedSlots={getBlockedSlots}
            selectedTime={
              bookingData.karaoke.startDateTime &&
              bookingData.karaoke.startDateTime !== "" &&
              !bookingData.karaoke.startDateTime.endsWith("T00:00")
                ? new Date(bookingData.karaoke.startDateTime)
                    .toTimeString()
                    .slice(0, 5)
                : ""
            }
            onTimeSelect={(time) => {
              const date = bookingData.karaoke.startDateTime.split("T")[0];
              const [hour, minute] = time.split(":");
              const dateTime = new Date(date);
              dateTime.setHours(parseInt(hour), parseInt(minute), 0, 0);
              handleBookingDataChange(
                "karaoke",
                "startDateTime",
                dateTime.toISOString()
              );
            }}
          />
        </div>
      )}

      {/* Room Information */}
      {roomAvailability.karaoke.room && (
        <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm sm:text-base font-medium text-blue-800 mb-2">
            Room Information
          </h4>
          <div className="text-sm text-blue-700">
            <p>Room: {roomAvailability.karaoke.room.name}</p>
            <p>Price: ${roomAvailability.karaoke.room.pricePerHour}/hour</p>
            <p>
              Max Capacity: {roomAvailability.karaoke.room.maxPeople} people
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default KaraokeBookingForm;
