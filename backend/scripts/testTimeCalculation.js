import { sendBookingConfirmation } from "../services/emailService.js";

// Test specific time calculation scenarios
const testTimeCalculations = async () => {
  console.log("🕐 Testing Time Calculation Fixes");
  console.log("=================================\n");

  // Test Case 1: 3:00 PM - 4:00 PM should show 3:00 PM - 3:55 PM
  const karaokeTest1 = {
    customerName: "Time Test User",
    customerEmail: "orders@8bitbar.com.au",
    startDateTime: new Date("2025-07-31T15:00:00"), // 3:00 PM
    endDateTime: new Date("2025-07-31T16:00:00"), // 4:00 PM
    durationHours: 1,
    numberOfPeople: 2,
    totalPrice: 40.0,
    status: "confirmed",
  };

  console.log(
    "📧 Test 1: Karaoke 3:00 PM - 4:00 PM (should show 3:00 PM - 3:55 PM)"
  );
  const result1 = await sendBookingConfirmation("karaoke", karaokeTest1, {
    roomName: "Test Room",
  });
  console.log("Result:", result1.success ? "✅ SUCCESS" : "❌ FAILED");
  if (result1.messageId) console.log("Message ID:", result1.messageId);
  console.log("---");

  // Wait between emails
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Test Case 2: 2:00 PM - 6:00 PM should show 2:00 PM - 5:55 PM
  const n64Test = {
    customerName: "Time Test User 2",
    customerEmail: "orders@8bitbar.com.au",
    startDateTime: new Date("2025-07-31T14:00:00"), // 2:00 PM
    endDateTime: new Date("2025-07-31T18:00:00"), // 6:00 PM
    durationHours: 4,
    numberOfPeople: 2,
    totalPrice: 160.0,
    status: "confirmed",
  };

  console.log(
    "📧 Test 2: N64 2:00 PM - 6:00 PM (should show 2:00 PM - 5:55 PM)"
  );
  const result2 = await sendBookingConfirmation("n64", n64Test, {
    roomName: "Test Booth",
  });
  console.log("Result:", result2.success ? "✅ SUCCESS" : "❌ FAILED");
  if (result2.messageId) console.log("Message ID:", result2.messageId);
  console.log("---");

  // Wait between emails
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Test Case 3: Cafe 14:00 - 16:00 should show 14:00 - 15:55
  const cafeTest = {
    customerName: "Time Test User 3",
    customerEmail: "orders@8bitbar.com.au",
    chairIds: ["A1", "A2"],
    date: "2025-07-31",
    time: "14:00",
    duration: 2,
    totalCost: 40.0,
    status: "confirmed",
  };

  console.log("📧 Test 3: Cafe 14:00 - 16:00 (should show 14:00 - 15:55)");
  const result3 = await sendBookingConfirmation("cafe", cafeTest);
  console.log("Result:", result3.success ? "✅ SUCCESS" : "❌ FAILED");
  if (result3.messageId) console.log("Message ID:", result3.messageId);
  console.log("---");

  console.log("📊 Time Calculation Test Summary:");
  console.log(
    `Test 1 (Karaoke): ${result1.success ? "✅ Success" : "❌ Failed"}`
  );
  console.log(`Test 2 (N64): ${result2.success ? "✅ Success" : "❌ Failed"}`);
  console.log(`Test 3 (Cafe): ${result3.success ? "✅ Success" : "❌ Failed"}`);

  console.log("\n📧 Check your email inbox to verify:");
  console.log("1. Karaoke shows: 3:00 pm - 3:55 pm");
  console.log("2. N64 shows: 2:00 pm - 5:55 pm");
  console.log("3. Cafe shows: 14:00 - 15:55");
  console.log("4. No instruction sections appear");
  console.log("5. Responsive design works on mobile");
};

// Run the test
testTimeCalculations().catch(console.error);
