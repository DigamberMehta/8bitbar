import dotenv from "dotenv";
import mongoose from "mongoose";
import N64Booking from "../models/N64Booking.js";
import KaraokeBooking from "../models/KaraokeBooking.js";
import User from "../models/user.model.js";

// Load environment variables
dotenv.config();

const updateExistingBookings = async () => {
  try {
    console.log("🚀 Starting Phone Number & User ID Update Script");
    console.log("================================================\n");

    // Connect to MongoDB
    console.log("🔌 Connecting to database...");
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/8bitbar"
    );
    console.log("✅ Connected to MongoDB\n");

    // Find or create users for existing bookings
    console.log("👤 Finding or creating users for existing bookings...");

    let marioUser = await User.findOne({ email: "mario@example.com" });
    if (!marioUser) {
      marioUser = await User.create({
        name: "Mario Player",
        email: "mario@example.com",
        password: "hashedpassword123",
        role: "customer",
      });
      console.log("✅ Created user for Mario Player");
    } else {
      console.log("✅ Found existing user for Mario Player");
    }

    let peachUser = await User.findOne({ email: "peach@example.com" });
    if (!peachUser) {
      peachUser = await User.create({
        name: "Peach Player",
        email: "peach@example.com",
        password: "hashedpassword123",
        role: "customer",
      });
      console.log("✅ Created user for Peach Player");
    } else {
      console.log("✅ Found existing user for Peach Player");
    }

    let charlieUser = await User.findOne({ email: "charlie@example.com" });
    if (!charlieUser) {
      charlieUser = await User.create({
        name: "Charlie Brown",
        email: "charlie@example.com",
        password: "hashedpassword123",
        role: "customer",
      });
      console.log("✅ Created user for Charlie Brown");
    } else {
      console.log("✅ Found existing user for Charlie Brown");
    }

    // Update N64 bookings
    console.log(
      "\n📱 Updating N64 bookings with phone numbers and user IDs..."
    );

    // Mario Player booking
    const marioUpdate = await N64Booking.findByIdAndUpdate(
      "6880fa11bf42594f86b59249",
      {
        customerPhone: "+1-555-0123",
        userId: marioUser._id,
      },
      { new: true }
    );
    if (marioUpdate) {
      console.log(
        "✅ Updated Mario Player booking with phone: +1-555-0123 and userId"
      );
    } else {
      console.log("⚠️  Mario Player booking not found");
    }

    // Peach Player booking
    const peachUpdate = await N64Booking.findByIdAndUpdate(
      "6880fa11bf42594f86b5924a",
      {
        customerPhone: "+1-555-0456",
        userId: peachUser._id,
      },
      { new: true }
    );
    if (peachUpdate) {
      console.log(
        "✅ Updated Peach Player booking with phone: +1-555-0456 and userId"
      );
    } else {
      console.log("⚠️  Peach Player booking not found");
    }

    // Update Karaoke bookings
    console.log(
      "\n🎤 Updating Karaoke bookings with phone numbers and user IDs..."
    );

    // Charlie Brown booking
    const charlieUpdate = await KaraokeBooking.findByIdAndUpdate(
      "6880fdfa832380182707582f",
      {
        customerPhone: "+1-555-0789",
        userId: charlieUser._id,
      },
      { new: true }
    );
    if (charlieUpdate) {
      console.log(
        "✅ Updated Charlie Brown booking with phone: +1-555-0789 and userId"
      );
    } else {
      console.log("⚠️  Charlie Brown booking not found");
    }

    console.log("\n================================================");
    console.log(
      "🎉 Phone number & user ID update script completed successfully!"
    );
    console.log("\n💡 Next steps:");
    console.log("   1. Check the admin panels for N64 and Karaoke bookings");
    console.log("   2. Phone numbers should now be visible");
    console.log("   3. User information should be properly linked");
    console.log(
      "   4. Future dummy bookings will include phone numbers and user IDs"
    );
  } catch (error) {
    console.error("\n❌ Script failed:", error);
  } finally {
    // Close the database connection
    console.log("\n🔌 Closing database connection...");
    await mongoose.connection.close();
    console.log("✅ Database connection closed");
    process.exit(0);
  }
};

// Run the script
updateExistingBookings();
