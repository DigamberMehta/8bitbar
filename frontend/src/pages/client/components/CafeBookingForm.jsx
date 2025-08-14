import React from "react";
import { Coffee, Users, Calendar, Clock, MessageSquare } from "lucide-react";
import { InputField, SelectField } from "./FormComponents";

const CafeBookingForm = ({
  bookingData,
  resources,
  chairsWithAvailability,
  loadingChairs,
  handleBookingDataChange,
}) => {
  const handleChairToggle = (chairId) => {
    const currentChairs = bookingData.cafe.chairIds;
    const newChairs = currentChairs.includes(chairId)
      ? currentChairs.filter((id) => id !== chairId)
      : [...currentChairs, chairId];

    handleBookingDataChange("cafe", "chairIds", newChairs);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Date and Time Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <InputField
          label="Date"
          icon={<Calendar size={16} />}
          type="date"
          value={bookingData.cafe.date}
          onChange={(e) =>
            handleBookingDataChange("cafe", "date", e.target.value)
          }
          min={new Date().toISOString().split("T")[0]}
          required
        />

        <SelectField
          label="Time"
          icon={<Clock size={16} />}
          value={bookingData.cafe.time}
          onChange={(e) =>
            handleBookingDataChange("cafe", "time", e.target.value)
          }
          required
        >
          <option value="">Select Time</option>
          <option value="09:00">9:00 AM</option>
          <option value="10:00">10:00 AM</option>
          <option value="11:00">11:00 AM</option>
          <option value="12:00">12:00 PM</option>
          <option value="13:00">1:00 PM</option>
          <option value="14:00">2:00 PM</option>
          <option value="15:00">3:00 PM</option>
          <option value="16:00">4:00 PM</option>
          <option value="17:00">5:00 PM</option>
          <option value="18:00">6:00 PM</option>
          <option value="19:00">7:00 PM</option>
          <option value="20:00">8:00 PM</option>
        </SelectField>
      </div>

      {/* Duration and Number of People */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <InputField
          label="Duration (hours)"
          icon={<Clock size={16} />}
          type="number"
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
          required
        />

        <div className="flex items-end">
          <p className="text-sm text-gray-500">
            Price per chair: ${resources.cafe?.pricePerChairPerHour || 0}/hour
          </p>
        </div>
      </div>

      {/* Chair Selection */}
      {bookingData.cafe.date && bookingData.cafe.time && (
        <div className="space-y-3">
          <h4 className="text-sm sm:text-base font-medium text-gray-700">
            Available Chairs
          </h4>

          {loadingChairs ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          ) : chairsWithAvailability.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {chairsWithAvailability.map((chair) => (
                <button
                  key={chair._id}
                  type="button"
                  onClick={() => handleChairToggle(chair._id)}
                  className={`p-3 border-2 rounded-lg text-center transition-colors ${
                    bookingData.cafe.chairIds.includes(chair._id)
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                  }`}
                >
                  <div className="text-sm font-medium">Chair {chair.name}</div>
                  <div className="text-xs text-gray-500">
                    ${resources.cafe?.pricePerChairPerHour || 0}/hr
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No chairs available for the selected date and time.
            </div>
          )}
        </div>
      )}

      {/* Special Requests */}
      <div className="space-y-2">
        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
          <MessageSquare size={16} className="text-gray-500" />
          <span>Special Requests</span>
        </label>
        <textarea
          value={bookingData.cafe.specialRequests}
          onChange={(e) =>
            handleBookingDataChange("cafe", "specialRequests", e.target.value)
          }
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 text-sm"
          placeholder="Any special requests or notes..."
        />
      </div>

      {/* Selected Chairs Summary */}
      {bookingData.cafe.chairIds.length > 0 && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="text-sm font-medium text-green-800 mb-2">
            Selected Chairs
          </h4>
          <div className="text-sm text-green-700">
            <p>
              {bookingData.cafe.chairIds.length} chair(s) selected for{" "}
              {bookingData.cafe.duration} hour(s)
            </p>
            <p className="mt-1">
              Total: $
              {(
                bookingData.cafe.chairIds.length *
                (resources.cafe?.pricePerChairPerHour || 0) *
                bookingData.cafe.duration
              ).toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CafeBookingForm;
