import express from "express";
import N64Room from "../models/N64Room.js";
import N64Booking from "../models/N64Booking.js";
import authenticateUser from "../middlewares/authenticateUser.js";
import { sendBookingConfirmation } from "../services/emailService.js";

const router = express.Router();

// GET /api/v1/n64-rooms - fetch all N64 booths
router.get("/", async (req, res) => {
  try {
    const booths = await N64Room.find();
    res.status(200).json({ success: true, booths });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

// GET /api/v1/n64-rooms/bookings - fetch all N64 bookings
router.get("/bookings", async (req, res) => {
  try {
    const { roomId } = req.query;
    let filter = {};

    // If roomId is provided, filter bookings by that room
    if (roomId) {
      filter.roomId = roomId;
    }

    // Populate booth info for each booking
    const bookings = await N64Booking.find(filter).populate("roomId");
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

// GET /api/v1/n64-rooms/my-bookings - fetch user's N64 bookings
router.get("/my-bookings", authenticateUser, async (req, res) => {
  try {
    const bookings = await N64Booking.find({ userId: req.user.id })
      .populate("roomId")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

// POST /api/v1/n64-rooms/bookings - create new N64 booking
router.post("/bookings", authenticateUser, async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      numberOfPeople,
      roomId,
      roomType,
      date,
      time,
      durationHours,
      totalPrice,
      paymentId,
      paymentStatus,
    } = req.body;

    if (
      !customerName ||
      !customerEmail ||
      !numberOfPeople ||
      !roomId ||
      !roomType ||
      !date ||
      !time ||
      !durationHours ||
      !totalPrice
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // Parse the time and create start/end DateTime objects
    const [timeStr, period] = time.split(" ");
    const [hourStr, minuteStr] = timeStr.split(":");
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    const startDateTime = new Date(date);
    startDateTime.setHours(hour, minute, 0, 0);

    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(startDateTime.getHours() + durationHours);

    // Determine booking status based on payment status
    const bookingStatus =
      paymentStatus === "completed" || paymentStatus === "COMPLETED"
        ? "confirmed"
        : "pending";

    const newBooking = new N64Booking({
      userId: req.user.id,
      customerName,
      customerEmail,
      customerPhone,
      numberOfPeople,
      roomId,
      roomType,
      startDateTime,
      endDateTime,
      durationHours,
      totalPrice,
      paymentId,
      paymentStatus: paymentStatus || "pending",
      status: bookingStatus, // Set status based on payment status
    });

    await newBooking.save();

    // Get room name for email
    const room = await N64Room.findById(roomId);
    const roomName = room ? room.name : "N64 Gaming Booth";

    // Send confirmation email
    try {
      await sendBookingConfirmation("n64", newBooking, { roomName });
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't fail the booking if email fails
    }

    res.status(201).json({
      success: true,
      message: "N64 booking created successfully",
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

export default router;
