import express from "express";
import bcrypt from "bcryptjs";
import User from "../../models/user.model.js";
import KaraokeBooking from "../../models/KaraokeBooking.js";
import KaraokeRoom from "../../models/KaraokeRoom.js";
import N64Booking from "../../models/N64Booking.js";
import N64Room from "../../models/N64Room.js";
import CafeBooking from "../../models/CafeBooking.js";
import CafeSettings from "../../models/CafeSettings.js";
import CafeLayout from "../../models/CafeLayout.js";
import StaffPin from "../../models/StaffPin.js";

const router = express.Router();

// Helper function to find or create user
const findOrCreateUser = async (userData) => {
  const { name, email, phone, dob } = userData;

  // Normalize email
  const normalizedEmail = email.toLowerCase().trim();

  // Check if user already exists
  let user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    // Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Create new user
    user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      ...(dob && { dob: new Date(dob) }),
    });

    console.log(
      `🆕 NEW USER CREATED - Email: ${normalizedEmail}, TempPassword: ${tempPassword}`
    );
    return { user, isNewUser: true, tempPassword };
  }

  console.log(
    `👤 EXISTING USER FOUND - Email: ${normalizedEmail}, UserID: ${user._id}`
  );
  return { user, isNewUser: false };
};

// Helper function to verify PIN and get staff info
const verifyStaffPin = async (pin) => {
  if (!pin) {
    return { isValid: false, message: "PIN is required for manual bookings" };
  }

  const staffPin = await StaffPin.findOne({
    pin,
    isActive: true,
  }).populate("adminUserId", "name email");

  if (!staffPin) {
    return { isValid: false, message: "Invalid PIN" };
  }

  return {
    isValid: true,
    staffInfo: {
      pin: staffPin.pin,
      staffName: staffPin.staffName,
      adminUserId: staffPin.adminUserId._id,
      adminName: staffPin.adminUserId.name,
      adminEmail: staffPin.adminUserId.email,
    },
  };
};

// Manual Karaoke Booking
router.post("/karaoke", async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      customerDob,
      roomId,
      numberOfPeople,
      startDateTime,
      durationHours,
      paymentStatus = "completed", // Admin bookings are typically paid
      status,
      staffPin, // New field for staff identification
    } = req.body;

    // Validate required fields
    if (
      !customerName ||
      !customerEmail ||
      !roomId ||
      !numberOfPeople ||
      !startDateTime ||
      !durationHours ||
      !status ||
      !staffPin // PIN is now required for manual bookings
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields including staff PIN",
      });
    }

    // Validate status
    if (!["pending", "confirmed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'pending' or 'confirmed'",
      });
    }

    // Verify staff PIN
    const pinVerification = await verifyStaffPin(staffPin);
    if (!pinVerification.isValid) {
      return res.status(400).json({
        success: false,
        message: pinVerification.message,
      });
    }

    const { staffInfo } = pinVerification;

    // Find or create user
    const { user, isNewUser, tempPassword } = await findOrCreateUser({
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
      dob: customerDob,
    });

    // Get room details for pricing
    const room = await KaraokeRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Karaoke room not found",
      });
    }

    // Calculate end time and total price
    const startDate = new Date(startDateTime);
    const endDate = new Date(
      startDate.getTime() + durationHours * 60 * 60 * 1000
    );
    const totalPrice = room.pricePerHour * durationHours;

    // Check for conflicts
    const conflictingBooking = await KaraokeBooking.findOne({
      roomId,
      status: { $in: ["pending", "confirmed"] },
      $or: [
        {
          startDateTime: { $lt: endDate },
          endDateTime: { $gt: startDate },
        },
      ],
    });

    if (conflictingBooking) {
      return res.status(400).json({
        success: false,
        message: "Time slot conflicts with existing booking",
      });
    }

    // Create booking with staff information
    const booking = await KaraokeBooking.create({
      userId: user._id,
      roomId,
      customerName,
      customerEmail: customerEmail.toLowerCase().trim(),
      customerPhone,
      numberOfPeople,
      startDateTime: startDate,
      endDateTime: endDate,
      durationHours,
      totalPrice,
      status,
      paymentStatus,
      paymentId: `admin-${Date.now()}`, // Admin booking identifier
      staffPin: staffInfo.pin,
      staffName: staffInfo.staffName,
      isManualBooking: true,
    });

    const populatedBooking = await KaraokeBooking.findById(booking._id)
      .populate("userId", "name email")
      .populate("roomId", "name");

    res.status(201).json({
      success: true,
      message: "Karaoke booking created successfully",
      booking: populatedBooking,
      userInfo: {
        isNewUser,
        ...(isNewUser && { tempPassword }),
      },
      staffInfo: {
        staffName: staffInfo.staffName,
        pin: staffInfo.pin,
      },
    });
  } catch (error) {
    console.error("Error creating manual karaoke booking:", error);
    res.status(500).json({
      success: false,
      message: "Error creating booking",
    });
  }
});

