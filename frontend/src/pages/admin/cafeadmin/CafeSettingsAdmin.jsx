import React, { useState, useEffect } from "react";
import api from "../../../utils/axios";

const CafeSettingsAdmin = () => {
  const [settings, setSettings] = useState({
    timeSlots: [],
    pricePerChairPerHour: 10,
    maxDuration: 8,
    openingTime: "14:00",
    closingTime: "23:00",
  });
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("Template 1");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    if (selectedTemplate) {
      fetchSettings();
    }
  }, [selectedTemplate]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/cafe/cafe-layout/templates");
      const templateNames = [
        ...new Set(response.data.templates.map((t) => t.templateName)),
      ];
      setTemplates(templateNames);
      if (
        templateNames.length > 0 &&
        !templateNames.includes(selectedTemplate)
      ) {
        setSelectedTemplate(templateNames[0]);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/admin/cafe/cafe-settings?templateName=${selectedTemplate}`
      );
      setSettings(response.data.settings);
    } catch (error) {
      console.error("Error fetching cafe settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setMessage("");

      await api.put("/admin/cafe/cafe-settings", {
        ...settings,
        templateName: selectedTemplate,
      });
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
        <div className="animate-spin rounded-full h-16 w-16 sm:h-24 sm:w-24 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Cafe Settings
          </h1>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm sm:text-base font-medium self-start sm:self-auto"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>

        {/* Template Selection */}
        <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">
            Template Settings
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              Select Template:
            </label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white text-sm"
            >
              {templates.map((template) => (
                <option key={template} value={template}>
                  {template}
                </option>
              ))}
            </select>
            <span className="text-xs sm:text-sm text-gray-500">
              Settings for: <strong>{selectedTemplate}</strong>
            </span>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-4 p-3 rounded text-sm ${
              message.includes("success")
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {message}
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Basic Settings */}
          <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">
              Basic Settings for {selectedTemplate}
            </h2>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Price per Chair per Hour ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={settings.pricePerChairPerHour}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      pricePerChairPerHour: parseFloat(e.target.value) || 0,
                    }))
                  }
                  placeholder="Enter price (e.g., 10.00 or 0 for free)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Time Slots Management */}
          <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
            <div className="mb-3 sm:mb-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Available Time Slots for {selectedTemplate}
                </h2>
                <button
                  onClick={addTimeSlot}
                  className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 self-start sm:self-auto"
                >
                  <span>+</span>
                  <span className="hidden xs:inline">Add Time Slot</span>
                  <span className="xs:hidden">Add</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                These are the available booking time slots for customers. Each
                slot represents a 1-hour booking window.
              </p>
            </div>

            <div className="space-y-2 sm:space-y-3 max-h-80 sm:max-h-96 overflow-y-auto">
              {settings.timeSlots.map((slot, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 border border-gray-200 rounded-md hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-xs sm:text-sm font-medium text-gray-700 min-w-[45px] sm:min-w-[60px]">
                      Slot {index + 1}:
                    </span>
                    <input
                      type="time"
                      value={slot}
                      onChange={(e) => updateTimeSlot(index, e.target.value)}
                      className="flex-1 sm:flex-none px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                      min="14:00"
                      max="23:00"
                    />
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
                    <span className="text-xs sm:text-sm font-semibold text-blue-600 min-w-[70px] sm:min-w-[80px]">
                      {formatTimeForDisplay(slot)}
                    </span>
                    <button
                      onClick={() => removeTimeSlot(index)}
                      className="px-2 sm:px-3 py-1 sm:py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-xs sm:text-sm flex items-center gap-1 font-medium"
                      title="Remove this time slot"
                    >
                      <span>×</span>
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {settings.timeSlots.length === 0 && (
              <div className="text-center py-6 sm:py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-gray-400 text-2xl sm:text-4xl mb-2">
                  ⏰
                </div>
                <p className="text-gray-500 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                  No time slots configured
                </p>
                <p className="text-gray-400 text-xs sm:text-sm px-2">
                  Click "Add Time Slot" above or "Generate Time Slots" to get
                  started
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Preview */}
        <div className="mt-6 sm:mt-8 bg-white shadow-md rounded-lg p-4 sm:p-6 text-gray-900">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">
            Preview for {selectedTemplate}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm text-gray-700 mb-4">
            <div className="p-3 bg-gray-50 rounded-md">
              <strong className="text-gray-900 block mb-1">
                Operating Hours:
              </strong>
              <span>
                {formatTimeForDisplay(settings.openingTime)} -{" "}
                {formatTimeForDisplay(settings.closingTime)}
              </span>
            </div>
            <div className="p-3 bg-gray-50 rounded-md">
              <strong className="text-gray-900 block mb-1">Pricing:</strong>
              <span>${settings.pricePerChairPerHour}/chair/hour</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-md sm:col-span-2 lg:col-span-1">
              <strong className="text-gray-900 block mb-1">
                Max Duration:
              </strong>
              <span>{settings.maxDuration} hours</span>
            </div>
          </div>

          <div className="text-gray-700">
            <strong className="text-gray-900 text-sm sm:text-base">
              Available Time Slots ({settings.timeSlots.length}):
            </strong>
            <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
              {settings.timeSlots.length > 0 ? (
                settings.timeSlots.map((slot, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs sm:text-sm font-medium"
                  >
                    {formatTimeForDisplay(slot)}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 text-xs sm:text-sm italic">
                  No time slots configured
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CafeSettingsAdmin;
