import { Link } from "react-router-dom";
import {
  FaGlobe,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-white mt-8 border-t border-gray-200">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About Homyfy</h3>
            <p className="text-airbnb-light mb-4">
              Connecting travelers with unique homes and experiences around
              Pakistan.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-airbnb-light">
                <FaPhone className="mr-2" />
                <span>+92 300 1234567</span>
              </div>
              <div className="flex items-center text-airbnb-light">
                <FaEnvelope className="mr-2" />
                <span>support@homyfy.com</span>
              </div>
              <div className="flex items-center text-airbnb-light">
                <FaMapMarkerAlt className="mr-2" />
                <span>Islamabad, Pakistan</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-airbnb-light hover:text-airbnb-primary"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/host"
                  className="text-airbnb-light hover:text-airbnb-primary"
                >
                  Become a Host
                </Link>
              </li>
              <li>
                <Link
                  to="/help"
                  className="text-airbnb-light hover:text-airbnb-primary"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="text-airbnb-light hover:text-airbnb-primary"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/privacy"
                  className="text-airbnb-light hover:text-airbnb-primary"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-airbnb-light hover:text-airbnb-primary"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/cancellation"
                  className="text-airbnb-light hover:text-airbnb-primary"
                >
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/safety"
                  className="text-airbnb-light hover:text-airbnb-primary"
                >
                  Trust & Safety
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-airbnb-light mb-4">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:border-airbnb-primary"
              />
              <button className="px-4 py-2 bg-airbnb-primary text-white rounded-r-lg hover:bg-opacity-90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col-reverse md:flex-row justify-between items-center text-center space-y-4 md:space-y-0">
            {/* Left: Language and Currency */}
            <div className="flex items-center space-x-4 ">
              <button className="flex items-center text-airbnb-dark font-bold  hover:text-airbnb-primary">
                <span>English (US)</span>
              </button>
              <button className=" hover:text-airbnb-primary font-bold ">
                PKR - Rs.
              </button>
            </div>

            {/* Center: Copyright */}
            <div>
              <span className="text-airbnb-dark font-bold text-sm md:text-base">
                © 2025 Homyfy. All rights reserved.
              </span>
            </div>

            {/* Right: Social Icons */}
            <div className="flex items-center space-x-6">
              <a
                href="#"
                className="text-airbnb-dark hover:text-airbnb-primary"
              >
                <FaFacebookF size={20} />
              </a>
              <a
                href="#"
                className="text-airbnb-dark hover:text-airbnb-primary"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="#"
                className="text-airbnb-dark hover:text-airbnb-primary"
              >
                <FaInstagram size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
