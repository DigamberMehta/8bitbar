import React from "react";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black border-t border-pink-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img
                src="https://8bitbar.com.au/wp-content/uploads/2025/02/logo-1.png"
                alt="8-Bit Bar Logo"
                className="h-10 w-auto"
              />
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              8-Bit Bar, the place to be in Hervey Bay. The ultimate fusion of
              classic arcade thrills and delicious tapas bites. Eat, Drink, Play
              – Only at 8 Bit Bar.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-pink-400 transition-colors"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-pink-400 transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-pink-400 transition-colors"
              >
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-['Orbitron'] text-lg font-bold text-green-400 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/karaoke-booking"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Karaoke Room
                </a>
              </li>
              <li>
                <a
                  href="/n64-booth-booking"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  N64 Booth
                </a>
              </li>
              <li>
                <a
                  href="/events"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Events
                </a>
              </li>
              <li>
                <a
                  href="/gallery"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Gallery
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-['Orbitron'] text-lg font-bold text-cyan-400 mb-4">
              Contact
            </h3>
            <div className="space-y-2 text-gray-400">
              <p>
                123 Gaming Street
                <br />
                Sydney, NSW 2000
              </p>
              <p>Phone: (02) 8888-8888</p>
              <p>Email: play@8bitbar.com.au</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 8-Bit Bar. All rights reserved. Game on! 🎮</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
