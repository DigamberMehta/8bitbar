import express from "express";
import KaraokeRoom from "../models/KaraokeRoom.js";
import KaraokeBooking from "../models/KaraokeBooking.js";

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

export default router;