// Manual N64 Booking
router.post("/n64", async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      customerDob,
      roomId,
      roomType,
      numberOfPeople,
      startDateTime,
      durationHours,
      paymentStatus = "completed",
      status,
      staffPin, // New field for staff identification
    } = req.body;

    // Validate required fields
    if (
      !customerName ||
      !customerEmail ||
      !roomId ||
      !roomType ||
      !numberOfPeople ||
      !startDateTime ||
      !durationHours ||
      !status ||
      !staffPin // PIN is now required for manual bookings
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields including staff PIN",
      });
    }

    // Validate status
    if (!["pending", "confirmed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'pending' or 'confirmed'",
      });
    }

    // Verify staff PIN
    const pinVerification = await verifyStaffPin(staffPin);
    if (!pinVerification.isValid) {
      return res.status(400).json({
        success: false,
        message: pinVerification.message,
      });
    }

    const { staffInfo } = pinVerification;

    // Find or create user
    const { user, isNewUser, tempPassword } = await findOrCreateUser({
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
      dob: customerDob,
    });

    // Get room details for pricing
    const room = await N64Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "N64 room not found",
      });
    }

    // Calculate end time and total price
    const startDate = new Date(startDateTime);
    const endDate = new Date(
      startDate.getTime() + durationHours * 60 * 60 * 1000
    );
    const totalPrice = room.pricePerHour * durationHours;

    // Check for conflicts
    const conflictingBooking = await N64Booking.findOne({
      roomId,
      status: { $in: ["pending", "confirmed"] },
      $or: [
        {
          startDateTime: { $lt: endDate },
          endDateTime: { $gt: startDate },
        },
      ],
    });

    if (conflictingBooking) {
      return res.status(400).json({
        success: false,
        message: "Time slot conflicts with existing booking",
      });
    }

    // Create booking with staff information
    const booking = await N64Booking.create({
      userId: user._id,
      roomId,
      roomType,
      customerName,
      customerEmail: customerEmail.toLowerCase().trim(),
      customerPhone,
      numberOfPeople,
      startDateTime: startDate,
      endDateTime: endDate,
      durationHours,
      totalPrice,
      status,
      paymentStatus,
      paymentId: `admin-${Date.now()}`,
      staffPin: staffInfo.pin,
      staffName: staffInfo.staffName,
      isManualBooking: true,
    });

    const populatedBooking = await N64Booking.findById(booking._id)
      .populate("userId", "name email")
      .populate("roomId", "name");

    res.status(201).json({
      success: true,
      message: "N64 booking created successfully",
      booking: populatedBooking,
      userInfo: {
        isNewUser,
        ...(isNewUser && { tempPassword }),
      },
      staffInfo: {
        staffName: staffInfo.staffName,
        pin: staffInfo.pin,
      },
    });
  } catch (error) {
    console.error("Error creating manual N64 booking:", error);
    res.status(500).json({
      success: false,
      message: "Error creating booking",
    });
  }
});

// Manual Cafe Booking
router.post("/cafe", async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      customerDob,
      chairIds,
      date,
      time,
      duration,
      specialRequests,
      deviceType = "desktop",
      paymentStatus = "completed",
      status,
      staffPin, // New field for staff identification
    } = req.body;

    // Validate required fields
    if (
      !customerName ||
      !customerEmail ||
      !chairIds ||
      !Array.isArray(chairIds) ||
      chairIds.length === 0 ||
      !date ||
      !time ||
      !duration ||
      !status ||
      !staffPin // PIN is now required for manual bookings
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields including staff PIN",
      });
    }

    // Validate status
    if (!["pending", "confirmed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'pending' or 'confirmed'",
      });
    }

    // Verify staff PIN
    const pinVerification = await verifyStaffPin(staffPin);
    if (!pinVerification.isValid) {
      return res.status(400).json({
        success: false,
        message: pinVerification.message,
      });
    }

    const { staffInfo } = pinVerification;

    // Find or create user
    const { user, isNewUser, tempPassword } = await findOrCreateUser({
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
      dob: customerDob,
    });

    // Get cafe settings for pricing
    const settings = await CafeSettings.findOne();
    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "Cafe settings not found",
      });
    }

    // Calculate total cost
    const totalCost =
      chairIds.length * settings.pricePerChairPerHour * duration;

    // Check for conflicts
    const conflictingBooking = await CafeBooking.findOne({
      date,
      time,
      status: { $in: ["pending", "confirmed"] },
      chairIds: { $in: chairIds },
    });

    if (conflictingBooking) {
      return res.status(400).json({
        success: false,
        message: "One or more chairs are already booked for this time slot",
      });
    }

    // Create booking with staff information
    const booking = await CafeBooking.create({
      userId: user._id,
      chairIds,
      date,
      time,
      duration,
      totalCost,
      customerName,
      customerEmail: customerEmail.toLowerCase().trim(),
      customerPhone,
      specialRequests,
      deviceType,
      status,
      paymentStatus,
      paymentId: `admin-${Date.now()}`,
      staffPin: staffInfo.pin,
      staffName: staffInfo.staffName,
      isManualBooking: true,
    });

    const populatedBooking = await CafeBooking.findById(booking._id).populate(
      "userId",
      "name email"
    );

    res.status(201).json({
      success: true,
      message: "Cafe booking created successfully",
      booking: populatedBooking,
      userInfo: {
        isNewUser,
        ...(isNewUser && { tempPassword }),
      },
      staffInfo: {
        staffName: staffInfo.staffName,
        pin: staffInfo.pin,
      },
    });
  } catch (error) {
    console.error("Error creating manual cafe booking:", error);
    res.status(500).json({
      success: false,
      message: "Error creating booking",
    });
  }
});

