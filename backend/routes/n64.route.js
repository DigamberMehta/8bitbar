import express from "express";
import N64Room from "../models/N64Room.js";
import N64Booking from "../models/N64Booking.js";

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
    // Populate booth info for each booking
    const bookings = await N64Booking.find().populate("roomId");
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

export default router;
