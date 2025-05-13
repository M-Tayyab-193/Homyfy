import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import LoadingSpinner from './components/ui/LoadingSpinner'

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'))
const ListingDetailsPage = lazy(() => import('./pages/ListingDetailsPage'))
const SearchResultsPage = lazy(() => import('./pages/SearchResultsPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const WishlistPage = lazy(() => import('./pages/WishlistPage'))
const AuthPage = lazy(() => import('./pages/AuthPage'))
const SignupPage = lazy(() => import('./pages/SignupPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const HostingPage = lazy(() => import('./pages/HostingPage'))
const AddPropertyPage = lazy(() => import('./pages/AddPropertyPage'))
const EditListingPage = lazy(() => import('./pages/EditListingPage'))
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'))
const BookingsPage = lazy(() => import('./pages/BookingsPage'))

function App() {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={<LoadingSpinner fullScreen />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/listings/:id" element={<ListingDetailsPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/hosting" element={<HostingPage />} />
            <Route path="/hosting/add" element={<AddPropertyPage />} />
            <Route path="/hosting/edit/:id" element={<EditListingPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  )
}

export default App