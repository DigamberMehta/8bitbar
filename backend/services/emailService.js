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
});

// Test SMTP connection
const testConnection = async () => {
  try {
    await transporter.verify();
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

    const result = await transporter.sendMail(mailOptions);
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

    // If it's a DNS error, provide helpful information
    if (error.code === "EDNS" || error.code === "ENOTFOUND") {
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

export default { sendBookingConfirmation };
