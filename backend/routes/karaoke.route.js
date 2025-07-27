import express from "express";
import KaraokeRoom from "../models/KaraokeRoom.js";
import KaraokeBooking from "../models/KaraokeBooking.js";
import authenticateUser from "../middlewares/authenticateUser.js";

const router = express.Router();

// GET /api/v1/karaoke-rooms - fetch all karaoke rooms
router.get("/", async (req, res) => {
  try {
    const rooms = await KaraokeRoom.find();
    res.status(200).json({ success: true, rooms });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

// GET /api/v1/karaoke-bookings - fetch all karaoke bookings
router.get("/bookings", async (req, res) => {
  try {
    const bookings = await KaraokeBooking.find();
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

// GET /api/v1/karaoke-rooms/my-bookings - fetch user's karaoke bookings
router.get("/my-bookings", authenticateUser, async (req, res) => {
  try {
    const bookings = await KaraokeBooking.find({ userId: req.user.id })
      .populate("roomId")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

// POST /api/v1/karaoke-rooms/bookings - create new karaoke booking
router.post("/bookings", authenticateUser, async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      numberOfPeople,
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

    const newBooking = new KaraokeBooking({
      userId: req.user.id,
      customerName,
      customerEmail,
      customerPhone,
      numberOfPeople,
      startDateTime,
      endDateTime,
      durationHours,
      totalPrice,
      paymentId,
      paymentStatus: paymentStatus || "pending",
      status: bookingStatus, // Set status based on payment status
    });

    await newBooking.save();

    res.status(201).json({
      success: true,
      message: "Karaoke booking created successfully",
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
