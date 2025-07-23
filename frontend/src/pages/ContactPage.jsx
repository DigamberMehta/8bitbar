import React, { useState } from "react";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Send,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Message sent!\n\nWe'll get back to you within 24 hours, ${formData.name}!\n\nSubject: ${formData.subject}\nMessage: ${formData.message}`
    );
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  const openingHours = [
    { day: "Monday - Tuesday", hours: "Closed", status: "closed" },
    {
      day: "Wednesday - Thursday",
      hours: "5:00 PM - 12:00 AM",
      status: "open",
    },
    { day: "Friday", hours: "5:00 PM - 2:00 AM", status: "open" },
    { day: "Saturday", hours: "2:00 PM - 2:00 AM", status: "open" },
    { day: "Sunday", hours: "2:00 PM - 11:00 PM", status: "open" },
  ];

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-['Orbitron'] text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400">
            GAME OVER? CONTACT US!
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Ready to level up your night out? Get in touch with us for bookings,
            events, or just to say hi!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            {/* Location */}
            <div className="bg-black/50 border border-pink-500/30 rounded-lg p-6">
              <h3 className="font-['Orbitron'] text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400">
                LOCATION & HOURS
              </h3>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-6 w-6 text-pink-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-white font-semibold">
                      8-Bit Bar Australia
                    </p>
                    <p className="text-gray-300">123 Gaming Street</p>
                    <p className="text-gray-300">Sydney, NSW 2000</p>
                    <p className="text-gray-300">Australia</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="h-6 w-6 text-cyan-400 mt-1 flex-shrink-0" />
                  <div className="space-y-2">
                    {openingHours.map((schedule, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <span className="text-gray-300">{schedule.day}</span>
                        <span
                          className={`font-semibold ${
                            schedule.status === "closed"
                              ? "text-red-400"
                              : "text-green-400"
                          }`}
                        >
                          {schedule.hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
              <h3 className="font-['Orbitron'] text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
                GET IN TOUCH
              </h3>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="text-white font-semibold">Phone</p>
                    <a
                      href="tel:+61288888888"
                      className="text-gray-300 hover:text-green-400 transition-colors"
                    >
                      (02) 8888-8888
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-cyan-400" />
                  <div>
                    <p className="text-white font-semibold">Email</p>
                    <a
                      href="mailto:play@8bitbar.com.au"
                      className="text-gray-300 hover:text-cyan-400 transition-colors"
                    >
                      play@8bitbar.com.au
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-black/50 border border-purple-500/30 rounded-lg p-6">
              <h3 className="font-['Orbitron'] text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                FOLLOW THE ACTION
              </h3>

              <div className="flex space-x-4">
                <a
                  href="#"
                  className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg"
                >
                  <Facebook className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg"
                >
                  <Instagram className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg"
                >
                  <Twitter className="h-6 w-6" />
                </a>
              </div>

              <p className="text-gray-400 text-sm mt-4">
                Follow us for the latest events, gaming tournaments, and
                behind-the-scenes content!
              </p>
            </div>

            {/* Map */}
            <div className="bg-black/50 border border-cyan-500/30 rounded-lg p-6">
              <h3 className="font-['Orbitron'] text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">
                FIND US
              </h3>
              <div className="relative w-full h-64 bg-gray-800 rounded-lg overflow-hidden">
                <iframe
                  src="https://maps.google.com/maps?q=123%20Gaming%20Street%2C%20Sydney%2C%20NSW%202000%2C%20Australia&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="8-Bit Bar Location"
                  className="filter grayscale hover:grayscale-0 transition-all duration-300"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-black/50 border border-pink-500/30 rounded-lg p-8">
            <h3 className="font-['Orbitron'] text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400">
              SEND US A MESSAGE
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none transition-colors"
                  placeholder="(02) 0000-0000"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-pink-500 focus:outline-none transition-colors"
                >
                  <option value="">Select a subject</option>
                  <option value="booking">Booking Inquiry</option>
                  <option value="event">Private Event</option>
                  <option value="feedback">Feedback</option>
                  <option value="partnership">Partnership</option>
                  <option value="general">General Question</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none transition-colors resize-none"
                  placeholder="Tell us how we can help you level up your experience!"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl neon-glow-pink flex items-center justify-center"
              >
                <Send className="mr-2 h-5 w-5" />
                Send Message
              </button>
            </form>

            <div className="mt-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
              <p className="text-gray-400 text-sm">
                <strong className="text-green-400">Quick Response:</strong> We
                typically respond to all inquiries within 24 hours during
                business days. For urgent bookings, please call us directly!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;