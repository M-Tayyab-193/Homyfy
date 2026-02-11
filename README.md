# Homyfy

A full-stack accommodation rental platform built for the Pakistani market. Homyfy connects property owners with travelers, offering a localized alternative to global platforms with support for local payment methods and PKR currency.

---

<img width="1920" height="1243" alt="Screenshot 2026-02-11 at 12 13 27 PM (1)" src="https://github.com/user-attachments/assets/c85b616e-1999-4a4a-9f37-c59af72fa817" />

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Homyfy is a modern, responsive web application that enables:

- **Property Owners (Hosts)**: List properties, manage bookings, receive notifications, and track performance
- **Travelers (Guests)**: Search properties, book accommodations, manage wishlists, and leave reviews

The platform addresses key gaps in existing global solutions by providing:

- Native support for Pakistani Rupees (PKR)
- Integration with local payment gateways (JazzCash, EasyPaisa)
- Location-aware search with Pakistani cities and provinces
- Simplified onboarding for users unfamiliar with international platforms

---

## Features

### Authentication and User Management

- Email/password authentication via Supabase Auth
- Google OAuth integration
- Role-based access control (Guest/Host)
- Email verification and password reset flows
- Profile management with avatar uploads
- Account deletion with proper cleanup

### Property Listings

- CRUD operations for property listings
- Multi-image uploads via Cloudinary
- Property categorization (House, Apartment, Villa, Others)
- Amenity management with predefined options
- Location picker with map integration
- Matterport 3D virtual tour integration
- Pseudo-360 image viewer for immersive property exploration

### Search and Discovery

- Location-based search with autocomplete (OpenStreetMap Nominatim)
- Date range selection with booked dates disabled
- Guest count filtering
- Advanced filters:
  - Property type
  - Price range (min/max)
  - Amenities
  - Sorting (price, rating)
- Paginated results with URL-based state management

### Booking System

- Date range selection with calendar UI
- Overlap detection preventing double bookings
- Price calculation (nightly rate x nights + service fee)
- Multiple payment methods:
  - JazzCash
  - EasyPaisa
  - Credit/Debit Card
  - Pay on arrival
- Booking confirmation with success modal
- Booking history for guests

### Reviews and Ratings

- Star-based rating system (0.5 increments)
- Text reviews with validation
- Review eligibility check (must have completed booking)
- One review per booking enforcement
- Average rating calculation per listing

### Wishlist

- Add/remove listings from wishlist
- Persistent wishlist across sessions
- Quick access from user menu

### Notifications

- Real-time notifications via Supabase Realtime
- Toast notifications for immediate feedback
- Notification bell with unread count
- Mark as read functionality
- Host notifications for new bookings

### Interactive Maps

- Leaflet-based map integration
- Custom marker styling
- Reverse geocoding for address display
- Approximate location circle for privacy
- Popup with listing details

### User Interface

- Fully responsive design (mobile, tablet, desktop)
- Smooth page transitions with Framer Motion
- Lenis smooth scrolling
- Skeleton loading states
- Toast notifications (react-toastify)
- Image lightbox and carousel
- Floating action button
- Empty state components

### Host Dashboard

- Property management (view, edit, delete)
- Add new listings with multi-step form
- Image upload progress tracking
- Listing performance visibility

### Help Center

- Searchable FAQ articles
- Category-based organization
- Expandable article sections
- Contact support option

---

## Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| React 18 | UI library |
| Vite | Build tool and dev server |
| React Router v6 | Client-side routing |
| TailwindCSS | Utility-first styling |
| Framer Motion | Animations and transitions |
| React Icons | Icon library |
| Lenis | Smooth scrolling |

### Backend Services

| Service | Purpose |
|---------|---------|
| Supabase Auth | Authentication and authorization |
| Supabase Database | PostgreSQL database |
| Supabase RPC | Server-side functions |
| Supabase Realtime | WebSocket subscriptions |
| Supabase Edge Functions | Serverless functions |

### Third-Party Integrations

| Service | Purpose |
|---------|---------|
| Cloudinary | Image upload and CDN |
| OpenStreetMap Nominatim | Geocoding and location search |
| Leaflet | Interactive maps |
| Matterport | 3D virtual tours |
| DiceBear | Avatar generation |

### Development Tools

| Tool | Purpose |
|------|---------|
| ESLint | Code linting |
| PostCSS | CSS processing |
| Autoprefixer | CSS vendor prefixes |

---

## Architecture

