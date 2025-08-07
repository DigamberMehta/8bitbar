import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./FinanceCalendar.css";

const FinanceCalendar = ({ events, onEventClick }) => {
  const getEventColor = (serviceType) => {
    switch (serviceType) {
      case "karaoke":
        return "#8B5CF6"; // Purple
      case "n64":
        return "#3B82F6"; // Blue
      case "cafe":
        return "#10B981"; // Green
      default:
        return "#6B7280"; // Gray
    }
  };

  const formatEvents = (events) => {
    return events.map((event) => ({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      backgroundColor: getEventColor(event.serviceType),
      borderColor: getEventColor(event.serviceType),
      textColor: "#FFFFFF",
      extendedProps: {
        serviceType: event.serviceType,
        status: event.status,
        revenue: event.revenue,
        roomName: event.roomName,
        customerName: event.customerName,
        customerEmail: event.customerEmail,
      },
    }));
  };

  const handleEventClick = (clickInfo) => {
    if (onEventClick) {
      onEventClick(clickInfo.event);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Booking Calendar
        </h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-purple-500"></div>
            <span className="text-gray-900">Karaoke</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500"></div>
            <span className="text-gray-900">N64</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500"></div>
            <span className="text-gray-900">Cafe</span>
          </div>
        </div>
      </div>
      <div className="h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px]">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          initialView="dayGridMonth"
          editable={false}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={formatEvents(events)}
          eventClick={handleEventClick}
          height="100%"
          eventDisplay="block"
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }}
          // Responsive settings
          aspectRatio={1.35}
          dayCellContent={(arg) => (
            <div className="text-xs sm:text-sm md:text-base">
              {arg.dayNumberText}
            </div>
          )}
          // Mobile-friendly toolbar
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: "dayGridMonth,timeGridWeek",
          }}
        />
      </div>
    </div>
  );
};

export default FinanceCalendar;
