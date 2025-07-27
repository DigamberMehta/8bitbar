import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../../utils/axios";

// Allowed time slots for selection
const ALLOWED_TIMES = [
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
  "10:00 PM",
];

// --- HELPER COMPONENTS (REFINED) ---

function MultiSelect({ options, selected, onChange, label }) {
  const toggle = (val) => {
    onChange(
      selected.includes(val)
        ? selected.filter((v) => v !== val)
        : [...selected, val]
    );
  };
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-3">
        {options.map((opt) => (
          <button
            type="button"
            key={opt}
            className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              selected.includes(opt)
                ? "bg-indigo-600 text-white border-transparent"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => toggle(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function FeaturesInput({ features, setFeatures }) {
  const addFeature = () => setFeatures([...features, ""]);
  const updateFeature = (i, val) =>
    setFeatures(features.map((f, idx) => (idx === i ? val : f)));
  const removeFeature = (i) =>
    setFeatures(features.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Features
      </label>
      {features.map((feature, i) => (
        <div key={i} className="flex items-center gap-3">
          <input
            type="text"
            placeholder={`Feature ${i + 1}`}
            value={feature}
            onChange={(e) => updateFeature(i, e.target.value)}
            // FIX: Added more padding and explicit text color
            className="px-3 py-2 mt-1 block w-full text-gray-900 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <button
            type="button"
            onClick={() => removeFeature(i)}
            className="text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Remove feature"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addFeature}
        className="mt-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        + Add Feature
      </button>
    </div>
  );
}

const FormInput = ({ label, id, name, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      id={id}
      name={name || id}
      {...props}
      // FIX: Added more padding and explicit text color
      className="px-3 py-2 mt-1 block w-full text-gray-900 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
    />
  </div>
);

const FormTextarea = ({ label, id, name, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <textarea
      id={id}
      name={name || id}
      {...props}
      // FIX: Added more padding and explicit text color
      className="px-3 py-2 mt-1 block w-full text-gray-900 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
    />
  </div>
);

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// --- MAIN COMPONENT ---

const KaraokeRoomEditAdmin = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const id = query.get("id");
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    maxPeople: "",
    pricePerHour: "",
    description: "",
    microphones: "",
    imageUrl: "",
  });
  const [featuresArr, setFeaturesArr] = useState([]);
  const [timeSlotsArr, setTimeSlotsArr] = useState([]);
  const [error, setError] = useState("");

  // Core logic for fetching and submitting data remains unchanged
  useEffect(() => {
    async function fetchRoom() {
      try {
        setLoading(true);
        const res = await api.get(`/admin/karaoke/karaoke-rooms`);
        const room = res.data.rooms.find((r) => r._id === id);
        if (!room) {
          setError("Room not found");
          setLoading(false);
          return;
        }
        setFormData({
          name: room.name,
          maxPeople: room.maxPeople.toString(),
          pricePerHour: room.pricePerHour.toString(),
          description: room.description || "",
          microphones: room.inclusions?.microphones?.toString() || "4",
          imageUrl: room.imageUrl || "",
        });
        setFeaturesArr(room.inclusions?.features || []);
        setTimeSlotsArr(room.timeSlots || []);
      } catch (err) {
        setError("Failed to fetch room data");
      } finally {
        setLoading(false);
      }
    }
    fetchRoom();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/karaoke/karaoke-rooms/${id}`, {
        name: formData.name,
        description: formData.description,
        pricePerHour: formData.pricePerHour,
        capacity: formData.maxPeople,
        isAvailable: true, // Assuming availability is managed elsewhere or not needed here
        inclusions: {
          microphones: parseInt(formData.microphones) || 4,
          speakers: parseInt(formData.speakers) || 2,
          tv: parseInt(formData.tv) || 1,
          seating: parseInt(formData.seating) || 8,
        },
        timeSlots: timeSlotsArr,
      });

      navigate("/admin/karaoke/karaoke-rooms");
    } catch (err) {
      setError("Failed to update room");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (error) return <div className="text-red-600 text-center p-8">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit}>
        <div className="bg-white shadow-lg sm:rounded-xl md:w-full">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
              Edit Karaoke Room
            </h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6 space-y-8">
            {/* --- GENERAL INFO SECTION --- */}
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                General Information
              </h3>
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <FormInput
                    label="Room Name"
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="sm:col-span-3">
                  <FormInput
                    label="Capacity (Max People)"
                    id="maxPeople"
                    type="number"
                    value={formData.maxPeople}
                    onChange={(e) =>
                      setFormData({ ...formData, maxPeople: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="sm:col-span-6">
                  <FormTextarea
                    label="Description"
                    id="description"
                    rows="3"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* --- PRICING & INCLUSIONS SECTION --- */}
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Pricing & Inclusions
              </h3>
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <FormInput
                    label="Price Per Hour ($)"
                    id="pricePerHour"
                    type="number"
                    step="0.01"
                    value={formData.pricePerHour}
                    onChange={(e) =>
                      setFormData({ ...formData, pricePerHour: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="sm:col-span-3">
                  <FormInput
                    label="Microphones"
                    id="microphones"
                    type="number"
                    value={formData.microphones}
                    onChange={(e) =>
                      setFormData({ ...formData, microphones: e.target.value })
                    }
                  />
                </div>
                <div className="sm:col-span-6">
                  <FeaturesInput
                    features={featuresArr}
                    setFeatures={setFeaturesArr}
                  />
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* --- AVAILABILITY & IMAGE SECTION --- */}
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Availability & Image
              </h3>
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <MultiSelect
                    options={ALLOWED_TIMES}
                    selected={timeSlotsArr}
                    onChange={setTimeSlotsArr}
                    label="Available Time Slots"
                  />
                </div>
                <div className="sm:col-span-6">
                  <FormInput
                    label="Image URL"
                    id="imageUrl"
                    type="text"
                    // This is a controlled input. Its value is tied to the state and
                    // the onChange handler updates the state, making it fully editable.
                    value={formData.imageUrl || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                  />
                  {formData.imageUrl && (
                    <img
                      src={formData.imageUrl}
                      alt="Room preview"
                      className="mt-4 h-40 w-auto rounded-lg object-cover"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* --- ACTION BUTTONS --- */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-xl">
            <button
              type="submit"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-6 py-3 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/karaoke/karaoke-rooms")}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-6 py-3 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default KaraokeRoomEditAdmin;