```
+------------------------------------------------------------------+
|                          Client (React)                          |
+------------------------------------------------------------------+
|  Pages          |  Components       |  Contexts                  |
|  - HomePage     |  - Navbar         |  - ListingsContext         |
|  - ListingDe... |  - SearchBar      |  - NotificationsContext    |
|  - BookingsPage |  - ListingCard    |                            |
|  - ProfilePage  |  - BookingCard    |  Hooks                     |
|  - HostingPage  |  - ReviewSection  |  - useCurrentUser          |
|  - AuthPage     |  - Map            |  - useGesture              |
|  - ...          |  - ...            |  - useNotifications        |
+------------------------------------------------------------------+
                             |
                             v
+------------------------------------------------------------------+
|                      Supabase Backend                            |
+------------------------------------------------------------------+
|  Auth            |  Database (PostgreSQL)  |  Realtime           |
|  - Email/Pass    |  - users                |  - notifications    |
|  - OAuth         |  - listings             |  - bookings         |
|  - Sessions      |  - bookings             |                     |
|                  |  - reviews              |  Edge Functions     |
|  Storage         |  - wishlist             |  - delete-user      |
|  - Images        |  - notifications        |                     |
|                  |  - amenities            |                     |
|  RPC Functions   |  - listing_images       |                     |
|  - CRUD ops      |  - payments             |                     |
|  - Business logic|                         |                     |
+------------------------------------------------------------------+
```

---

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Cloudinary account

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/homyfy.git
cd homyfy
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp .env.example .env
```

4. Configure environment variables (see [Environment Variables](#environment-variables))

5. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_PROJECT_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Cloudinary Configuration (for image uploads)
# Configured directly in AddPropertyPage.jsx and ProfilePage.jsx
```

---

## Project Structure

```
src/
├── assets/                  # Static assets (images, icons)
├── components/
│   ├── forms/               # Form components
│   │   └── LocationPicker.jsx
│   ├── layout/              # Layout components
│   │   ├── Footer.jsx
│   │   └── Navbar.jsx
│   ├── listings/            # Listing-related components
│   │   ├── details/         # Listing detail components
│   │   │   ├── AmenitiesModal.jsx
│   │   │   ├── BookingCard.jsx
│   │   │   ├── ConfirmationModal.jsx
│   │   │   ├── ImageGallery.jsx
│   │   │   ├── Pseudo360Viewer.jsx
│   │   │   ├── ReviewSection.jsx
│   │   │   └── SuccessModal.jsx
│   │   ├── ListingCard.jsx
│   │   ├── ListingGrid.jsx
│   │   └── PropertyFilters.jsx
│   ├── map/                 # Map components
│   │   └── Map.jsx
│   ├── search/              # Search components
│   │   ├── DateRangePicker.jsx
│   │   ├── GuestsCounter.jsx
│   │   └── SearchBar.jsx
│   └── ui/                  # Reusable UI components
│       ├── AnimatedCounter.jsx
│       ├── ConfettiEffect.jsx
│       ├── EmptyState.jsx
│       ├── FloatingActionButton.jsx
│       ├── Hero.jsx
│       ├── ImageCarousel.jsx
│       ├── ImageLightbox.jsx
│       ├── ListingCardSkeleton.jsx
│       ├── LoadingSpinner.jsx
│       ├── NotificationBadge.jsx
│       ├── NotificationBell.jsx
│       ├── NumberStepper.jsx
│       ├── ProgressIndicator.jsx
│       ├── ScrollReveal.jsx
│       ├── SectionDivider.jsx
│       ├── Tooltip.jsx
│       └── UserMenu.jsx
├── contexts/                # React contexts
│   ├── AuthContext.jsx
│   ├── ListingsContext.jsx
│   └── NotificationsContext.jsx
├── data/                    # Static data
│   ├── countries.js         # Country/province data
│   ├── helpData.js          # Help center content
│   └── mockData.js          # Mock listings data
├── hooks/                   # Custom hooks
│   ├── useCurrentUser.js
│   ├── useGesture.js
│   └── useNotifications.js
├── pages/                   # Page components
│   ├── AddPropertyPage.jsx
│   ├── AuthPage.jsx
│   ├── BecomeHostPage.jsx
│   ├── BookingsPage.jsx
│   ├── EditListingPage.jsx
│   ├── HelpCenterPage.jsx
│   ├── HomePage.jsx
│   ├── HostAuthPage.jsx
│   ├── HostingPage.jsx
│   ├── ListingDetailsPage.jsx
│   ├── NotFoundPage.jsx
│   ├── NotificationsPage.jsx
│   ├── ProfilePage.jsx
│   ├── ResetPasswordPage.jsx
│   ├── SearchResultsPage.jsx
│   ├── SignupPage.jsx
│   └── WishlistPage.jsx
├── supabase/                # Supabase configuration
│   ├── supabase.js          # Client initialization
│   └── supabaseFunctions.js # Legacy functions
├── utils/                   # Utility functions
│   ├── fetchProfileImage.js
│   ├── matterportHelper.js
│   └── rotationUtils.js
├── App.jsx                  # Main app component
├── App.css                  # App styles
├── index.css                # Global styles
└── main.jsx                 # Entry point
```

---

## Database Schema

### Core Tables

**users**
- `id` (UUID, PK) - Supabase auth user ID
- `email` (VARCHAR)
- `username` (VARCHAR)
- `fullname` (VARCHAR)
- `phone` (VARCHAR)
- `role` (ENUM: 'guest', 'host')
- `profile_image` (VARCHAR, nullable)
- `created_at` (TIMESTAMP)