// Get available rooms/resources for booking
router.get("/resources", async (req, res) => {
  try {
    const [karaokeRooms, n64Rooms, cafeSettings, cafeLayout] =
      await Promise.all([
        KaraokeRoom.find({ isActive: { $ne: false } }).select(
          "name pricePerHour maxPeople"
        ),
        N64Room.find({ isActive: { $ne: false } }).select(
          "name pricePerHour maxPeople roomType"
        ),
        CafeSettings.findOne().select(
          "pricePerChairPerHour timeSlots maxDuration"
        ),
        CafeLayout.findOne({ deviceType: "desktop" })
          .sort({ updatedAt: -1 })
          .select("chairs"),
      ]);

    res.json({
      success: true,
      resources: {
        karaoke: karaokeRooms,
        n64: n64Rooms,
        cafe: {
          ...cafeSettings?.toObject(),
          chairs: cafeLayout?.chairs || [],
        },
      },
    });
  } catch (error) {
    console.error("Error fetching booking resources:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching resources",
    });
  }
});

// Get karaoke room availability for specific date/room
router.get("/karaoke/availability", async (req, res) => {
  try {
    const { date, roomId } = req.query;

    if (!date || !roomId) {
      return res.status(400).json({
        success: false,
        message: "Date and roomId are required",
      });
    }

    // Get room details
    const room = await KaraokeRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // Find all bookings for the specified date and room
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await KaraokeBooking.find({
      roomId,
      status: { $in: ["pending", "confirmed"] },
      startDateTime: { $gte: startOfDay, $lte: endOfDay },
    });

    res.json({
      success: true,
      room,
      bookings,
      timeSlots: room.timeSlots,
    });
  } catch (error) {
    console.error("Error fetching karaoke availability:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching availability",
    });
  }
});

// Get N64 room availability for specific date/room
router.get("/n64/availability", async (req, res) => {
  try {
    const { date, roomId } = req.query;

    if (!date || !roomId) {
      return res.status(400).json({
        success: false,
        message: "Date and roomId are required",
      });
    }

    // Get room details
    const room = await N64Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // Find all bookings for the specified date and room
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await N64Booking.find({
      roomId,
      status: { $in: ["pending", "confirmed"] },
      startDateTime: { $gte: startOfDay, $lte: endOfDay },
    });

    res.json({
      success: true,
      room,
      bookings,
      timeSlots: room.timeSlots,
    });
  } catch (error) {
    console.error("Error fetching N64 availability:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching availability",
    });
  }
});

// Get chair availability for specific date/time
router.get("/cafe/chairs/availability", async (req, res) => {
  try {
    const { date, time, duration } = req.query;

    if (!date || !time || !duration) {
      return res.status(400).json({
        success: false,
        message: "Date, time, and duration are required",
      });
    }

    // Get cafe layout
    const cafeLayout = await CafeLayout.findOne({ deviceType: "desktop" })
      .sort({ updatedAt: -1 })
      .select("chairs");

    if (!cafeLayout) {
      return res.status(404).json({
        success: false,
        message: "Cafe layout not found",
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

    // Add availability status to each chair
    const chairsWithAvailability = cafeLayout.chairs.map((chair) => ({
      ...chair.toObject(),
      isAvailable:
        !bookedChairs.has(chair.id) && !bookedChairs.has(chair._id.toString()),
    }));

    res.json({
      success: true,
      chairs: chairsWithAvailability,
      bookedChairs: Array.from(bookedChairs),
    });
  } catch (error) {
    console.error("Error fetching chair availability:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching chair availability",
    });
  }
});

export default router;
