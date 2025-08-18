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
          onClick={(e) => e.target.showPicker()}
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
          <label className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm font-medium text-gray-700">
            <Clock size={14} className="sm:w-4 sm:h-4" />
            <span>Select Start Time</span>
          </label>

          <TimeSlotSelector
            timeSlots={roomAvailability.karaoke.timeSlots}
            blockedSlots={(() => {
              const date = bookingData.karaoke.startDateTime.split("T")[0];
              return getBlockedSlots(
                "karaoke",
                date,
                bookingData.karaoke.durationHours
              );
            })()}
            selectedTime={
              bookingData.karaoke.startDateTime.includes("T")
                ? bookingData.karaoke.startDateTime.split("T")[1]
                : ""
            }
            date={bookingData.karaoke.startDateTime.split("T")[0]}
            onTimeSelect={(dateTime) =>
              handleBookingDataChange("karaoke", "startDateTime", dateTime)
            }
            getSlotDate={getSlotDate}
            loading={loadingRoomAvailability}
          />
        </div>
      )}
    </div>
  );
};

export default KaraokeBookingForm;
