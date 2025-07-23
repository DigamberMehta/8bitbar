import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import KaraokeBookingPage from "./pages/KaraokeBookingPage";
import N64BoothBookingPage from "./pages/N64BoothBookingPage";
import GalleryPage from "./pages/GalleryPage";
import ContactPage from "./pages/ContactPage";
import ScrollToTop from "./components/ScrollToTop";
import { ModalProvider } from "./contexts/ModalContext";
import Cart from "./components/cart";

function App() {
  return (
    <Router>
      <ModalProvider>
        <div className="min-h-screen bg-gray-900 text-white">
          <ScrollToTop />
          <Header />
          <main>
            <Routes>
            <Route path="/cart" element={<Cart />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/karaoke-booking" element={<KaraokeBookingPage />} />
              <Route
                path="/n64-booth-booking"
                element={<N64BoothBookingPage />}
              />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ModalProvider>
    </Router>
  );
}

export default App;
