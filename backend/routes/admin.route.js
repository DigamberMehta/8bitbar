import express from "express";
import authenticateAdmin from "../middlewares/authenticateAdmin.js";
import KaraokeBooking from "../models/KaraokeBooking.js";
import N64Booking from "../models/N64Booking.js";
import KaraokeRoom from "../models/KaraokeRoom.js";
import N64Room from "../models/N64Room.js";

const router = express.Router();

// Apply admin authentication to all routes
router.use(authenticateAdmin);

// Dashboard stats endpoints
router.get("/karaoke-bookings/count", async (req, res) => {
  try {
    const count = await KaraokeBooking.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Error fetching karaoke bookings count" });
  }
});

router.get("/n64-bookings/count", async (req, res) => {
  try {
    const count = await N64Booking.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Error fetching N64 bookings count" });
  }
});

router.get("/karaoke-rooms/count", async (req, res) => {
  try {
    const count = await KaraokeRoom.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Error fetching karaoke rooms count" });
  }
});

router.get("/n64-rooms/count", async (req, res) => {
  try {
    const count = await N64Room.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Error fetching N64 rooms count" });
  }
});

// Karaoke Bookings Management
router.get("/karaoke-bookings", async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status && status !== "all" ? { status } : {};

    const bookings = await KaraokeBooking.find(filter).sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (error) {
    console.error("Error fetching karaoke bookings:", error);
    res.status(500).json({ message: "Error fetching karaoke bookings" });
  }
});

router.patch("/karaoke-bookings/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await KaraokeBooking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ booking });
  } catch (error) {
    res.status(500).json({ message: "Error updating booking status" });
  }
});

// N64 Bookings Management
router.get("/n64-bookings", async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status && status !== "all" ? { status } : {};

    const bookings = await N64Booking.find(filter)
      .populate("roomId", "name")
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (error) {
    console.error("Error fetching N64 bookings:", error);
    res.status(500).json({ message: "Error fetching N64 bookings" });
  }
});

router.patch("/n64-bookings/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await N64Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ booking });
  } catch (error) {
    res.status(500).json({ message: "Error updating booking status" });
  }
});

// Karaoke Rooms Management
router.get("/karaoke-rooms", async (req, res) => {
  try {
    const rooms = await KaraokeRoom.find().sort({ createdAt: -1 });
    res.json({ rooms });
  } catch (error) {
    res.status(500).json({ message: "Error fetching karaoke rooms" });
  }
});

router.put("/karaoke-rooms/:id", async (req, res) => {
  try {
    const room = await KaraokeRoom.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ room });
  } catch (error) {
    res.status(500).json({ message: "Error updating karaoke room" });
  }
});

// N64 Rooms Management
router.get("/n64-rooms", async (req, res) => {
  try {
    const rooms = await N64Room.find().sort({ createdAt: -1 });
    res.json({ rooms });
  } catch (error) {
    res.status(500).json({ message: "Error fetching N64 rooms" });
  }
});

router.put("/n64-rooms/:id", async (req, res) => {
  try {
    const room = await N64Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ room });
  } catch (error) {
    res.status(500).json({ message: "Error updating N64 room" });
  }
});

export default router;
