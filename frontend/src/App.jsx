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
import GalleryPage from "./pages/GalleryPage";
import ContactPage from "./pages/ContactPage";
import Cart from "./components/cart"; // Assuming cart is in components
import CheckoutPage from "./pages/CheckoutPage"; // Import the new checkout page

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
              <Route path="/n64-booth-booking" element={<N64BoothBookingPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<CheckoutPage />} />
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
