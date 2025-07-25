import express from "express";
import authenticateAdmin from "../../middlewares/authenticateAdmin.js";
import N64Booking from "../../models/N64Booking.js";
import N64Room from "../../models/N64Room.js";

const router = express.Router();

router.use(authenticateAdmin);

// Dashboard stats endpoints
router.get("/n64-bookings/count", async (req, res) => {
  try {
    const count = await N64Booking.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Error fetching N64 bookings count" });
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

// N64 Bookings Management
router.get("/n64-bookings", async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status && status !== "all" ? { status } : {};

    const bookings = await N64Booking.find(filter)
      .populate("roomId", "name")
      .populate("userId", "name email")
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
    )
      .populate("userId", "name email")
      .populate("roomId", "name");
    res.json({ booking });
  } catch (error) {
    res.status(500).json({ message: "Error updating booking status" });
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
