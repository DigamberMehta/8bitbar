# Manual Booking Frontend Integration

The Manual Booking feature has been successfully integrated into the admin panel with a user-friendly interface.

## 🎯 What's Been Added

### 1. **New Admin Page** (`frontend/src/pages/admin/ManualBooking.jsx`)

- Complete manual booking interface for all services
- Service tabs for Karaoke, N64, and Cafe
- Customer information form
- Service-specific booking forms
- Real-time price calculation
- Success/error handling with user feedback

### 2. **Updated Admin Sidebar** (`frontend/src/components/admin/AdminLayout.jsx`)

- Added "Manual Booking" option with add icon
- Positioned prominently after Dashboard

### 3. **Updated Routing** (`frontend/src/App.jsx`)

- Added route: `/admin/manual-booking`
- Protected by admin authentication

## 🚀 Features

### **Service Selection Tabs**

- **Karaoke**: Room selection, people count, date/time, duration
- **N64**: Room selection with auto room-type detection, people count, date/time, duration
- **Cafe**: Chair selection, date, time slots, duration, special requests

### **Customer Management**

- Full name, email, phone, date of birth
- Automatic user account creation
- Temporary password generation for new users

### **Smart Features**

- **Real-time pricing**: Automatically calculates total cost
- **Resource validation**: Shows available rooms with pricing
- **Form validation**: Required field checking
- **Conflict detection**: Backend prevents double bookings
- **Success feedback**: Shows booking details and new user info

### **Responsive Design**

- Mobile-friendly interface
- Grid layouts that adapt to screen size
- Touch-friendly buttons and inputs

## 📱 User Interface

### **Service Tabs**

```
[🎵 Karaoke] [🎮 N64] [☕ Cafe]
```

### **Customer Information Section**

- Name, Email, Phone, DOB fields
- Clean form layout with icons

### **Booking Details Section**

- Service-specific fields
- Dropdown menus for room/time selection
- Number inputs for people/duration
- Real-time price display

### **Results Display**

- Success/error messages
- New user password display
- Booking confirmation details

## 🔧 How to Use

### **For Admins:**

1. **Navigate to Manual Booking**

   - Go to Admin Panel → Manual Booking (in sidebar)

2. **Select Service**

   - Click on Karaoke, N64, or Cafe tab

3. **Fill Customer Info**

   - Enter customer details
   - System will create account if email doesn't exist

4. **Configure Booking**

   - Select room/chairs, date/time, duration
   - Watch price update automatically

5. **Submit**
   - Click "Create Booking"
   - Get confirmation with booking details
   - If new user: receive temporary password to share

### **Success Flow:**

```
✅ Success!
Karaoke booking created successfully

🆕 New User Created!
Temporary Password: abc12345
Please share this password with the customer securely.
```

## 🎨 Styling

- **Tailwind CSS** for consistent styling
- **React Icons** for visual elements
- **Color scheme**: Blue primary, gray neutrals
- **Interactive states**: Hover effects, focus rings
- **Loading states**: Disabled buttons, loading text

## 🔗 API Integration

The frontend connects to these backend endpoints:

- `GET /admin/bookings/resources` - Fetch available rooms/settings
- `POST /admin/bookings/karaoke` - Create karaoke booking
- `POST /admin/bookings/n64` - Create N64 booking
- `POST /admin/bookings/cafe` - Create cafe booking

## 🚦 Navigation

**Admin Panel Structure:**

```
Admin Panel
├── Dashboard
├── 🆕 Manual Booking  ← NEW
├── Karaoke Bookings
├── Karaoke Rooms
├── N64 Bookings
├── N64 Rooms
├── Cafe Bookings
├── Cafe Layout
├── Cafe Settings
└── Users
```

## 📋 Form Validation

- **Required fields**: Name, email, service-specific fields
- **Email validation**: Proper email format
- **Number validation**: Min/max values for people, duration
- **Date validation**: Future dates only
- **Real-time feedback**: Immediate error display

## 🔄 State Management

- **Service switching**: Maintains separate form state per service
- **Form reset**: Clears form after successful submission
- **Loading states**: Prevents double submission
- **Error handling**: User-friendly error messages

The manual booking feature is now fully integrated and ready for use by admin staff to create bookings on behalf of customers!
