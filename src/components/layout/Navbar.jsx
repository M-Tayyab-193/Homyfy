import { useState, useEffect, useCallback, memo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaGlobe, FaBars } from "react-icons/fa";
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

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-nav"
          : isHomePage
          ? "bg-transparent"
          : "bg-white"
      }`}
    >
      <div className="container-custom py-4 flex items-center justify-between">
        {/* Logo */}
<Link
  to="/"
  className="flex items-center space-x-2 text-airbnb-primary transition-transform hover:scale-105"
>
  <FaHome className="h-5 w-5 sm:h-7 sm:w-7 md:h-9 md:w-9" />
  <span className="text-lg sm:text-xl md:text-2xl font-bold">Homyfy</span>
</Link>


        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {!currentUser && (
            <>
              <Link
                to="/signup"
                className="hidden md:block px-4 py-2 rounded-full hover:bg-gray-100 transition-colors font-medium"
              >
                Sign up
              </Link>
              <Link
                to="/login"
                className="hidden md:block px-4 py-2 rounded-full bg-airbnb-primary text-white hover:bg-opacity-90 transition-colors font-medium"
              >
                Log in
              </Link>
            </>
          )}

          <div className="relative">
            <button
              className="flex items-center space-x-2 p-2 border border-gray-300 rounded-full hover:shadow-md transition-all"
              onClick={toggleMenu}
              aria-label="User menu"
            >
              <FaBars className="text-airbnb-dark" />
              {currentUser ? (
                <>
                  {loadingImage ? (
                    <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                  ) : (
                    <img
                      src={
                        profileImage ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.email}`
                      }
                      alt={currentUser.email}
                      className="w-8 h-8 rounded-full object-cover cursor-pointer"
                      loading="eager"
                    />
                  )}
                </>
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-500"></div>
              )}
            </button>

            {isMenuOpen && (
              <MemoizedUserMenu onClose={() => setIsMenuOpen(false)} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;