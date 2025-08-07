import KaraokeBooking from "../models/KaraokeBooking.js";
import N64Booking from "../models/N64Booking.js";
import CafeBooking from "../models/CafeBooking.js";

const AllBookingsController = {
  // Get all bookings across all services with filtering
  getAllBookings: async (req, res) => {
    try {
      const {
        serviceType = "all",
        status = "all",
        startDate,
        endDate,
        page = 1,
        limit = 50,
      } = req.query;

      const skip = (page - 1) * limit;
      const filter = {};

      // Add status filter if not "all"
      if (status !== "all") {
        filter.status = status;
      }

      let bookings = [];

      // Fetch bookings based on service type
      if (serviceType === "all" || serviceType === "karaoke") {
        const karaokeFilter = { ...filter };
        if (startDate && endDate) {
          karaokeFilter.startDateTime = {
            $gte: new Date(startDate),
            $lte: new Date(endDate + "T23:59:59.999Z"),
          };
        }

        const karaokeBookings = await KaraokeBooking.find(karaokeFilter)
          .populate("roomId", "name")
          .sort({ startDateTime: -1 })
          .skip(skip)
          .limit(parseInt(limit));

        bookings.push(
          ...karaokeBookings.map((booking) => ({
            ...booking.toObject(),
            serviceType: "karaoke",
            roomName: booking.roomId?.name || "Unknown Room",
            bookingDate: booking.startDateTime, // Map to consistent field name
            amount: booking.totalPrice || 0, // Map price field
          }))
        );
      }

      if (serviceType === "all" || serviceType === "n64") {
        const n64Filter = { ...filter };
        if (startDate && endDate) {
          n64Filter.startDateTime = {
            $gte: new Date(startDate),
            $lte: new Date(endDate + "T23:59:59.999Z"),
          };
        }

        const n64Bookings = await N64Booking.find(n64Filter)
          .populate("roomId", "name")
          .sort({ startDateTime: -1 })
          .skip(skip)
          .limit(parseInt(limit));

        bookings.push(
          ...n64Bookings.map((booking) => ({
            ...booking.toObject(),
            serviceType: "n64",
            boothName: booking.roomId?.name || "Unknown Booth",
            bookingDate: booking.startDateTime, // Map to consistent field name
            amount: booking.totalPrice || 0, // Map price field
          }))
        );
      }

      if (serviceType === "all" || serviceType === "cafe") {
        const cafeFilter = { ...filter };
        if (startDate && endDate) {
          cafeFilter.date = {
            $gte: startDate,
            $lte: endDate,
          };
        }

        const cafeBookings = await CafeBooking.find(cafeFilter)
          .sort({ date: -1, time: -1 })
          .skip(skip)
          .limit(parseInt(limit));

        bookings.push(
          ...cafeBookings.map((booking) => ({
            ...booking.toObject(),
            serviceType: "cafe",
            tableName: `Table ${booking.chairIds.join(", ")}`,
            bookingDate: new Date(`${booking.date}T${booking.time}`), // Combine date and time
            amount: booking.totalCost || 0, // Map price field
          }))
        );
      }

      // Sort all bookings by date
      bookings.sort(
        (a, b) => new Date(b.bookingDate) - new Date(a.bookingDate)
      );

      // Get total count for pagination
      let totalCount = 0;
      if (serviceType === "all") {
        const karaokeCount = await KaraokeBooking.countDocuments(filter);
        const n64Count = await N64Booking.countDocuments(filter);
        const cafeCount = await CafeBooking.countDocuments(filter);
        totalCount = karaokeCount + n64Count + cafeCount;
      } else if (serviceType === "karaoke") {
        totalCount = await KaraokeBooking.countDocuments(filter);
      } else if (serviceType === "n64") {
        totalCount = await N64Booking.countDocuments(filter);
      } else if (serviceType === "cafe") {
        totalCount = await CafeBooking.countDocuments(filter);
      }

      res.json({
        success: true,
        bookings,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasNextPage: page * limit < totalCount,
          hasPrevPage: page > 1,
        },
      });
    } catch (error) {
      console.error("Error fetching all bookings:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching bookings",
        error: error.message,
      });
    }
  },

  // Get calendar data for all bookings
  getCalendarData: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      const filter = {};

      const calendarData = [];

      // Fetch karaoke bookings for calendar
      const karaokeFilter = {};
      if (startDate && endDate) {
        karaokeFilter.startDateTime = {
          $gte: new Date(startDate),
          $lte: new Date(endDate + "T23:59:59.999Z"),
        };
      }

      const karaokeBookings = await KaraokeBooking.find(karaokeFilter)
        .populate("roomId", "name")
        .select(
          "startDateTime endDateTime customerName roomId status totalPrice"
        );

      karaokeBookings.forEach((booking) => {
        calendarData.push({
          id: booking._id.toString(),
          title: `${booking.customerName} - ${
            booking.roomId?.name || "Karaoke Room"
          }`,
          start: booking.startDateTime,
          end: booking.endDateTime,
          serviceType: "karaoke",
          status: booking.status,
          revenue: booking.totalPrice || 0,
          roomName: booking.roomId?.name || "Karaoke Room",
          customerName: booking.customerName,
          customerEmail: booking.customerEmail,
        });
      });

      // Fetch N64 bookings for calendar
      const n64Filter = {};
      if (startDate && endDate) {
        n64Filter.startDateTime = {
          $gte: new Date(startDate),
          $lte: new Date(endDate + "T23:59:59.999Z"),
        };
      }

      const n64Bookings = await N64Booking.find(n64Filter)
        .populate("roomId", "name")
        .select(
          "startDateTime endDateTime customerName roomId status totalPrice"
        );

      n64Bookings.forEach((booking) => {
        calendarData.push({
          id: booking._id.toString(),
          title: `${booking.customerName} - ${
            booking.roomId?.name || "N64 Booth"
          }`,
          start: booking.startDateTime,
          end: booking.endDateTime,
          serviceType: "n64",
          status: booking.status,
          revenue: booking.totalPrice || 0,
          roomName: booking.roomId?.name || "N64 Booth",
          customerName: booking.customerName,
          customerEmail: booking.customerEmail,
        });
      });

      // Fetch cafe bookings for calendar
      const cafeFilter = {};
      if (startDate && endDate) {
        cafeFilter.date = {
          $gte: startDate,
          $lte: endDate,
        };
      }

      const cafeBookings = await CafeBooking.find(cafeFilter).select(
        "date time duration customerName chairIds status totalCost"
      );

      cafeBookings.forEach((booking) => {
        const startDateTime = new Date(`${booking.date}T${booking.time}`);
        const endDateTime = new Date(startDateTime);
        endDateTime.setHours(endDateTime.getHours() + booking.duration);

        calendarData.push({
          id: booking._id.toString(),
          title: `${booking.customerName} - Table ${booking.chairIds.join(
            ", "
          )}`,
          start: startDateTime,
          end: endDateTime,
          serviceType: "cafe",
          status: booking.status,
          revenue: booking.totalCost || 0,
          roomName: `Table ${booking.chairIds.join(", ")}`,
          customerName: booking.customerName,
          customerEmail: booking.customerEmail,
        });
      });

      res.json({
        success: true,
        calendarData,
      });
    } catch (error) {
      console.error("Error fetching calendar data:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching calendar data",
        error: error.message,
      });
    }
  },

  // Get booking statistics
  getBookingStatistics: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      const filter = {};

      // Get counts for each service type
      const karaokeFilter = {};
      const n64Filter = {};
      const cafeFilter = {};

      if (startDate && endDate) {
        karaokeFilter.startDateTime = {
          $gte: new Date(startDate),
          $lte: new Date(endDate + "T23:59:59.999Z"),
        };
        n64Filter.startDateTime = {
          $gte: new Date(startDate),
          $lte: new Date(endDate + "T23:59:59.999Z"),
        };
        cafeFilter.date = {
          $gte: startDate,
          $lte: endDate,
        };
      }

      const karaokeCount = await KaraokeBooking.countDocuments(karaokeFilter);
      const n64Count = await N64Booking.countDocuments(n64Filter);
      const cafeCount = await CafeBooking.countDocuments(cafeFilter);

      // Get status breakdown
      const karaokeStatus = await KaraokeBooking.aggregate([
        { $match: karaokeFilter },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]);

      const n64Status = await N64Booking.aggregate([
        { $match: n64Filter },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]);

      const cafeStatus = await CafeBooking.aggregate([
        { $match: cafeFilter },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]);

      // Get revenue totals
      const karaokeRevenue = await KaraokeBooking.aggregate([
        { $match: karaokeFilter },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]);

      const n64Revenue = await N64Booking.aggregate([
        { $match: n64Filter },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]);

      const cafeRevenue = await CafeBooking.aggregate([
        { $match: cafeFilter },
        { $group: { _id: null, total: { $sum: "$totalCost" } } },
      ]);

      const statistics = {
        totalBookings: karaokeCount + n64Count + cafeCount,
        serviceBreakdown: {
          karaoke: karaokeCount,
          n64: n64Count,
          cafe: cafeCount,
        },
        statusBreakdown: {
          karaoke: karaokeStatus,
          n64: n64Status,
          cafe: cafeStatus,
        },
        revenueBreakdown: {
          karaoke: karaokeRevenue[0]?.total || 0,
          n64: n64Revenue[0]?.total || 0,
          cafe: cafeRevenue[0]?.total || 0,
        },
      };

      res.json({
        success: true,
        statistics,
      });
    } catch (error) {
      console.error("Error fetching booking statistics:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching booking statistics",
        error: error.message,
      });
    }
  },
};

export default AllBookingsController;
