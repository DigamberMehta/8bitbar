import express from "express";
import authenticateAdmin from "../middlewares/authenticateAdmin.js";
import KaraokeBooking from "../models/KaraokeBooking.js";
import N64Booking from "../models/N64Booking.js";
import KaraokeRoom from "../models/KaraokeRoom.js";
import N64Room from "../models/N64Room.js";
import CafeLayout from "../models/CafeLayout.js";
import CafeBooking from "../models/CafeBooking.js";
import CafeSettings from "../models/CafeSettings.js";

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

router.get("/cafe-bookings/count", async (req, res) => {
  try {
    const count = await CafeBooking.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cafe bookings count" });
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

// Cafe Bookings Management
router.get("/cafe-bookings", async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status && status !== "all" ? { status } : {};

    const bookings = await CafeBooking.find(filter)
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (error) {
    console.error("Error fetching cafe bookings:", error);
    res.status(500).json({ message: "Error fetching cafe bookings" });
  }
});

router.patch("/cafe-bookings/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await CafeBooking.findByIdAndUpdate(
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

// --- Cafe Layout Management ---
// Get current cafe layout
router.get("/cafe-layout", async (req, res) => {
  try {
    const deviceType = req.query.deviceType || "desktop";
    const layout = await CafeLayout.findOne({ deviceType }).sort({
      updatedAt: -1,
    });
    res.json({ layout });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cafe layout" });
  }
});

// Update cafe layout (replace all)
router.put("/cafe-layout", async (req, res) => {
  try {
    const {
      chairs,
      tables,
      changeType,
      bgImageUrl,
      canvasWidth,
      canvasHeight,
      deviceType,
    } = req.body;
    // Find and update existing layout or create new one
    const layout = await CafeLayout.findOneAndUpdate(
      { deviceType: deviceType || "desktop" },
      {
        chairs,
        tables,
        bgImageUrl,
        canvasWidth,
        canvasHeight,
        updatedBy: req.userId,
        changeType: changeType || "updated",
      },
      {
        new: true,
        upsert: true, // Create if doesn't exist
        runValidators: true,
      }
    );
    res.json({ layout });
  } catch (error) {
    res.status(500).json({ message: "Error updating cafe layout" });
  }
});

// Add a chair or table
router.post("/cafe-layout/item", async (req, res) => {
  try {
    const { item, itemType } = req.body; // itemType: 'chair' or 'table'
    const lastLayout = await CafeLayout.findOne().sort({ updatedAt: -1 });
    let newChairs = lastLayout ? [...lastLayout.chairs] : [];
    let newTables = lastLayout ? [...lastLayout.tables] : [];
    if (itemType === "chair") newChairs.push(item);
    else if (itemType === "table") newTables.push(item);
    const layout = await CafeLayout.create({
      chairs: newChairs,
      tables: newTables,
      updatedBy: req.userId,
      changeType: "added",
    });
    res.json({ layout });
  } catch (error) {
    res.status(500).json({ message: "Error adding item to cafe layout" });
  }
});

// Remove a chair or table
router.delete("/cafe-layout/item/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;
    const { itemType } = req.query; // 'chair' or 'table'
    const lastLayout = await CafeLayout.findOne().sort({ updatedAt: -1 });
    let newChairs = lastLayout
      ? lastLayout.chairs.filter((c) => c.id !== itemId)
      : [];
    let newTables = lastLayout
      ? lastLayout.tables.filter((t) => t.id !== itemId)
      : [];
    const layout = await CafeLayout.create({
      chairs: itemType === "chair" ? newChairs : lastLayout.chairs,
      tables: itemType === "table" ? newTables : lastLayout.tables,
      updatedBy: req.userId,
      changeType: "removed",
    });
    res.json({ layout });
  } catch (error) {
    res.status(500).json({ message: "Error removing item from cafe layout" });
  }
});

// --- Cafe Settings Management ---
// Get cafe settings
router.get("/cafe-settings", async (req, res) => {
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
        updatedBy: req.userId,
      });
    }

    res.json({ settings });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cafe settings" });
  }
});

// Update cafe settings
router.put("/cafe-settings", async (req, res) => {
  try {
    const {
      timeSlots,
      pricePerChairPerHour,
      maxDuration,
      openingTime,
      closingTime,
    } = req.body;

    const settings = await CafeSettings.findOneAndUpdate(
      {},
      {
        timeSlots,
        pricePerChairPerHour,
        maxDuration,
        openingTime,
        closingTime,
        updatedBy: req.userId,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.json({ settings });
  } catch (error) {
    res.status(500).json({ message: "Error updating cafe settings" });
  }
});

export default router;
