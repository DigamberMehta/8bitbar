import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

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
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedClientRoute from "./components/ProtectedClientRoute";
import N64RoomEditAdmin from "./pages/admin/n64admin/N64RoomEditAdmin";
import KaraokeRoomEditAdmin from "./pages/admin/karaokeadmin/KaraokeRoomEditAdmin";
import KaraokeRoomCreateAdmin from "./pages/admin/karaokeadmin/KaraokeRoomCreateAdmin";
import ManualBooking from "./pages/admin/manualbooking";
import FinancePage from "./pages/admin/FinancePage";
import AllBookings from "./pages/admin/AllBookings";
import PinManagement from "./pages/admin/PinManagement";

// Import Client Components
import ClientLayout from "./components/ClientLayout";
import ClientLogin from "./pages/client/ClientLogin";
import ClientDashboard from "./pages/client/ClientDashboard";

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

          {/* The main content area where page components will be rendered. */}
          <main className="flex-grow">
            <Routes>
              {/* Define all the application routes here */}
              <Route
                path="/"
                element={
                  <>
                    <Header />
                    <HomePage />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/karaoke-booking"
                element={
                  <>
                    <Header />
                    <KaraokeBookingPage />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/n64-booth-booking"
                element={
                  <>
                    <Header />
                    <N64BoothBookingPage />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/cafe-booking"
                element={
                  <>
                    <Header />
                    <CafeBookingPage />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/contact"
                element={
                  <>
                    <Header />
                    <ContactPage />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/cart"
                element={
                  <>
                    <Header />
                    <Cart />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/checkout"
                element={
                  <>
                    <Header />
                    <CheckoutPage />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/bar-map-editor"
                element={
                  <>
                    <Header />
                    <BarMapEditor />
                    <Footer />
                  </>
                }
              />

              {/* Staff Routes - No Header/Footer */}
              <Route path="/staff" element={<ClientLayout />}>
                <Route index element={<Navigate to="/staff/login" replace />} />
                <Route path="login" element={<ClientLogin />} />
                <Route
                  path="dashboard"
                  element={
                    <ProtectedClientRoute>
                      <ClientDashboard />
                    </ProtectedClientRoute>
                  }
                />
              </Route>

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
                <Route
                  path="finance"
                  element={
                    <ProtectedRoute allowedRoles={["superadmin"]}>
                      <FinancePage />
                    </ProtectedRoute>
                  }
                />
                <Route path="all-bookings" element={<AllBookings />} />
                <Route path="manual-booking" element={<ManualBooking />} />
                <Route
                  path="karaoke-bookings"
                  element={<KaraokeBookingsAdmin />}
                />
                <Route
                  path="karaoke/karaoke-room/edit"
                  element={
                    <ProtectedRoute allowedRoles={["superadmin"]}>
                      <KaraokeRoomEditAdmin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="karaoke/karaoke-room/create"
                  element={
                    <ProtectedRoute allowedRoles={["superadmin"]}>
                      <KaraokeRoomCreateAdmin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="karaoke/karaoke-rooms"
                  element={
                    <ProtectedRoute allowedRoles={["superadmin"]}>
                      <KaraokeRoomsAdmin />
                    </ProtectedRoute>
                  }
                />

                <Route path="n64-bookings" element={<N64BookingsAdmin />} />
                <Route
                  path="n64-rooms/:id/edit"
                  element={
                    <ProtectedRoute allowedRoles={["superadmin"]}>
                      <N64RoomEditAdmin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="n64-rooms"
                  element={
                    <ProtectedRoute allowedRoles={["superadmin"]}>
                      <N64RoomsAdmin />
                    </ProtectedRoute>
                  }
                />
                <Route path="cafe-bookings" element={<CafeBookingsAdmin />} />
                <Route
                  path="cafe-settings"
                  element={
                    <ProtectedRoute allowedRoles={["superadmin"]}>
                      <CafeSettingsAdmin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="cafe-layout"
                  element={
                    <ProtectedRoute allowedRoles={["superadmin"]}>
                      <BarMapEditor />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="users"
                  element={
                    <ProtectedRoute allowedRoles={["superadmin"]}>
                      <UserManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="pin-management"
                  element={
                    <ProtectedRoute allowedRoles={["superadmin"]}>
                      <PinManagement />
                    </ProtectedRoute>
                  }
                />
              </Route>
            </Routes>
          </main>
        </div>
      </ModalProvider>
    </Router>
  );
}

export default App;
