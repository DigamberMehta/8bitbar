# Manual Booking API Documentation

The admin panel now supports manual booking creation for all services (Karaoke, N64, and Cafe). This feature allows admins to create bookings on behalf of customers and automatically creates user accounts if they don't exist.

## Base URL

All manual booking endpoints are under: `/api/v1/admin/bookings/`

## Authentication

All endpoints require admin authentication via the `authenticateAdmin` middleware.

## Endpoints

### 1. Get Available Resources

**GET** `/api/v1/admin/bookings/resources`

Returns available rooms and settings for all services.

**Response:**

```json
{
  "success": true,
  "resources": {
    "karaoke": [
      {
        "_id": "room_id",
        "name": "Alice in Wonderland Karaoke Room",
        "pricePerHour": 50,
        "maxPeople": 12
      }
    ],
    "n64": [
      {
        "_id": "room_id",
        "name": "Mickey Mouse N64 Room",
        "pricePerHour": 30,
        "maxPeople": 4,
        "roomType": "mickey"
      }
    ],
    "cafe": {
      "pricePerChairPerHour": 10,
      "timeSlots": ["14:00", "15:00", "16:00", ...],
      "maxDuration": 8
    }
  }
}
```

### 2. Create Manual Karaoke Booking

**POST** `/api/v1/admin/bookings/karaoke`

**Request Body:**

```json
{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+1234567890",
  "customerDob": "1990-01-01", // Optional
  "roomId": "room_object_id",
  "numberOfPeople": 6,
  "startDateTime": "2024-12-25T18:00:00.000Z",
  "durationHours": 2,
  "paymentStatus": "completed", // Optional, defaults to "completed"
  "status": "confirmed" // Optional, defaults to "confirmed"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Karaoke booking created successfully",
  "booking": {
    "_id": "booking_id",
    "customerName": "John Doe",
    "startDateTime": "2024-12-25T18:00:00.000Z",
    "endDateTime": "2024-12-25T20:00:00.000Z",
    "totalPrice": 100,
    "status": "confirmed"
    // ... other booking details
  },
  "userInfo": {
    "isNewUser": true,
    "tempPassword": "abc12345" // Only if new user created
  }
}
```

### 3. Create Manual N64 Booking

**POST** `/api/v1/admin/bookings/n64`

**Request Body:**

```json
{
  "customerName": "Jane Smith",
  "customerEmail": "jane@example.com",
  "customerPhone": "+1234567890",
  "customerDob": "1985-05-15", // Optional
  "roomId": "room_object_id",
  "roomType": "mickey", // "mickey" or "minnie"
  "numberOfPeople": 4,
  "startDateTime": "2024-12-25T16:00:00.000Z",
  "durationHours": 3,
  "paymentStatus": "completed", // Optional
  "status": "confirmed" // Optional
}
```

### 4. Create Manual Cafe Booking

**POST** `/api/v1/admin/bookings/cafe`

**Request Body:**

```json
{
  "customerName": "Bob Wilson",
  "customerEmail": "bob@example.com",
  "customerPhone": "+1234567890",
  "customerDob": "1992-03-20", // Optional
  "chairIds": ["chair_1", "chair_2"],
  "date": "2024-12-25",
  "time": "14:00",
  "duration": 2,
  "specialRequests": "Window seat preferred", // Optional
  "deviceType": "desktop", // Optional, defaults to "desktop"
  "paymentStatus": "completed", // Optional
  "status": "confirmed" // Optional
}
```

## Features

### Automatic User Creation

- If a customer email doesn't exist in the system, a new user account is automatically created
- A temporary password is generated and returned in the response
- The admin should communicate this password to the customer

### Conflict Detection

- The system automatically checks for booking conflicts before creating new bookings
- For Karaoke and N64: Checks for overlapping time slots in the same room
- For Cafe: Checks if any of the requested chairs are already booked for the same date/time

### Pricing Calculation

- Prices are automatically calculated based on room rates and duration
- Karaoke/N64: `room.pricePerHour * durationHours`
- Cafe: `chairIds.length * settings.pricePerChairPerHour * duration`

### Default Values

- `paymentStatus`: "completed" (admin bookings are typically pre-paid)
- `status`: "confirmed" (admin bookings are pre-approved)
- `paymentId`: Auto-generated with "admin-" prefix

## Error Handling

Common error responses:

- **400**: Missing required fields or booking conflicts
- **404**: Room/resource not found
- **500**: Server error

## Usage Tips

1. **Always fetch resources first** to get current room IDs and pricing
2. **Check for conflicts** by calling the booking endpoint - it will return an error if there's a conflict
3. **Store temporary passwords** securely and communicate them to customers
4. **Use proper datetime format** for startDateTime (ISO 8601)
5. **Validate chair IDs** for cafe bookings against the current layout

## Integration with Existing Admin Panel

These endpoints can be integrated into your existing admin panel with forms for:

- Customer information input
- Service selection (Karaoke/N64/Cafe)
- Date/time selection with conflict checking
- Automatic price calculation display
- User creation notification
