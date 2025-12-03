import { Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Lenis from "@studio-freight/lenis";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import FloatingActionButton from "./components/ui/FloatingActionButton";

// Lazy load pages for better performance
const HomePage = lazy(() => import("./pages/HomePage"));
const ListingDetailsPage = lazy(() => import("./pages/ListingDetailsPage"));
const SearchResultsPage = lazy(() => import("./pages/SearchResultsPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const HostingPage = lazy(() => import("./pages/HostingPage"));
const AddPropertyPage = lazy(() => import("./pages/AddPropertyPage"));
const EditListingPage = lazy(() => import("./pages/EditListingPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const BookingsPage = lazy(() => import("./pages/BookingsPage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const HelpCenterPage = lazy(() => import("./pages/HelpCenterPage"));

function App() {
  const location = useLocation();

  // Initialize Lenis smooth scrolling with optimized settings
  useEffect(() => {
    const lenis = new Lenis({
      smooth: true,
      lerp: 0.1,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Page transition variants
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                <Suspense fallback={<LoadingSpinner fullScreen />}>
                  <HomePage />
                </Suspense>
              </PageTransition>
            }
          />
          <Route
            path="/listings/:id"
            element={
              <PageTransition>
                <Suspense fallback={<LoadingSpinner fullScreen />}>
                  <ListingDetailsPage />
                </Suspense>
              </PageTransition>
            }
          />
          <Route
            path="/search"
            element={
              <PageTransition>
                <Suspense fallback={<LoadingSpinner fullScreen />}>
                  <SearchResultsPage />
                </Suspense>
              </PageTransition>
            }
          />
          <Route
            path="/profile"
            element={
              <PageTransition>
                <Suspense fallback={<LoadingSpinner fullScreen />}>
                  <ProfilePage />
                </Suspense>
              </PageTransition>
            }
          />
          <Route
            path="/wishlist"
            element={
              <PageTransition>
                <Suspense fallback={<LoadingSpinner fullScreen />}>
                  <WishlistPage />
                </Suspense>
              </PageTransition>
            }
          />
          <Route
            path="/bookings"
            element={
              <PageTransition>
                <Suspense fallback={<LoadingSpinner fullScreen />}>
                  <BookingsPage />
                </Suspense>
              </PageTransition>
            }
          />
          <Route
            path="/login"
            element={
              <PageTransition>
                <Suspense fallback={<LoadingSpinner fullScreen />}>
                  <AuthPage />
                </Suspense>
              </PageTransition>
            }
          />
          <Route
            path="/signup"
            element={
              <PageTransition>
                <Suspense fallback={<LoadingSpinner fullScreen />}>
                  <SignupPage />
                </Suspense>
              </PageTransition>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PageTransition>
                <Suspense fallback={<LoadingSpinner fullScreen />}>
                  <ResetPasswordPage />
                </Suspense>
              </PageTransition>
            }
          />
          <Route
            path="/hosting"
            element={
              <PageTransition>
                <Suspense fallback={<LoadingSpinner fullScreen />}>
                  <HostingPage />
                </Suspense>
              </PageTransition>
            }
          />
          <Route
            path="/notifications"
            element={
              <PageTransition>
                <Suspense fallback={<LoadingSpinner fullScreen />}>
                  <NotificationsPage />
                </Suspense>
              </PageTransition>
            }
          />
          <Route
            path="/help"
            element={
              <PageTransition>
                <Suspense fallback={<LoadingSpinner fullScreen />}>
                  <HelpCenterPage />
                </Suspense>
              </PageTransition>
            }
          />
          <Route
            path="/hosting/add"
            element={
              <PageTransition>
                <Suspense fallback={<LoadingSpinner fullScreen />}>
                  <AddPropertyPage />
                </Suspense>
              </PageTransition>
            }
          />
          <Route
            path="/hosting/edit/:id"
            element={
              <PageTransition>
                <Suspense fallback={<LoadingSpinner fullScreen />}>
                  <EditListingPage />
                </Suspense>
              </PageTransition>
            }
          />
          <Route
            path="*"
            element={
              <PageTransition>
                <Suspense fallback={<LoadingSpinner fullScreen />}>
                  <NotFoundPage />
                </Suspense>
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>
      <Footer />
      <FloatingActionButton />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
        limit={3}
        style={{ marginTop: "60px" }}
      />
    </>
  );
}

// Page transition wrapper component
function PageTransition({ children }) {
  return (
    <motion.main
      className="flex-grow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.4,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.main>
  );
}

export default App;
