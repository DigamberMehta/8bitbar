import mongoose from "mongoose";
import N64Room from "../models/N64Room.js";

const updateN64WeekDays = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/8bitbar");
    console.log("Connected to MongoDB");

    // Find all N64 rooms that don't have weekDays field
    const rooms = await N64Room.find({ weekDays: { $exists: false } });
    console.log(`Found ${rooms.length} N64 rooms to update`);

    if (rooms.length === 0) {
      console.log(
        "No rooms need updating. All rooms already have weekDays field."
      );
      return;
    }

    // Update each room with default weekDays
    const defaultWeekDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    for (const room of rooms) {
      await N64Room.findByIdAndUpdate(
        room._id,
        { weekDays: defaultWeekDays },
        { new: true }
      );
      console.log(`Updated room: ${room.name}`);
    }

    console.log("Successfully updated all N64 rooms with weekDays field");

    // Verify the updates
    const updatedRooms = await N64Room.find();
    console.log("\nUpdated rooms:");
    updatedRooms.forEach((room) => {
      console.log(
        `- ${room.name}: ${room.weekDays?.length || 0} days available`
      );
    });
  } catch (error) {
    console.error("Error updating N64 rooms:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

// Run the script
updateN64WeekDays();
