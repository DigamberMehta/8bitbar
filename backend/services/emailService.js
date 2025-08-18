import nodemailer from "nodemailer";
import { getCafeBookingTemplate } from "./templates/cafeBookingTemplate.js";
import { getKaraokeBookingTemplate } from "./templates/karaokeBookingTemplate.js";
import { getN64BookingTemplate } from "./templates/n64BookingTemplate.js";

// Create transporter with 8BitBar SMTP configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "mail.8bitbar.com.au",
  port: process.env.SMTP_PORT || 465,
  secure: process.env.SMTP_SECURE !== "false", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || "orders@8bitbar.com.au",
    pass: process.env.SMTP_PASS || "Arcade123...",
  },
  // Add connection timeout
  connectionTimeout: 20000, // 20 seconds
  greetingTimeout: 20000, // 20 seconds
  socketTimeout: 20000, // 20 seconds
});

// Timeout wrapper function
const withTimeout = (promise, timeoutMs = 20000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error(`Operation timed out after ${timeoutMs}ms`)),
        timeoutMs
      )
    ),
  ]);
};

// Test SMTP connection with timeout
const testConnection = async () => {
  try {
    await withTimeout(transporter.verify(), 20000);
    console.log("✅ SMTP connection verified successfully");
    return true;
  } catch (error) {
    console.warn("⚠️ SMTP connection failed:", error.message);
    return false;
  }
};

// Main function to send booking confirmation email
export const sendBookingConfirmation = async (
  bookingType,
  booking,
  additionalData = {}
) => {
  try {
    // Test connection first
    const connectionOk = await testConnection();
    if (!connectionOk) {
      console.warn("SMTP connection failed, email will not be sent");
      return { success: false, error: "SMTP connection failed" };
    }

    let emailTemplate;

    switch (bookingType) {
      case "cafe":
        emailTemplate = getCafeBookingTemplate(booking);
        break;
      case "karaoke":
        emailTemplate = getKaraokeBookingTemplate(
          booking,
          additionalData.roomName
        );
        break;
      case "n64":
        emailTemplate = getN64BookingTemplate(booking, additionalData.roomName);
        break;
      default:
        throw new Error("Invalid booking type");
    }

    const mailOptions = {
      from: '"8-Bit Bar" <orders@8bitbar.com.au>',
      to: booking.customerEmail,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    };

    const result = await withTimeout(transporter.sendMail(mailOptions), 20000);
    console.log(
      "✅ Booking confirmation email sent successfully:",
      result.messageId
    );
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error(
      "❌ Error sending booking confirmation email:",
      error.message
    );

    // If it's a timeout error, provide specific information
    if (error.message.includes("timed out")) {
      console.error("⏰ Email service timed out after 20 seconds");
      console.error("   This prevents the booking process from hanging");
      console.error("   The booking was still created successfully");
    }
    // If it's a DNS error, provide helpful information
    else if (error.code === "EDNS" || error.code === "ENOTFOUND") {
      console.error("📧 SMTP server not found. Please check:");
      console.error("   1. SMTP hostname: smtp.8bitbar.com.au");
      console.error("   2. Network connectivity");
      console.error("   3. DNS resolution");
      console.error(
        "   4. Consider using environment variables for SMTP config"
      );
    }

    return { success: false, error: error.message };
  }
};

// Fire-and-forget email function that doesn't block the response
export const sendBookingConfirmationAsync = (
  bookingType,
  booking,
  additionalData = {}
) => {
  // Don't await this - let it run in background
  sendBookingConfirmation(bookingType, booking, additionalData)
    .then((result) => {
      if (result.success) {
        console.log(
          `📧 Email sent successfully for ${bookingType} booking:`,
          booking._id
        );
      } else {
        console.warn(
          `📧 Email failed for ${bookingType} booking:`,
          booking._id,
          result.error
        );
      }
    })
    .catch((error) => {
      console.error(
        `📧 Email error for ${bookingType} booking:`,
        booking._id,
        error.message
      );
    });
};

export default { sendBookingConfirmation, sendBookingConfirmationAsync };
