import express from "express";
import authenticateAdmin from "../../middlewares/authenticateAdmin.js";
import KaraokeBooking from "../../models/KaraokeBooking.js";
import KaraokeRoom from "../../models/KaraokeRoom.js";

const router = express.Router();

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

router.get("/karaoke-rooms/count", async (req, res) => {
  try {
    const count = await KaraokeRoom.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Error fetching karaoke rooms count" });
  }
});

// Karaoke Bookings Management
router.get("/karaoke-bookings", async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status && status !== "all" ? { status } : {};

    const bookings = await KaraokeBooking.find(filter)
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

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
    ).populate("userId", "name email");
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

export default router;
