import mongoose from "mongoose";
import dotenv from "dotenv";
import KaraokeBooking from "../models/KaraokeBooking.js";
import KaraokeRoom from "../models/KaraokeRoom.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const updateKaraokeBookings = async () => {
  try {
    await connectDB();

    // Get all rooms
    const rooms = await KaraokeRoom.find();
    console.log(
      "Found rooms:",
      rooms.map((r) => ({ id: r._id, name: r.name }))
    );

    // Get all bookings without roomId
    const bookingsWithoutRoomId = await KaraokeBooking.find({
      roomId: { $exists: false },
    });
    console.log(
      `Found ${bookingsWithoutRoomId.length} bookings without roomId`
    );

    if (bookingsWithoutRoomId.length === 0) {
      console.log("No bookings need updating");
      return;
    }

    // For each booking, assign it to the first room (Alice in Wonderland Karaoke Room)
    // You can modify this logic based on your needs
    const defaultRoomId = rooms[0]._id; // Alice in Wonderland Karaoke Room

    for (const booking of bookingsWithoutRoomId) {
      console.log(`Updating booking ${booking._id} to room: ${rooms[0].name}`);

      await KaraokeBooking.findByIdAndUpdate(booking._id, {
        roomId: defaultRoomId,
      });
    }

    console.log("Successfully updated all bookings");

    // Verify the updates
    const updatedBookings = await KaraokeBooking.find().populate(
      "roomId",
      "name"
    );
    console.log(
      "Updated bookings:",
      updatedBookings.map((b) => ({
        id: b._id,
        customerName: b.customerName,
        roomName: b.roomId?.name || "No room",
      }))
    );
  } catch (error) {
    console.error("Error updating bookings:", error);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB Disconnected");
  }
};

updateKaraokeBookings();
