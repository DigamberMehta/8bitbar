import dotenv from "dotenv";
import mongoose from "mongoose";
import addDummyCafeBookings from "../init/addDummyCafeBookings.js";

// Load environment variables
dotenv.config();

const runScript = async () => {
  try {
    console.log("🚀 Starting Dummy Cafe Bookings Script");
    console.log("=====================================\n");

    // Connect to MongoDB
    console.log("🔌 Connecting to database...");
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/8bitbar"
    );
    console.log("✅ Connected to MongoDB\n");

    // Add dummy bookings
    await addDummyCafeBookings();

    console.log("\n=====================================");
    console.log("🎉 Dummy bookings script completed successfully!");
    console.log("\n💡 Next steps:");
    console.log("   1. Go to /cafe-booking page");
    console.log("   2. Select July 26, 2025 as date");
    console.log("   3. Select chairs c1 and c2");
    console.log("   4. Notice 4:00 PM and 5:00 PM slots are blocked");
    console.log("   5. Check admin panel for the booking");
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
runScript();