**listings**
- `id` (UUID, PK)
- `host_id` (UUID, FK -> users)
- `title` (VARCHAR)
- `description` (TEXT)
- `property_type` (VARCHAR)
- `price_value` (DECIMAL)
- `bed_count` (INTEGER)
- `bathroom_count` (INTEGER)
- `guest_count` (INTEGER)
- `location` (VARCHAR)
- `latitude` (DECIMAL)
- `longitude` (DECIMAL)
- `matterport_url` (VARCHAR, nullable)
- `created_at` (TIMESTAMP)

**bookings**
- `id` (UUID, PK)
- `guest_id` (UUID, FK -> users)
- `listing_id` (UUID, FK -> listings)
- `start_date` (DATE)
- `end_date` (DATE)
- `total_amount` (DECIMAL)
- `payment_status` (ENUM)
- `created_at` (TIMESTAMP)

**reviews**
- `id` (UUID, PK)
- `guest_id` (UUID, FK -> users)
- `listing_id` (UUID, FK -> listings)
- `rating` (DECIMAL)
- `review_text` (TEXT)
- `created_at` (TIMESTAMP)

**wishlist**
- `id` (UUID, PK)
- `guest_id` (UUID, FK -> users)
- `listing_id` (UUID, FK -> listings)
- `created_at` (TIMESTAMP)

**notifications**
- `id` (UUID, PK)
- `user_id` (UUID, FK -> users)
- `title` (VARCHAR)
- `message` (TEXT)
- `is_read` (BOOLEAN)
- `created_at` (TIMESTAMP)

### Supporting Tables

- `amenities` - Predefined amenity options
- `listing_amenities` - Junction table for listing-amenity relationships
- `listing_images` - Image URLs for listings
- `payments` - Payment records for bookings

### Materialized Views

- `filtered_listings_mv` - Denormalized view for optimized listing queries

---

## API Reference

### Supabase RPC Functions

| Function | Description | Parameters |
|----------|-------------|------------|
| `signup_user` | Create user profile | id, email, username, fullname, phone, role |
| `login_user` | Validate user role | input_email, expected_role |
| `get_user_by_id` | Fetch user profile | uid |
| `insert_listing` | Create new listing | title, description, type, price, etc. |
| `fetch_listings_by_user` | Get host's listings | user_id |
| `get_listing_by_id` | Fetch single listing | p_id |
| `get_all_listing` | Fetch listing with all details | listing_id |
| `create_booking_with_payment` | Create booking and payment | guest_id, listing_id, dates, total, method |
| `fetch_bookings_by_guest` | Get guest's bookings | guest_id |
| `check_overlapping_bookings` | Validate date availability | guest_id, listing_id, start_date, end_date |
| `toggle_wishlist` | Add/remove from wishlist | p_guest_id, p_listing_id |
| `get_user_wishlist` | Fetch wishlist items | user_id |
| `create_review_with_check` | Submit review | p_listing_id, p_guest_id, p_review_text, p_rating |
| `get_reviews_for_listing` | Fetch listing reviews | listing |
| `has_booked_listing` | Check booking eligibility | guest_id, listing_id |
| `has_reviewed_listing` | Check review eligibility | guest_id, listing_id |
| `get_user_notifications` | Fetch notifications | p_user_id, p_limit, p_offset |
| `mark_notification_read` | Mark as read | p_notification_id |
| `mark_all_notifications_read` | Mark all as read | p_user_id |

---

## Deployment

### Vercel Deployment

1. Connect repository to Vercel

2. Configure environment variables in Vercel dashboard

3. The included `vercel.json` handles SPA routing:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

4. Deploy via Vercel CLI or GitHub integration

### Build Configuration

```bash
# Build command
npm run build

# Output directory
dist
```

---

## Performance Optimizations

- **Lazy Loading**: All pages are lazy-loaded using `React.lazy()` and `Suspense`
- **Image Optimization**: Cloudinary CDN with responsive images
- **Database Optimization**: Materialized views for complex listing queries
- **Debouncing**: Search input debounced to reduce API calls
- **Memoization**: React.memo for expensive component renders
- **State Management**: URL-based state for shareable search results

---

## Security Considerations

- Row Level Security (RLS) policies on all Supabase tables
- Server-side validation via RPC functions
- Session-based authentication with auto-refresh
- Secure password handling via Supabase Auth
- Input validation on all forms
- XSS prevention via React's built-in escaping

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Open a Pull Request

### Code Standards

- Follow ESLint configuration
- Use functional components with hooks
- Maintain consistent file structure
- Write descriptive commit messages
- Add comments for complex logic

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## Acknowledgments

- [Supabase](https://supabase.com) - Backend as a Service
- [Tailwind CSS](https://tailwindcss.com) - CSS Framework
- [Framer Motion](https://www.framer.com/motion) - Animation Library
- [Leaflet](https://leafletjs.com) - Map Library
- [OpenStreetMap](https://www.openstreetmap.org) - Map Data
