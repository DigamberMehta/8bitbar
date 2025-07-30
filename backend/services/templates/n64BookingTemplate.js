// Helper function to calculate actual end time (minus 5 minutes for cleaning)
const calculateActualEndTime = (startTime, duration) => {
  const match = startTime.match(/(\d+):(\d+) (AM|PM)/);
  if (!match) return startTime;
  const [_, hour, minute, period] = match;
  let endHour = parseInt(hour);
  if (period === "PM" && endHour !== 12) endHour += 12;
  if (period === "AM" && endHour === 12) endHour = 0;

  // Add duration hours
  endHour += duration;
  let endMinute = parseInt(minute);

  // Subtract 5 minutes for cleaning
  endMinute -= 5;
  if (endMinute < 0) {
    endMinute += 60;
    endHour -= 1;
  }

  // Handle day rollover
  endHour = endHour % 24;

  let displayHour = endHour;
  let displayPeriod = "AM";
  if (endHour >= 12) {
    displayPeriod = "PM";
    if (endHour > 12) displayHour = endHour - 12;
  }
  if (endHour === 0) displayHour = 12;
  return `${displayHour}:${endMinute
    .toString()
    .padStart(2, "0")} ${displayPeriod}`;
};

// Email template for N64 booking confirmation
export const getN64BookingTemplate = (booking, roomName) => {
  const startTime = new Date(booking.startDateTime).toLocaleTimeString(
    "en-AU",
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }
  );
  const actualEndTime = calculateActualEndTime(
    startTime,
    booking.durationHours
  );

  return {
    subject: "Your N64 Gaming Session is Confirmed - 8BitBar",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>N64 Booking Confirmation</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;        
    line-height: 1.6;
            color: #333333;
            background-color: #f8f9fa;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header { 
            background: linear-gradient(135deg, #ff7675 0%, #e17055 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
          }
          .logo { 
            font-size: 32px; 
            font-weight: 700; 
            margin-bottom: 10px;
            letter-spacing: 2px;
          }
          .header-subtitle {
            font-size: 18px;
            opacity: 0.9;
            font-weight: 300;
          }
          .content { 
            padding: 40px 30px;
          }
          .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #2c3e50;
          }
          .intro-text {
            font-size: 16px;
            color: #5a6c7d;
            margin-bottom: 30px;
            line-height: 1.5;
          }
          .booking-card { 
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 12px;
            padding: 30px;
            margin: 30px 0;
          }
          .booking-title {
            font-size: 20px;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 25px;
            text-align: center;
          }
          .detail-grid {
            display: grid;
            gap: 20px;
          }
          .detail-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 0;
            border-bottom: 1px solid #e9ecef;
          }
          .detail-item:last-child {
            border-bottom: none;
          }
          .detail-label {
            font-weight: 600;
            color: #495057;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .detail-value {
            font-size: 16px;
            color: #2c3e50;
            font-weight: 500;
          }
          .booth-name {
            background: #ff7675;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
          }
          .time-notice {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
            text-align: center;
          }
          .time-notice-title {
            font-weight: 600;
            color: #856404;
            margin-bottom: 8px;
            font-size: 14px;
          }
          .time-notice-text {
            color: #856404;
            font-size: 14px;
            line-height: 1.4;
          }
          .actual-time {
            font-weight: 700;
            color: #d63031;
          }

          .status-badge {
            display: inline-block;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .status-confirmed {
            background: #d4edda;
            color: #155724;
          }
          .status-pending {
            background: #fff3cd;
            color: #856404;
          }
          .footer {
            background: #2c3e50;
            padding: 30px;
            text-align: center;
            color: #bdc3c7;
          }
          .footer-logo {
            font-size: 24px;
            font-weight: 700;
            color: #ecf0f1;
            margin-bottom: 15px;
            letter-spacing: 1px;
          }
          .footer-text {
            font-size: 14px;
            line-height: 1.5;
          }
          .footer-contact {
            margin-top: 15px;
            font-size: 14px;
          }
          .footer-contact a {
            color: #74b9ff;
            text-decoration: none;
          }
          @media (max-width: 600px) {
            .content { padding: 30px 20px; }
            .header { padding: 30px 20px; }
            .booking-card { padding: 20px; }
            .detail-item { 
              flex-direction: column; 
              align-items: flex-start; 
              gap: 8px; 
              padding: 12px 0;
            }
            .detail-label {
              font-size: 12px;
            }
            .detail-value {
              font-size: 14px;
            }
            .time-notice {
              padding: 15px;
            }
            .time-notice-title {
              font-size: 13px;
            }
            .time-notice-text {
              font-size: 13px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">8BITBAR</div>
            <div class="header-subtitle">Gaming Lounge & Retro Gaming</div>
          </div>
          
          <div class="content">
            <div class="greeting">Hello ${booking.customerName},</div>
            <div class="intro-text">
              Get ready for some classic Nintendo 64 gaming! Your booth is reserved and waiting for an epic retro gaming session.
            </div>
            
            <div class="booking-card">
              <div class="booking-title">Your N64 Gaming Session Details</div>
              
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">Gaming Booth</span>
                  <span class="booth-name">${
                    roomName || "N64 Gaming Booth"
                  }</span>
                </div>
                
                <div class="detail-item">
                  <span class="detail-label">Date</span>
                  <span class="detail-value">${new Date(
                    booking.startDateTime
                  ).toLocaleDateString("en-AU", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}</span>
                </div>
                
                <div class="detail-item">
                  <span class="detail-label">Reserved Time</span>
                  <span class="detail-value">${startTime} - ${new Date(
      booking.endDateTime
    ).toLocaleTimeString("en-AU", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })}</span>
                </div>
                
                <div class="detail-item">
                  <span class="detail-label">Duration</span>
                  <span class="detail-value">${booking.durationHours} hour${
      booking.durationHours > 1 ? "s" : ""
    }</span>
                </div>
                
                <div class="detail-item">
                  <span class="detail-label">Players</span>
                  <span class="detail-value">${booking.numberOfPeople} ${
      booking.numberOfPeople === 1 ? "player" : "players"
    }</span>
                </div>
                
                <div class="detail-item">
                  <span class="detail-label">Total Amount</span>
                  <span class="detail-value">$${booking.totalPrice.toFixed(
                    2
                  )}</span>
                </div>
                
                <div class="detail-item">
                  <span class="detail-label">Status</span>
                  <span class="status-badge status-${booking.status}">${
      booking.status
    }</span>
                </div>
              </div>
            </div>
            
            <div class="intro-text">
              Time to relive the golden age of gaming! If you need to make any changes to your booking, please contact us as soon as possible. See you soon!
            </div>
          </div>
          
          <div class="footer">
            <div class="footer-logo">8BITBAR</div>
            <div class="footer-text">
              Where Gaming Meets Great Times
            </div>
            <div class="footer-contact">
              📧 <a href="mailto:orders@8bitbar.com.au">orders@8bitbar.com.au</a><br>
              🌐 <a href="https://www.8bitbar.com.au">www.8bitbar.com.au</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  };
};
