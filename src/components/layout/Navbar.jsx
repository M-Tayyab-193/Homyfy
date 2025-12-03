import { useState, useEffect, useCallback, memo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaHome, FaGlobe, FaBars, FaUserCircle } from "react-icons/fa";
import supabase from "../../supabase/supabase";
import UserMenu from "../ui/UserMenu";
import { fetchProfileImageById } from "../../utils/fetchProfileImage";
import logo from "../../assets/logo.svg";

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
        } else {
          setLoadingImage(false);
        }
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [fetchUserData]);

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
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isMenuOpen])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 py-3"
    >
      <div className={`max-w-[1400px] mx-auto px-4 transition-all duration-300 ${
        isScrolled 
          ? 'glass-nav rounded-full shadow-lg backdrop-blur-xl border border-white/20' 
          : 'bg-white/80 rounded-full border border-transparent'
      }`}>
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
              className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl blur-sm opacity-50"
              whileHover={{ opacity: 0.7 }}
            />
            {/* Logo container */}
            <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-2 shadow-lg">
              <FaHome className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
            </div>
          </motion.div>
          <div className="flex flex-col leading-none">
            <motion.span 
              className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              Homyfy
            </motion.span>
            
          </div>
        </Link>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {!currentUser && (
            <>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Link
                  to="/signup"
                  className={`hidden md:block px-4 py-2 rounded-full  transition-all duration-300 font-semibold relative group focus:outline-none focus:ring-0 ${isScrolled ? 'bg-gray-800 text-gray-300' : 'text-gray-600'} `}
                  aria-label="Sign up for Homyfy"
                >
                  <span className="relative z-10">Sign up</span>
                  <motion.div
                    className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 ${!isScrolled ? 'bg-blue-50 group-hover:border-blue-200 border' : 'bg-black'} transition-all`}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Link
                  to="/login"
                  className="hidden md:block px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium relative overflow-hidden group shadow-lg hover:shadow-glow transition-all duration-300 focus:outline-none focus:ring-0"
                  aria-label="Log in to Homyfy"
                >
                  <span className="relative z-10">Log in</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            </>
          )}

          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center space-x-2 p-2 border rounded-full hover:shadow-lg transition-all backdrop-blur-sm focus:outline-none focus:ring-0 ${
                currentUser 
                  ? 'border-blue-300 bg-gradient-to-r from-blue-50 to-sky-50' 
                  : 'border-gray-300 bg-white/80'
              }`}
              onClick={toggleMenu}
              aria-label="User menu"
              aria-expanded={isMenuOpen}
              aria-haspopup="true"
            >
              <FaBars className={currentUser ? 'text-blue-600' : 'text-airbnb-dark'} />
              {currentUser ? (
                <>
                  {loadingImage ? (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-200 to-sky-200 animate-pulse"></div>
                  ) : (
                    <motion.div
                      className="relative"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full blur-sm opacity-50"></div>
                      <motion.img
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        src={
                          profileImage ||
                          `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.email}`
                        }
                        alt={currentUser.email}
                        className="relative w-8 h-8 rounded-full object-cover cursor-pointer ring-2 ring-blue-500 shadow-lg"
                        loading="eager"
                      />
                    </motion.div>
                  )}
                </>
              ) : (
                <FaUserCircle className="w-8 h-8 text-gray-400" />
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
                  <MemoizedUserMenu onClose={() => setIsMenuOpen(false)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      </div>
    </motion.header>
  );
}

export default Navbar;