import React, { useState, useEffect } from "react";
import axios from "../../../utils/axios";

const CafeSettingsAdmin = () => {
  const [settings, setSettings] = useState({
    timeSlots: [],
    pricePerChairPerHour: 10,
    maxDuration: 8,
    openingTime: "14:00",
    closingTime: "23:00",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/admin/cafe-settings");
      setSettings(response.data.settings);
    } catch (error) {
      console.error("Error fetching cafe settings:", error);
      setMessage("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setMessage("");

      await axios.put("/admin/cafe-settings", settings);
      setMessage("Settings saved successfully!");

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error saving cafe settings:", error);
      setMessage("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    const startHour = parseInt(settings.openingTime.split(":")[0]);
    const endHour = parseInt(settings.closingTime.split(":")[0]);

    for (let hour = startHour; hour <= endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
    }

    setSettings((prev) => ({ ...prev, timeSlots: slots }));
  };

  const addTimeSlot = () => {
    // Find the next available hour after the last slot
    const sortedSlots = settings.timeSlots.sort();
    const lastSlot =
      sortedSlots.length > 0 ? sortedSlots[sortedSlots.length - 1] : "13:00";

    const lastHour = parseInt(lastSlot.split(":")[0]);
    const nextHour = Math.min(lastHour + 1, 23); // Don't go past 11 PM
    const newSlot = `${nextHour.toString().padStart(2, "0")}:00`;

    // Only add if it doesn't already exist
    if (!settings.timeSlots.includes(newSlot)) {
      setSettings((prev) => ({
        ...prev,
        timeSlots: [...prev.timeSlots, newSlot].sort(),
      }));
    } else {
      // If the next hour exists, try to find the first missing hour
      for (let hour = 14; hour <= 23; hour++) {
        const testSlot = `${hour.toString().padStart(2, "0")}:00`;
        if (!settings.timeSlots.includes(testSlot)) {
          setSettings((prev) => ({
            ...prev,
            timeSlots: [...prev.timeSlots, testSlot].sort(),
          }));
          break;
        }
      }
    }
  };

  const removeTimeSlot = (index) => {
    setSettings((prev) => ({
      ...prev,
      timeSlots: prev.timeSlots.filter((_, i) => i !== index),
    }));
  };

  const updateTimeSlot = (index, value) => {
    setSettings((prev) => ({
      ...prev,
      timeSlots: prev.timeSlots
        .map((slot, i) => (i === index ? value : slot))
        .sort(),
    }));
  };

  const formatTimeForDisplay = (timeString) => {
    const hour = parseInt(timeString.split(":")[0]);
    return hour > 12
      ? `${hour - 12}:00 PM`
      : hour === 12
      ? "12:00 PM"
      : `${hour}:00 AM`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Cafe Settings</h1>
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {message && (
        <div
          className={`mb-4 p-3 rounded ${
            message.includes("success")
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Settings */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Settings</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price per Chair per Hour ($)
              </label>
              <input
                type="number"
                min="1"
                step="0.01"
                value={settings.pricePerChairPerHour}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    pricePerChairPerHour: parseFloat(e.target.value) || 1,
                  }))
                }
                placeholder="Enter price (e.g., 10.00)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Duration (hours)
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={settings.maxDuration}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    maxDuration: parseInt(e.target.value) || 1,
                  }))
                }
                placeholder="Enter max hours (e.g., 8)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opening Time
                </label>
                <input
                  type="time"
                  value={settings.openingTime}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      openingTime: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Closing Time
                </label>
                <input
                  type="time"
                  value={settings.closingTime}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      closingTime: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              onClick={generateTimeSlots}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Generate Time Slots from Opening Hours
            </button>
          </div>
        </div>

        {/* Time Slots Management */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">Available Time Slots</h2>
              <button
                onClick={addTimeSlot}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
              >
                <span>+</span>
                Add Time Slot
              </button>
            </div>
            <p className="text-sm text-gray-600">
              These are the available booking time slots for customers. Each
              slot represents a 1-hour booking window.
            </p>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {settings.timeSlots.map((slot, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-md hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-sm font-medium text-gray-700 min-w-[60px]">
                    Slot {index + 1}:
                  </span>
                  <input
                    type="time"
                    value={slot}
                    onChange={(e) => updateTimeSlot(index, e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="14:00"
                    max="23:00"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-blue-600 min-w-[80px]">
                    {formatTimeForDisplay(slot)}
                  </span>
                  <button
                    onClick={() => removeTimeSlot(index)}
                    className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm flex items-center gap-1"
                    title="Remove this time slot"
                  >
                    <span>×</span>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {settings.timeSlots.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-gray-400 text-4xl mb-2">⏰</div>
              <p className="text-gray-500 font-medium mb-2">
                No time slots configured
              </p>
              <p className="text-gray-400 text-sm">
                Click "Add Time Slot" above or "Generate Time Slots" to get
                started
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Preview */}
      <div className="mt-8 bg-white shadow-md rounded-lg p-6 text-gray-900">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Preview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
          <div>
            <strong>Operating Hours:</strong>
            <br />
            {formatTimeForDisplay(settings.openingTime)} -{" "}
            {formatTimeForDisplay(settings.closingTime)}
          </div>
          <div>
            <strong>Pricing:</strong>
            <br />${settings.pricePerChairPerHour}/chair/hour
          </div>
          <div>
            <strong>Max Duration:</strong>
            <br />
            {settings.maxDuration} hours
          </div>
        </div>

        <div className="mt-4 text-gray-700">
          <strong className="text-gray-900">
            Available Time Slots ({settings.timeSlots.length}):
          </strong>
          <div className="flex flex-wrap gap-2 mt-2">
            {settings.timeSlots.map((slot, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
              >
                {formatTimeForDisplay(slot)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CafeSettingsAdmin;
