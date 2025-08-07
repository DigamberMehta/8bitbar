import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import Layout Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

// Import Page Components
import HomePage from "./pages/HomePage";
import KaraokeBookingPage from "./pages/KaraokeBookingPage";
import N64BoothBookingPage from "./pages/N64BoothBookingPage";
import CafeBookingPage from "./components/CafeBooking/CafeBookingPage";

import ContactPage from "./pages/ContactPage";
import Cart from "./components/cart"; // Assuming cart is in components
import CheckoutPage from "./pages/CheckoutPage"; // Import the new checkout page

// Import Admin Components
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import KaraokeBookingsAdmin from "./pages/admin/karaokeadmin/KaraokeBookingsAdmin";
import N64BookingsAdmin from "./pages/admin/n64admin/N64BookingsAdmin";
import KaraokeRoomsAdmin from "./pages/admin/karaokeadmin/KaraokeRoomsAdmin";
import N64RoomsAdmin from "./pages/admin/n64admin/N64RoomsAdmin";
import CafeBookingsAdmin from "./pages/admin/cafeadmin/CafeBookingsAdmin";
import CafeSettingsAdmin from "./pages/admin/cafeadmin/CafeSettingsAdmin";
import UserManagement from "./pages/admin/UserManagement";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import N64RoomEditAdmin from "./pages/admin/n64admin/N64RoomEditAdmin";
import KaraokeRoomEditAdmin from "./pages/admin/karaokeadmin/KaraokeRoomEditAdmin";
import KaraokeRoomCreateAdmin from "./pages/admin/karaokeadmin/KaraokeRoomCreateAdmin";
import ManualBooking from "./pages/admin/manualbooking";
import FinancePage from "./pages/admin/FinancePage";

import BarMapEditor from "./components/cafe/BarMapEditor";

// Import Context Provider
import { ModalProvider } from "./contexts/ModalContext";

function App() {
  return (
    // The Router provides routing capabilities to the entire app.
    // AuthProvider should wrap this in main.jsx to provide auth context everywhere.
    <Router>
      {/* ModalProvider manages login/signup modals globally. */}
      <ModalProvider>
        <div className="min-h-screen bg-black text-white flex flex-col">
          {/* ScrollToTop ensures navigation to a new page starts at the top. */}
          <ScrollToTop />

          {/* Header is outside Routes to be persistent across all pages. */}
          <Header />

          {/* The main content area where page components will be rendered. */}
          <main className="flex-grow">
            <Routes>
              {/* Define all the application routes here */}
              <Route path="/" element={<HomePage />} />
              <Route path="/karaoke-booking" element={<KaraokeBookingPage />} />
              <Route
                path="/n64-booth-booking"
                element={<N64BoothBookingPage />}
              />
              <Route path="/cafe-booking" element={<CafeBookingPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/bar-map-editor" element={<BarMapEditor />} />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout />
                  </ProtectedAdminRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="finance" element={<FinancePage />} />
                <Route path="manual-booking" element={<ManualBooking />} />
                <Route
                  path="karaoke-bookings"
                  element={<KaraokeBookingsAdmin />}
                />
                <Route
                  path="karaoke/karaoke-room/edit"
                  element={<KaraokeRoomEditAdmin />}
                />
                <Route
                  path="karaoke/karaoke-room/create"
                  element={<KaraokeRoomCreateAdmin />}
                />
                <Route
                  path="karaoke/karaoke-rooms"
                  element={<KaraokeRoomsAdmin />}
                />

                <Route path="n64-bookings" element={<N64BookingsAdmin />} />
                <Route
                  path="n64-rooms/:id/edit"
                  element={<N64RoomEditAdmin />}
                />
                <Route path="n64-rooms" element={<N64RoomsAdmin />} />
                <Route path="cafe-bookings" element={<CafeBookingsAdmin />} />
                <Route path="cafe-settings" element={<CafeSettingsAdmin />} />
                <Route path="cafe-layout" element={<BarMapEditor />} />
                <Route path="users" element={<UserManagement />} />
              </Route>
            </Routes>
          </main>

          {/* Footer is also outside Routes for persistence. */}
          <Footer />
        </div>
      </ModalProvider>
    </Router>
  );
}

export default App;
