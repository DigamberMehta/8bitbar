import express from "express";
import CafeBooking from "../models/CafeBooking.js";
import CafeLayout from "../models/CafeLayout.js";
import CafeSettings from "../models/CafeSettings.js";
import authenticateUser from "../middlewares/authenticateUser.js";

const router = express.Router();

// GET /api/v1/cafe/settings - fetch cafe settings
router.get("/settings", async (req, res) => {
  try {
    let settings = await CafeSettings.findOne();

    // Create default settings if none exist
    if (!settings) {
      settings = await CafeSettings.create({
        timeSlots: [
          "14:00",
          "15:00",
          "16:00",
          "17:00",
          "18:00",
          "19:00",
          "20:00",
          "21:00",
          "22:00",
        ],
        pricePerChairPerHour: 10,
        maxDuration: 8,
        openingTime: "14:00",
        closingTime: "23:00",
      });
    }

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// GET /api/v1/cafe/layout - fetch cafe layout for booking
router.get("/layout", async (req, res) => {
  try {
    const { deviceType = "desktop" } = req.query;
    const layout = await CafeLayout.findOne({ deviceType }).sort({
      updatedAt: -1,
    });

    if (!layout) {
      return res.status(404).json({
        success: false,
        message: "Layout not found for this device type",
      });
    }

    res.status(200).json({
      success: true,
      layout,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// GET /api/v1/cafe/bookings/check - check chair availability
router.get("/bookings/check", async (req, res) => {
  try {
    const { date, time, duration } = req.query;

    if (!date || !time || !duration) {
      return res.status(400).json({
        success: false,
        message: "Date, time, and duration are required",
      });
    }

    // Find all bookings for the specified date and time range
    const bookings = await CafeBooking.find({
      date,
      status: { $in: ["pending", "confirmed"] },
    });

    // Extract booked chair IDs for the time slot
    const bookedChairs = new Set();

    bookings.forEach((booking) => {
      const bookingStartTime = parseInt(booking.time.split(":")[0]);
      const bookingEndTime = bookingStartTime + booking.duration;
      const requestedStartTime = parseInt(time.split(":")[0]);
      const requestedEndTime = requestedStartTime + parseInt(duration);

      // Check if time slots overlap
      if (
        (requestedStartTime >= bookingStartTime &&
          requestedStartTime < bookingEndTime) ||
        (requestedEndTime > bookingStartTime &&
          requestedEndTime <= bookingEndTime) ||
        (requestedStartTime <= bookingStartTime &&
          requestedEndTime >= bookingEndTime)
      ) {
        booking.chairIds.forEach((chairId) => bookedChairs.add(chairId));
      }
    });

    res.status(200).json({
      success: true,
      bookedChairs: Array.from(bookedChairs),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// POST /api/v1/cafe/bookings - create new booking
router.post("/bookings", authenticateUser, async (req, res) => {
  try {
    const {
      chairIds,
      date,
      time,
      duration,
      customerName,
      customerEmail,
      customerPhone,
      specialRequests,
      deviceType,
    } = req.body;

    if (!chairIds || !chairIds.length || !date || !time || !duration) {
      return res.status(400).json({
        success: false,
        message: "Chair IDs, date, time, and duration are required",
      });
    }

    // Check availability again before booking
    const bookings = await CafeBooking.find({
      date,
      status: { $in: ["pending", "confirmed"] },
    });

    const bookedChairs = new Set();
    bookings.forEach((booking) => {
      const bookingStartTime = parseInt(booking.time.split(":")[0]);
      const bookingEndTime = bookingStartTime + booking.duration;
      const requestedStartTime = parseInt(time.split(":")[0]);
      const requestedEndTime = requestedStartTime + parseInt(duration);

      if (
        (requestedStartTime >= bookingStartTime &&
          requestedStartTime < bookingEndTime) ||
        (requestedEndTime > bookingStartTime &&
          requestedEndTime <= bookingEndTime) ||
        (requestedStartTime <= bookingStartTime &&
          requestedEndTime >= bookingEndTime)
      ) {
        booking.chairIds.forEach((chairId) => bookedChairs.add(chairId));
      }
    });

    // Check if any requested chairs are already booked
    const conflictingChairs = chairIds.filter((chairId) =>
      bookedChairs.has(chairId)
    );

    if (conflictingChairs.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Some chairs are already booked for this time slot",
        conflictingChairs,
      });
    }

    // Calculate total cost (each chair costs $10 per hour)
    const totalCost = chairIds.length * 10 * duration;

    const newBooking = new CafeBooking({
      userId: req.user.id,
      chairIds,
      date,
      time,
      duration,
      totalCost,
      customerName: customerName || req.user.name,
      customerEmail: customerEmail || req.user.email,
      customerPhone,
      specialRequests,
      deviceType: deviceType || "desktop",
    });

    await newBooking.save();

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// GET /api/v1/cafe/bookings - fetch user's bookings
router.get("/bookings", authenticateUser, async (req, res) => {
  try {
    const bookings = await CafeBooking.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// PUT /api/v1/cafe/bookings/:id/cancel - cancel booking
router.put("/bookings/:id/cancel", authenticateUser, async (req, res) => {
  try {
    const booking = await CafeBooking.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled",
      });
    }

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

export default router;
