import { useState, useEffect, useCallback, memo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaHome, FaGlobe, FaBars, FaUserCircle } from "react-icons/fa";
import supabase from "../../supabase/supabase";
import UserMenu from "../ui/UserMenu";
import { fetchProfileImageById } from "../../utils/fetchProfileImage";
import logo from "../../assets/logo.svg";
import NotificationBell from '../ui/NotificationBell';
import { useNotificationsContext } from '../../contexts/NotificationsContext';

// Memoize the UserMenu component
const MemoizedUserMenu = memo(UserMenu);

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  // Get notifications context to initialize notifications for hosts
  const { initializeNotifications } = useNotificationsContext();

  const fetchUserData = useCallback(async (user) => {
    if (!user) {
      setLoadingImage(false);
      return;
    }

    const imageUrl = await fetchProfileImageById(user.id);
    setProfileImage(imageUrl);
    setLoadingImage(false);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Session fetch error:", error);
        setLoadingImage(false);
        return;
      }

      const user = session?.user;
      setCurrentUser(user);

      if (user) {
        fetchUserData(user);
        // Initialize notifications for hosts
        if (user.user_metadata?.role === 'host') {
          initializeNotifications(user.id);
        }
      } else {
        setLoadingImage(false);
      }
    };

    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const user = session?.user;
        setCurrentUser(user);
        if (user) {
          fetchUserData(user);
          // Initialize notifications for hosts
          if (user.user_metadata?.role === 'host') {
            initializeNotifications(user.id);
          }
        } else {
          setLoadingImage(false);
        }
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [fetchUserData, initializeNotifications]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 py-3"
    >
      <div
        className={`lg:max-w-[1400px] mx-auto px-4 transition-all duration-300 ${
          isScrolled
            ? "glass-nav rounded-full shadow-lg backdrop-blur-xl border border-white/10 "
            : isHomePage 
            ? "bg-transparent rounded-full border border-transparent"
            : "bg-white/80 rounded-full border border-transparent"
        }`}
      >
        <div className="py-3 flex items-center justify-between">
          {/* Logo with Animation */}
          <Link
            to="/"
            className="flex items-center space-x-2 group focus:outline-none focus:ring-0 rounded-lg p-1"
            aria-label="Homyfy - Go to homepage"
          >
            <motion.div
              className="relative"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Gradient background circle */}
              <motion.div
                className="absolute inset-0 rounded-xl blur-sm opacity-50"
                style={{ background: 'linear-gradient(to bottom right, #0F1520, #1a2332)' }}
                whileHover={{ opacity: 0.7 }}
              />
              {/* Logo container */}
              <div className="relative rounded-xl p-2 shadow-lg" style={{ background: 'linear-gradient(to bottom right, #0F1520, #1a2332)' }}>
                <FaHome className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </motion.div>
            <div className="flex flex-col leading-none">
              <motion.span
                className={`text-lg sm:text-xl md:text-2xl font-bold ${
                  isHomePage && !isScrolled 
                  ? "text-white" 
                  : "bg-clip-text text-transparent"
                }`}
                style={(!isHomePage || isScrolled) ? { backgroundImage: 'linear-gradient(to right, #0F1520, #0F1520)' } : {}}
                whileHover={{ scale: 1.05 }}
              >
                Homyfy
              </motion.span>
            </div>
          </Link>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {!currentUser && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Link
                  to="/signup"
                  className=" md:block px-6 py-2 rounded-full text-white font-medium relative overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-0"
                  style={{ background: 'linear-gradient(to right, #0F1520, #1a2332)' }}
                  aria-label="Get started with Homyfy"
                >
                  <span className="relative z-10">Get Started</span>
                </Link>
              </motion.div>
            )}

            {currentUser && (
              <>
                {currentUser.user_metadata?.role === "host" && (
                  <NotificationBell userId={currentUser.id} className='text-black'/>
                )}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-2 p-2 border rounded-full hover:shadow-lg transition-all backdrop-blur-sm focus:outline-none focus:ring-0 ${
                      isHomePage && !isScrolled
                        ? "border-white/30 bg-white/10"
                        : "border-gray-300 bg-white/80"
                    }`}
                    onClick={toggleMenu}
                    aria-label="User menu"
                    aria-expanded={isMenuOpen}
                    aria-haspopup="true"
                  >
                    <FaBars
                      className={isHomePage && !isScrolled ? "text-white" : "text-gray-800"}
                    />
                    {loadingImage ? (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"></div>
                    ) : (
                      <motion.div
                        className="relative"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                        }}
                      >
                        <div className="absolute inset-0 rounded-full blur-sm opacity-50" style={{ background: 'linear-gradient(to right, #0F1520, #1a2332)' }}></div>
                        <motion.img
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          src={
                            profileImage ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.email}`
                          }
                          alt={currentUser.email}
                          className="relative w-8 h-8 rounded-full object-cover cursor-pointer ring-[2px] ring-black shadow-lg"
                          style={{ ringColor: '#0F1520' }}
                          loading="eager"
                        />
                      </motion.div>
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {isMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <MemoizedUserMenu 
                          onClose={() => setIsMenuOpen(false)} 
                          currentUser={currentUser}
                          profileImage={profileImage}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}

export default Navbar;
