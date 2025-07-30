import { sendBookingConfirmation } from "../services/emailService.js";

// Test data for different booking types
const testBookings = {
  cafe: {
    customerName: "John Doe",
    customerEmail: "orders@8bitbar.com.au",
    chairIds: ["A1", "A2", "B3"],
    date: "2025-02-15",
    time: "14:00",
    duration: 2,
    totalCost: 60.0,
    status: "confirmed",
  },

  karaoke: {
    customerName: "Jane Smith",
    customerEmail: "orders@8bitbar.com.au",
    startDateTime: new Date("2025-02-15T17:00:00"),
    endDateTime: new Date("2025-02-15T20:00:00"),
    durationHours: 3,
    numberOfPeople: 4,
    totalPrice: 120.0,
    status: "confirmed",
  },

  n64: {
    customerName: "Mike Johnson",
    customerEmail: "orders@8bitbar.com.au",
    startDateTime: new Date("2025-02-15T14:00:00"),
    endDateTime: new Date("2025-02-15T18:00:00"),
    durationHours: 4,
    numberOfPeople: 2,
    totalPrice: 160.0,
    status: "confirmed",
  },
};

// Test function
const testNewTemplates = async () => {
  console.log("🎨 Testing New Professional Email Templates");
  console.log("==========================================\n");

  try {
    // Test Cafe Booking Email (2-4 PM should show 2:00-3:55)
    console.log(
      "📧 Testing Cafe Booking (2:00-4:00 → should show 2:00-3:55)..."
    );
    const cafeResult = await sendBookingConfirmation("cafe", testBookings.cafe);
    console.log("Result:", cafeResult.success ? "✅ SUCCESS" : "❌ FAILED");
    if (cafeResult.messageId) console.log("Message ID:", cafeResult.messageId);
    console.log("---");

    // Wait between emails
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Test Karaoke Booking Email (5-8 PM should show 5:00-7:55)
    console.log(
      "📧 Testing Karaoke Booking (5:00-8:00 PM → should show 5:00-7:55 PM)..."
    );
    const karaokeResult = await sendBookingConfirmation(
      "karaoke",
      testBookings.karaoke,
      { roomName: "Wonderland Karaoke Room" }
    );
    console.log("Result:", karaokeResult.success ? "✅ SUCCESS" : "❌ FAILED");
    if (karaokeResult.messageId)
      console.log("Message ID:", karaokeResult.messageId);
    console.log("---");

    // Wait between emails
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Test N64 Booking Email (2-6 PM should show 2:00-5:55)
    console.log(
      "📧 Testing N64 Booking (2:00-6:00 PM → should show 2:00-5:55 PM)..."
    );
    const n64Result = await sendBookingConfirmation("n64", testBookings.n64, {
      roomName: "Mickey N64 Booth",
    });
    console.log("Result:", n64Result.success ? "✅ SUCCESS" : "❌ FAILED");
    if (n64Result.messageId) console.log("Message ID:", n64Result.messageId);
    console.log("---");

    // Summary
    console.log("📊 Test Summary:");
    console.log(
      `Cafe Email: ${cafeResult.success ? "✅ Success" : "❌ Failed"}`
    );
    console.log(
      `Karaoke Email: ${karaokeResult.success ? "✅ Success" : "❌ Failed"}`
    );
    console.log(`N64 Email: ${n64Result.success ? "✅ Success" : "❌ Failed"}`);

    const successCount = [cafeResult, karaokeResult, n64Result].filter(
      (r) => r.success
    ).length;

    if (successCount === 3) {
      console.log("\n🎉 ALL NEW TEMPLATES SENT SUCCESSFULLY!");
      console.log("📧 Check your email inbox for 3 professional emails");
      console.log(
        "🕐 Verify the time calculations show correct cleaning buffer"
      );
      console.log("✨ New templates are elegant, clean, and professional!");
    } else {
      console.log(`\n⚠️ ${successCount}/3 emails sent successfully.`);
    }
  } catch (error) {
    console.error("❌ Test failed with error:", error.message);
  }
};

// Run the test
testNewTemplates().catch(console.error);
