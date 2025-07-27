import express from "express";
import { randomUUID } from "crypto";
import authenticateUser from "../middlewares/authenticateUser.js";
import CafeBooking from "../models/CafeBooking.js";
import KaraokeBooking from "../models/KaraokeBooking.js";
import N64Booking from "../models/N64Booking.js";

const router = express.Router();

// Square API configuration
const getSquareConfig = () => {
  const environment = process.env.SQUARE_ENVIRONMENT || "sandbox";
  const isProduction = environment === "production";

  return {
    baseURL: isProduction
    ? "https://connect.squareup.com"
      : "https://connect.squareupsandbox.com",
    version: "2023-10-18",
    environment: environment,
  };
};

const SQUARE_CONFIG = getSquareConfig();

// Test route to verify Square API setup
router.get("/test", authenticateUser, async (req, res) => {
  try {
    console.log("Testing Square API configuration...");
    console.log(
      "Access Token:",
      process.env.SQUARE_ACCESS_TOKEN ? "Set" : "Not set"
    );
    console.log("Location ID:", process.env.SQUARE_LOCATION_ID);
    console.log("Environment:", SQUARE_CONFIG.environment);
    console.log("Base URL:", SQUARE_CONFIG.baseURL);

    // Test the locations API to verify credentials
    const response = await fetch(`${SQUARE_CONFIG.baseURL}/v2/locations`, {
      method: "GET",
      headers: {
        "Square-Version": SQUARE_CONFIG.version,
        Authorization: `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok) {
      res.json({
        success: true,
        message: "Square API configured successfully",
        locations:
          data.locations?.map((loc) => ({
            id: loc.id,
            name: loc.name,
            status: loc.status,
          })) || [],
        environment: SQUARE_CONFIG.environment,
        baseURL: SQUARE_CONFIG.baseURL,
      });
    } else {
      throw new Error(`Square API error: ${JSON.stringify(data)}`);
    }
  } catch (error) {
    console.error("Square API test failed:", error);
    res.status(500).json({
      success: false,
      message: "Square API configuration failed",
      error: error.message,
    });
  }
});

// POST /process
router.post("/process", authenticateUser, async (req, res) => {
  try {
    const { sourceId, amount, currency = "AUD", locationId } = req.body;

    console.log("Payment request received:", {
      sourceId: sourceId ? "Present" : "Missing",
      amount,
      currency,
      locationId,
      userId: req.user.id,
    });

    if (!sourceId || !amount) {
      return res
        .status(400)
        .json({ success: false, message: "Missing sourceId or amount" });
    }

    const finalLocationId = locationId || process.env.SQUARE_LOCATION_ID;
    if (!finalLocationId) {
      return res
        .status(400)
        .json({ success: false, message: "Location ID is required" });
    }

    // Convert amount to cents (Square expects amounts in the smallest currency unit)
    const amountInCents = Math.round(amount * 100);

    console.log("Processing payment:", {
      amountInCents,
      currency: currency.toUpperCase(),
      locationId: finalLocationId,
      userId: req.user.id,
    });

    const requestBody = {
      source_id: sourceId,
      idempotency_key: randomUUID(),
      amount_money: {
        amount: amountInCents,
        currency: currency.toUpperCase(),
      },
      location_id: finalLocationId,
      note: `User ID: ${req.user.id}`,
    };

    const response = await fetch(`${SQUARE_CONFIG.baseURL}/v2/payments`, {
      method: "POST",
      headers: {
        "Square-Version": SQUARE_CONFIG.version,
        Authorization: `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (response.ok) {
      const payment = data.payment;
      console.log("Payment successful:", payment.id);

      res.json({
        success: true,
        payment: {
          id: payment.id,
          status: payment.status,
          amountMoney: payment.amount_money,
          createdAt: payment.created_at,
        },
      });
    } else {
      console.error("Payment error:", data);
      const squareError = data.errors?.[0];
      res.status(response.status).json({
        success: false,
        message: squareError?.detail || "Payment failed",
        code: squareError?.code,
        category: squareError?.category,
      });
    }
  } catch (err) {
    console.error("Payment error details:", err.message);
    res.status(500).json({
      success: false,
      message: err.message || "Payment processing failed",
    });
  }
});

// POST /refund
router.post("/refund", authenticateUser, async (req, res) => {
  try {
    const { paymentId, amount, reason } = req.body;

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: "Payment ID is required for refund",
      });
    }

    const requestBody = {
      idempotency_key: randomUUID(),
      amount_money: amount
        ? {
            amount: Math.round(amount * 100),
            currency: "AUD",
          }
        : undefined,
      payment_id: paymentId,
      reason: reason || "Customer requested refund",
    };

    const response = await fetch(`${SQUARE_CONFIG.baseURL}/v2/refunds`, {
      method: "POST",
      headers: {
        "Square-Version": SQUARE_CONFIG.version,
        Authorization: `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (response.ok) {
      const refund = data.refund;
      res.status(200).json({
        success: true,
        message: "Refund processed successfully",
        refund: {
          id: refund.id,
          status: refund.status,
          amountMoney: refund.amount_money,
          paymentId: refund.payment_id,
          createdAt: refund.created_at,
        },
      });
    } else {
      console.error("Refund error:", data);
      const squareError = data.errors?.[0];
      res.status(response.status).json({
        success: false,
        message: squareError?.detail || "Refund processing failed",
        code: squareError?.code,
        category: squareError?.category,
      });
    }
  } catch (error) {
    console.error("Refund processing error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Refund processing failed",
    });
  }
});

// POST /webhook - Handle Square payment notifications
router.post("/webhook", async (req, res) => {
  try {
    const { type, data } = req.body;

    // Handle payment.updated event
    if (type === "payment.updated" || type === "payment.created") {
      const payment = data.object;
      const paymentId = payment.id;
      const paymentStatus = payment.status;

      console.log(`Payment webhook received: ${paymentId} - ${paymentStatus}`);

      // Update booking status based on payment status
      let bookingStatus = "pending";
      if (paymentStatus === "COMPLETED") {
        bookingStatus = "confirmed";
      } else if (paymentStatus === "FAILED" || paymentStatus === "CANCELED") {
        bookingStatus = "cancelled";
      }

      // Update all booking types with this payment ID
      const updatePromises = [
        CafeBooking.updateMany(
          { paymentId: paymentId },
          {
            status: bookingStatus,
            paymentStatus: paymentStatus.toLowerCase(),
          }
        ),
        KaraokeBooking.updateMany(
          { paymentId: paymentId },
          {
            status: bookingStatus,
            paymentStatus: paymentStatus.toLowerCase(),
          }
        ),
        N64Booking.updateMany(
          { paymentId: paymentId },
          {
            status: bookingStatus,
            paymentStatus: paymentStatus.toLowerCase(),
          }
        ),
      ];

      await Promise.all(updatePromises);

      console.log(
        `Updated booking status for payment ${paymentId} to ${bookingStatus}`
      );
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
