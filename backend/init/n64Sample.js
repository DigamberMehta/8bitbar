// seedN64Rooms.js

import mongoose from "mongoose";
import N64Room from "../models/N64Room.js";
import N64Booking from "../models/N64Booking.js";

const MONGODB_URI = "mongodb://localhost:27017/8bitbar";

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB.");

    // Get booth ObjectIds
    const mickey = await N64Room.findOne({ roomType: "mickey" });
    const minnie = await N64Room.findOne({ roomType: "minnie" });
    if (!mickey || !minnie) {
      throw new Error(
        "Both Mickey and Minnie booths must exist in N64Room collection."
      );
    }

    // Clear existing bookings (optional)
    await N64Booking.deleteMany({});
    console.log("Old N64 bookings cleared.");

    // Booking 1: Mickey, 6 PM to 8 PM
    const booking1 = {
      customerName: "Mario Player",
      customerEmail: "mario@example.com",
      numberOfPeople: 3,
      roomId: mickey._id,
      roomType: "mickey",
      startDateTime: new Date("2025-08-01T18:00:00"), // 2:00 PM
      endDateTime: new Date("2025-08-01T20:00:00"),   // 5:00 PM
      durationHours: 2,
      totalPrice: 40, // assuming $20/hour
      status: "confirmed",
    };

    // Booking 2: Minnie, 7 PM to 9 PM
    const booking2 = {
      customerName: "Peach Player",
      customerEmail: "peach@example.com",
      numberOfPeople: 2,
      roomId: minnie._id,
      roomType: "minnie",
      startDateTime: new Date("2025-08-01T14:00:00"), // 2:00 PM
      endDateTime: new Date("2025-08-01T17:00:00"),   // 5:00 PM
      durationHours: 2,
      totalPrice: 40, // assuming $20/hour
      status: "confirmed",
    };

    await N64Booking.insertMany([booking1, booking2]);
    console.log("Dummy N64 bookings inserted successfully.");
  } catch (error) {
    console.error("Error seeding N64 bookings:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
};

seedData();
