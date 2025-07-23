// seedBookings.js

import mongoose from "mongoose";
import KaraokeBooking from "../models/KaraokeBooking.js";

// Replace with your actual MongoDB connection string
const MONGODB_URI = "mongodb://localhost:27017/8bitbar";

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB.");

    // Clear existing bookings (optional)
    await KaraokeBooking.deleteMany({});
    console.log("Old bookings cleared.");

 
    // Booking 3: 2 PM to 5 PM
    const booking3 = {
      customerName: "Charlie Brown",
      customerEmail: "charlie@example.com",
      numberOfPeople: 5,
      startDateTime: new Date("2025-08-01T14:00:00"), // 2:00 PM
      endDateTime: new Date("2025-08-01T17:00:00"),   // 5:00 PM
      durationHours: 3,
      totalPrice: 300,
      status: "confirmed",
    };

    await KaraokeBooking.insertMany([booking3]);
    console.log("Dummy bookings inserted successfully.");
  } catch (error) {
    console.error("Error seeding bookings:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
};

seedData();
