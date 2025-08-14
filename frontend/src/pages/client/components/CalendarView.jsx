import React, { useState, useEffect } from "react";
import api from "../../../utils/axios";
import FinanceCalendar from "../../../components/admin/FinanceCalendar";

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCalendarData();
  }, [currentDate]);

  const fetchCalendarData = async () => {
    setLoading(true);
    try {
      const startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );

      const response = await api.get("/admin/all-bookings/calendar", {
        params: {
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
        },
      });
      console.log("Calendar data received:", response.data.calendarData);
      setCalendarData(response.data.calendarData || []);
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Calendar View</h2>
      </div>

      {/* Calendar View */}
      <div className="bg-white">
        <FinanceCalendar
          events={calendarData}
          onEventClick={(event) => {
            console.log("Event clicked:", event);
            // You can add modal or detailed view here
          }}
          onMonthChange={(monthInfo) => {
            console.log("Month changed:", monthInfo);
            // Update date range if needed
          }}
        />
      </div>
    </div>
  );
};

export default CalendarView;
