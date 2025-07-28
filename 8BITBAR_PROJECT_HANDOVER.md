# 8bitbar Project Handover Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Backend Documentation](#backend-documentation)
4. [Frontend Documentation](#frontend-documentation)
5. [Database Models](#database-models)
6. [API Routes](#api-routes)
7. [Authentication & Security](#authentication--security)
8. [Payment Integration](#payment-integration)
9. [Deployment](#deployment)
10. [Environment Setup](#environment-setup)
11. [Maintenance & Updates](#maintenance--updates)
12. [Troubleshooting](#troubleshooting)

## Project Overview

**8bitbar** is a comprehensive booking management system for a gaming cafe with multiple services:

- **Cafe Booking**: Interactive seat booking with visual layout editor
- **Karaoke Rooms**: Room booking system with themed rooms
- **N64 Gaming Booths**: Gaming booth reservations
- **Admin Panel**: Complete management interface for all services

### Key Features

- Real-time booking system
- Interactive cafe layout editor
- Payment processing via Square
- Multi-role authentication (Customer/Admin)
- Responsive design for mobile and desktop
- Template-based cafe layouts
- Booking management and analytics

## Architecture

### Tech Stack

- **Backend**: Node.js, Express.js, MongoDB
- **Frontend**: React.js, Vite, Tailwind CSS
- **Database**: MongoDB with Mongoose ODM
- **Payment**: Square API integration
- **Authentication**: JWT with HTTP-only cookies
- **Deployment**: Vercel (Frontend), Railway/Render (Backend)

### Project Structure

```
8bitbar/
├── backend/                 # Node.js/Express API
│   ├── app.js             # Main server file
│   ├── database/          # Database connection
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   ├── middlewares/       # Authentication & validation
│   ├── utils/             # Helper functions
│   └── scripts/           # Database scripts
└── frontend/              # React application
    ├── src/
    │   ├── components/    # Reusable components
    │   ├── pages/         # Page components
    │   ├── contexts/      # React contexts
    │   └── utils/         # Utility functions
    └── public/            # Static assets
```

## Backend Documentation

### Main Server (app.js)

- **Port**: 3000 (default) or process.env.PORT
- **CORS**: Environment-specific origins
- **Environment**: Sandbox/Production toggle
- **Health Check**: `/api/v1/health`

### Database Connection

- **MongoDB URI**: `process.env.MONGODB_URI`
- **Fallback**: `mongodb://127.0.0.1:27017/8bitbar`
- **Connection**: Automatic with error handling

### Environment Variables (Backend)

```env
# Database
MONGODB_URI=mongodb://localhost:27017/8bitbar

# Authentication
SECRET_KEY=your_jwt_secret_key

# Square Payment
SQUARE_ACCESS_TOKEN=your_square_access_token
SQUARE_LOCATION_ID=your_square_location_id
SQUARE_ENVIRONMENT=sandbox|production

# Server
PORT=3000
```

## Database Models

### 1. User Model (user.model.js)

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  dob: Date (optional),
  role: String (enum: ["customer", "admin"], default: "customer"),
  createdAt: Date,
  updatedAt: Date
}
```

### 2. CafeBooking Model (CafeBooking.js)

```javascript
{
  userId: ObjectId (ref: User),
  chairIds: [String] (required),
  date: String (required),
  time: String (required),
  duration: Number (1-8 hours),
  totalCost: Number (required),
  status: String (enum: ["pending", "confirmed", "cancelled", "completed"]),
  customerName: String (required),
  customerEmail: String (required),
  customerPhone: String,
  specialRequests: String,
  deviceType: String (enum: ["desktop", "mobile"]),
  paymentId: String (sparse),
  paymentStatus: String (enum: ["pending", "completed", "failed", "refunded"])
}
```

### 3. KaraokeBooking Model (KaraokeBooking.js)

```javascript
{
  userId: ObjectId (ref: User),
  roomId: ObjectId (ref: KaraokeRoom),
  customerName: String (required),
  customerEmail: String (required),
  customerPhone: String,
  numberOfPeople: Number (required),
  startDateTime: Date (required),
  endDateTime: Date (required),
  durationHours: Number (integer),
  totalPrice: Number (required),
  status: String (enum: ["pending", "confirmed", "cancelled", "completed"]),
  paymentId: String (sparse),
  paymentStatus: String (enum: ["pending", "completed", "failed", "refunded"])
}
```

### 4. N64Booking Model (N64Booking.js)

```javascript
{
  userId: ObjectId (ref: User),
  roomId: ObjectId (ref: N64Room),
  roomType: String (enum: ["mickey", "minnie"]),
  customerName: String (required),
  customerEmail: String (required),
  customerPhone: String,
  numberOfPeople: Number (required),
  startDateTime: Date (required),
  endDateTime: Date (required),
  durationHours: Number (integer),
  totalPrice: Number (required),
  status: String (enum: ["pending", "confirmed", "cancelled", "completed"]),
  paymentId: String (sparse),
  paymentStatus: String (enum: ["pending", "completed", "failed", "refunded"])
}
```

### 5. CafeLayout Model (CafeLayout.js)

```javascript
{
  templateName: String (required),
  chairs: [{
    id: String (required),
    x: Number (required),
    y: Number (required),
    width: Number (required),
    height: Number (required),
    color: String (required)
  }],
  tables: [{
    id: String (required),
    type: String (enum: ["round-table", "corner-table"]),
    x: Number (required),
    y: Number (required),
    radius: Number (for round tables),
    width: Number (for corner tables),
    height: Number (for corner tables),
    color: String (required)
  }],
  bgImageUrl: String,
  canvasWidth: Number (default: 1000),
  canvasHeight: Number (default: 2400),
  updatedBy: ObjectId (ref: User),
  changeType: String (enum: ["added", "removed", "updated"]),
  deviceType: String (enum: ["desktop", "mobile"]),
  isActive: Boolean (default: true),
  isActiveForBooking: Boolean (default: false)
}
```

### 6. CafeSettings Model (CafeSettings.js)

```javascript
{
  templateName: String (required, unique),
  timeSlots: [String] (default: 14:00-23:00),
  pricePerChairPerHour: Number (default: 10),
  maxDuration: Number (default: 8),
  openingTime: String (default: "14:00"),
  closingTime: String (default: "23:00"),
  updatedBy: ObjectId (ref: User)
}
```

### 7. KaraokeRoom Model (KaraokeRoom.js)

```javascript
{
  name: String (required),
  description: String (required),
  maxPeople: Number (default: 12),
  pricePerHour: Number (required),
  timeSlots: [String] (default: 2:00 PM - 10:00 PM),
  inclusions: {
    microphones: Number (default: 4),
    features: [String]
  },
  imageUrl: String,
  images: [String],
  isVisible: Boolean (default: true),
  isActive: Boolean (default: true)
}
```

### 8. N64Room Model (N64Room.js)

```javascript
{
  name: String (required, enum: ["Mickey Mouse N64 Room", "Minnie Mouse N64 Room"]),
  description: String (required),
  maxPeople: Number (default: 4),
  pricePerHour: Number (required),
  timeSlots: [String] (default: 2:00 PM - 10:00 PM),
  inclusions: {
    controllers: Number (default: 4),
    features: [String]
  },
  imageUrl: String,
  images: [String],
  roomType: String (enum: ["mickey", "minnie"], required)
}
```

## API Routes

### Base URL: `/api/v1`

### 1. User Routes (`/user`)

- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /profile` - Get user profile (protected)

### 2. Cafe Routes (`/cafe`)

- `GET /cafe-layout` - Get cafe layout
- `POST /cafe-layout` - Create/update cafe layout
- `GET /cafe-settings` - Get cafe settings
- `PUT /cafe-settings` - Update cafe settings
- `POST /bookings` - Create cafe booking
- `GET /bookings/available` - Get available time slots

### 3. Karaoke Routes (`/karaoke-rooms`)

- `GET /` - Get all karaoke rooms
- `GET /:id` - Get specific karaoke room
- `POST /` - Create karaoke room (admin)
- `PUT /:id` - Update karaoke room (admin)
- `DELETE /:id` - Delete karaoke room (admin)
- `POST /:id/bookings` - Create karaoke booking
- `GET /:id/available-slots` - Get available time slots

### 4. N64 Routes (`/n64-rooms`)

- `GET /` - Get all N64 rooms
- `GET /:id` - Get specific N64 room
- `POST /` - Create N64 room (admin)
- `PUT /:id` - Update N64 room (admin)
- `DELETE /:id` - Delete N64 room (admin)
- `POST /:id/bookings` - Create N64 booking
- `GET /:id/available-slots` - Get available time slots

### 5. Admin Routes (`/admin`)

- `GET /dashboard` - Admin dashboard
- `GET /users` - Get all users
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

#### Cafe Admin (`/admin/cafe`)

- `GET /cafe-layout/templates` - Get all templates
- `PUT /cafe-layout` - Update cafe layout
- `GET /cafe-settings` - Get cafe settings
- `PUT /cafe-settings` - Update cafe settings
- `GET /bookings` - Get all cafe bookings
- `PUT /bookings/:id` - Update booking status

#### Karaoke Admin (`/admin/karaoke`)

- `GET /rooms` - Get all karaoke rooms
- `POST /rooms` - Create karaoke room
- `PUT /rooms/:id` - Update karaoke room
- `DELETE /rooms/:id` - Delete karaoke room
- `GET /bookings` - Get all karaoke bookings
- `PUT /bookings/:id` - Update booking status

#### N64 Admin (`/admin/n64`)

- `GET /rooms` - Get all N64 rooms
- `POST /rooms` - Create N64 room
- `PUT /rooms/:id` - Update N64 room
- `DELETE /rooms/:id` - Delete N64 room
- `GET /bookings` - Get all N64 bookings
- `PUT /bookings/:id` - Update booking status

### 6. Payment Routes (`/payments`)

- `GET /test` - Test Square API configuration
- `POST /process` - Process payment
- `POST /refund` - Process refund
- `POST /webhook` - Handle Square webhooks

## Authentication & Security

### JWT Implementation

- **Token Storage**: HTTP-only cookies + Authorization header fallback
- **Token Expiry**: 30 days
- **Secret Key**: `process.env.SECRET_KEY`
- **Production**: Secure cookies with sameSite: "none"

### Middleware

- **authenticateUser**: Verifies JWT token for protected routes
- **authenticateAdmin**: Verifies admin role in addition to authentication
- **Rate Limiting**: 5 requests per minute for auth routes

### Security Features

- Password hashing with bcryptjs
- CORS configuration per environment
- Rate limiting on sensitive routes
- Input validation and sanitization
- Secure cookie configuration

## Payment Integration

### Square API Integration

- **Environment**: Sandbox/Production toggle
- **Base URL**: Environment-specific Square endpoints
- **API Version**: 2023-10-18
- **Features**: Payment processing, refunds, webhooks

### Payment Flow

1. Frontend creates payment source
2. Backend processes payment with Square
3. Webhook updates booking status
4. Payment status synchronized across booking types

### Webhook Handling

- **Events**: `payment.updated`, `payment.created`
- **Actions**: Updates booking status based on payment status
- **Supported**: All booking types (Cafe, Karaoke, N64)

## Frontend Documentation

### Technology Stack

- **Framework**: React 18 with Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios with interceptors
- **UI Components**: Headless UI, Heroicons, Lucide React
- **Canvas**: React Konva for layout editor

### Key Components

#### Authentication

- `LoginModal.jsx` - User login modal
- `SignupModal.jsx` - User registration modal
- `AuthContext.jsx` - Global authentication state
- `ProtectedAdminRoute.jsx` - Admin route protection

#### Cafe Booking

- `CafeBookingPage.jsx` - Main cafe booking interface
- `BarMapEditor.jsx` - Interactive layout editor
- `CafeLayoutViewer.jsx` - Layout display component
- `BookingForm.jsx` - Booking form component

#### Admin Panel

- `AdminLayout.jsx` - Admin layout wrapper
- `AdminDashboard.jsx` - Dashboard overview
- `CafeBookingsAdmin.jsx` - Cafe booking management
- `CafeSettingsAdmin.jsx` - Cafe settings management
- `KaraokeBookingsAdmin.jsx` - Karaoke booking management
- `N64BookingsAdmin.jsx` - N64 booking management

#### Payment

- `SquarePaymentForm.jsx` - Square payment integration
- `CheckoutPage.jsx` - Checkout process

### Environment Variables (Frontend)

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api/v1

# Square Configuration
VITE_SQUARE_APPLICATION_ID=your_square_app_id
VITE_SQUARE_LOCATION_ID=your_square_location_id
VITE_SQUARE_ENVIRONMENT=sandbox|production
```

## Deployment

### Backend Deployment

1. **Platform**: Railway, Render, or similar
2. **Environment Variables**: Set all required variables
3. **Database**: MongoDB Atlas or self-hosted
4. **Domain**: Configure custom domain if needed

### Frontend Deployment

1. **Platform**: Vercel (recommended)
2. **Build Command**: `npm run build`
3. **Output Directory**: `dist`
4. **Environment Variables**: Set in Vercel dashboard

### Production Checklist

- [ ] Set `SQUARE_ENVIRONMENT=production`
- [ ] Configure production CORS origins
- [ ] Set secure cookie options
- [ ] Configure MongoDB Atlas
- [ ] Set up custom domain
- [ ] Configure SSL certificates
- [ ] Set up monitoring and logging

## Environment Setup

### Development Setup

#### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### Required Environment Variables

#### Backend (.env)

```env
# Database
MONGODB_URI=mongodb://localhost:27017/8bitbar

# Authentication
SECRET_KEY=your_secure_jwt_secret

# Square Payment
SQUARE_ACCESS_TOKEN=your_square_access_token
SQUARE_LOCATION_ID=your_square_location_id
SQUARE_ENVIRONMENT=sandbox

# Server
PORT=3000
```

#### Frontend (.env)

```env
# API
VITE_API_BASE_URL=http://localhost:3000/api/v1

# Square
VITE_SQUARE_APPLICATION_ID=your_square_app_id
VITE_SQUARE_LOCATION_ID=your_square_location_id
VITE_SQUARE_ENVIRONMENT=sandbox
```

## Maintenance & Updates

### Database Maintenance

- **Backup**: Regular MongoDB backups
- **Indexes**: Optimize query performance
- **Cleanup**: Archive old bookings periodically
- **Monitoring**: Monitor database performance

### Code Updates

- **Dependencies**: Regular security updates
- **Square API**: Keep up with API changes
- **React**: Update to latest stable versions
- **Security**: Regular security audits

### Monitoring

- **Error Tracking**: Implement error monitoring
- **Performance**: Monitor API response times
- **Uptime**: Set up uptime monitoring
- **Logs**: Centralized logging system

## Troubleshooting

### Common Issues

#### Authentication Issues

- **Problem**: Users can't log in
- **Solution**: Check JWT secret, cookie settings, CORS

#### Payment Issues

- **Problem**: Square payments failing
- **Solution**: Verify Square credentials, environment settings

#### Database Issues

- **Problem**: Connection errors
- **Solution**: Check MongoDB URI, network connectivity

#### Frontend Issues

- **Problem**: API calls failing
- **Solution**: Check API base URL, CORS settings

### Debug Commands

#### Backend

```bash
# Check server status
curl http://localhost:3000/api/v1/health

# Test Square API
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://connect.squareupsandbox.com/v2/locations
```

#### Frontend

```bash
# Check build
npm run build

# Check linting
npm run lint
```

### Log Locations

- **Backend**: `server.log` (if configured)
- **Frontend**: Browser console
- **Database**: MongoDB logs

## Support & Contact

### Documentation Updates

- Keep this document updated with any changes
- Document new features and API changes
- Maintain deployment procedures

### Emergency Contacts

- **Developer**: [Your contact information]
- **Hosting**: [Hosting provider contact]
- **Square Support**: [Square developer support]

---

**Last Updated**: [Current Date]
**Version**: 1.0.0
**Maintained By**: [Your Name/Company]
