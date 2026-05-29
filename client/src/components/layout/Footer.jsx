import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axios";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaHotel, FaClock, FaShieldAlt, FaCreditCard, FaArrowRight } from "react-icons/fa";

const Footer = () => {
  const [hotelName, setHotelName] = useState("StayLux");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await axiosInstance.get("/settings");
      setHotelName(res.data.data?.hotelName || "StayLux");
    } catch (err) {
      console.log("Settings fetch error");
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
    setNewsletterEmail("");
  };

  return (
    <footer className="bg-black text-gray-400 mt-20">
      {/* Subtle top gradient border */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FaHotel className="text-white text-2xl" />
              <h2 className="text-2xl font-bold text-white tracking-tight">{hotelName}</h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Experience world-class hospitality, luxurious rooms, and unforgettable moments. 
              Your comfort is our priority.
            </p>
            <div className="flex space-x-3 pt-2">
              <SocialLink href="#" icon={<FaFacebookF />} />
              <SocialLink href="#" icon={<FaTwitter />} />
              <SocialLink href="#" icon={<FaInstagram />} />
              <SocialLink href="#" icon={<FaYoutube />} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/rooms">Rooms & Suites</FooterLink>
              <FooterLink to="/login">Login</FooterLink>
              <FooterLink to="/register">Register</FooterLink>
            </ul>
          </div>

          {/* Contact & Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400">
                <FaMapMarkerAlt className="text-gray-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">123 Luxury Avenue, Chennai, India</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <FaPhoneAlt className="text-gray-500 flex-shrink-0" />
                <span className="text-sm">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <FaEnvelope className="text-gray-500 flex-shrink-0" />
                <span className="text-sm">support@staylux.com</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 pt-2">
                <FaClock className="text-gray-500 flex-shrink-0" />
                <span className="text-sm">24/7 Guest Support</span>
              </li>
            </ul>
          </div>

          {/* Newsletter & Trust */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-3">
              Subscribe to get exclusive offers and updates.
            </p>
            <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none text-white placeholder-gray-500 text-sm transition-all duration-200"
                required
              />
              <button
                type="submit"
                className="bg-white hover:bg-gray-100 text-black font-medium px-5 py-2 rounded-lg transition-all duration-200 hover:shadow-md whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
            {subscribed && (
              <p className="text-green-400 text-xs mt-2 animate-fadeIn">Thank you for subscribing!</p>
            )}

            <div className="mt-6 pt-4 border-t border-gray-800">
              <div className="flex items-center gap-5 text-gray-500 text-xs">
                <div className="flex items-center gap-1.5">
                  <FaShieldAlt className="text-gray-400" />
                  <span>Secure Booking</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FaCreditCard className="text-gray-400" />
                  <span>Flexible Payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} {hotelName}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-white transition duration-200">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition duration-200">Terms of Service</Link>
            <Link to="/sitemap" className="hover:text-white transition duration-200">Sitemap</Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </footer>
  );
};

// Helper Components
const SocialLink = ({ href, icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-8 h-8 rounded-full bg-gray-800 text-gray-400 flex items-center justify-center hover:bg-gray-700 hover:text-white hover:scale-105 transition-all duration-200"
  >
    {icon}
  </a>
);

const FooterLink = ({ to, children }) => (
  <li>
    <Link
      to={to}
      className="text-gray-400 hover:text-white transition-all duration-200 flex items-center gap-1.5 group"
    >
      <FaArrowRight className="text-xs opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0 -translate-x-1" />
      <span>{children}</span>
    </Link>
  </li>
);

export default Footer;