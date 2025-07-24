import React, { useState, useEffect } from "react";
import api from "../../../utils/axios";
import { useNavigate } from "react-router-dom";

const N64RoomsAdmin = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/n64-rooms");
      setRooms(response.data.rooms || []);
    } catch (error) {
      console.error("Error fetching N64 rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">N64 Booths</h1>
        </div>

        <div className="space-y-6">
          {rooms.map((room) => (
            <div key={room._id} className="bg-white rounded-xl shadow-md overflow-hidden md:flex">
              <div className="md:w-48">
                <img
                  src={room.imageUrl || 'https://via.placeholder.com/150'}
                  alt={room.name}
                  className="w-full h-48 object-cover md:h-full"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold text-indigo-600">{room.name}</h2>
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => navigate(`/admin/n64-rooms/${room._id}/edit`)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md shadow-sm text-sm font-semibold"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{room.description}</p>
                  
                  <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Booth Type</dt>
                        <dd className="mt-1 text-sm text-gray-900 font-semibold">{room.roomType?.charAt(0).toUpperCase() + room.roomType?.slice(1)}</dd>
                    </div>
                     <div>
                        <dt className="text-sm font-medium text-gray-500">Capacity</dt>
                        <dd className="mt-1 text-sm text-gray-900">{room.maxPeople} people</dd>
                    </div>
                     <div>
                        <dt className="text-sm font-medium text-gray-500">Price</dt>
                        <dd className="mt-1 text-sm text-gray-900">${room.pricePerHour} / hour</dd>
                    </div>
                     <div>
                        <dt className="text-sm font-medium text-gray-500">Controllers</dt>
                        <dd className="mt-1 text-sm text-gray-900">{room.inclusions?.controllers}</dd>
                    </div>
                    <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Features</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                           {room.inclusions?.features?.join(', ') || 'N/A'}
                        </dd>
                    </div>
                  </dl>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500">Time Slots</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {room.timeSlots?.map((slot) => (
                      <span key={slot} className="px-2.5 py-1 text-xs font-semibold text-indigo-800 bg-indigo-100 rounded-full">
                        {slot}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default N64RoomsAdmin;