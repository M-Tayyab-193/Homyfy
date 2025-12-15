import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  FaGlobe,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaHome,
} from "react-icons/fa";

function Footer() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white mt-12 border-t border-gray-200">
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="container-custom py-12"
      >
        {/* Logo and Tagline */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <FaHome className="text-4xl text-[#0F1520]" />
            </motion.div>
            <h2 className="text-3xl font-bold gradient-text">Homyfy</h2>
          </div>
          <p className="text-gray-600 max-w-md mx-auto">
            Your trusted partner in finding the perfect home away from home
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              About Homyfy
            </h3>
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
              Connecting travelers with unique homes and experiences around
              Pakistan.
            </p>
            <div className="space-y-3">
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center text-gray-600 text-sm"
              >
                <FaPhone className="mr-3 text-[#0F1520]" />
                <span>+92 300 1234567</span>
              </motion.div>
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center text-gray-600 text-sm"
              >
                <FaEnvelope className="mr-3 text-[#0F1520]" />
                <span>support@homyfy.com</span>
              </motion.div>
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center text-gray-600 text-sm"
              >
                <FaMapMarkerAlt className="mr-3 text-[#0F1520]" />
                <span>Islamabad, Pakistan</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { to: "/about", label: "About Us" },
                { to: "/host", label: "Become a Host" },
                { to: "/help", label: "Help Center" },
                { to: "/careers", label: "Careers" },
              ].map((link) => (
                <li key={link.to}>
                  <motion.div whileHover={{ x: 5 }}>
                    <Link
                      to={link.to}
                      className="text-gray-600 hover:#0F1520 transition-colors text-sm inline-block"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Legal</h3>
            <ul className="space-y-3">
              {[
                { to: "/privacy", label: "Privacy Policy" },
                { to: "/terms", label: "Terms of Service" },
                { to: "/cancellation", label: "Cancellation Policy" },
                { to: "/safety", label: "Trust & Safety" },
              ].map((link) => (
                <li key={link.to}>
                  <motion.div whileHover={{ x: 5 }}>
                    <Link
                      to={link.to}
                      className="text-gray-600 hover:#0F1520 transition-colors text-sm inline-block"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Newsletter
            </h3>
            <p className="text-gray-600 mb-4 text-sm">
              Subscribe for the latest updates and offers.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#0F1520] focus:border-transparent"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gradient-to-r from-[#0F1520] to-[#1a2332] text-white rounded-r-lg hover:shadow-glow transition-all text-sm font-medium"
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          variants={itemVariants}
          className="mt-8 pt-8 border-t border-gray-200"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Left: Language and Currency */}
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="flex items-center text-gray-700 font-medium hover:#0F1520 transition-colors text-sm"
              >
                <FaGlobe className="mr-2" />
                <span>English (US)</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="hover:#0F1520 font-medium transition-colors text-sm text-gray-700"
              >
                PKR - Rs.
              </motion.button>
            </div>

            {/* Center: Copyright */}
            <div className="text-center">
              <span className="text-gray-600 text-sm sm:text-[16px] font-bold">
                © 2025 Homyfy.
              </span>
            </div>

            {/* Right: Social Icons */}
            <div className="flex items-center space-x-4">
              {[
                { Icon: FaFacebookF, href: "#facebook" },
                { Icon: FaTwitter, href: "#twitter" },
                { Icon: FaInstagram, href: "#instagram" },
              ].map(({ Icon, href }) => (
                <motion.a
                  key={href}
                  href={href}
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-[#0F1520] hover:to-[#1a2332] hover:text-white transition-all"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}

export default Footer;
