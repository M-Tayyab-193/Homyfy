import { FaRocket, FaSearch, FaHome, FaKey, FaListUl, FaQuestionCircle } from 'react-icons/fa';

export const HELP_CATEGORIES = [
  {
    id: 'getting-started',
    title: 'Introduction & Getting Started',
    icon: FaRocket,
    description: 'Learn the basics of Homyfy and how to create an account.',
    articles: [
      {
        id: 'what-is-homyfy',
        title: 'What is Homyfy?',
        content: 'Homyfy is a modern property rental platform connecting property owners with travelers. Find your perfect accommodation or list your property to earn income.'
      },
      {
        id: 'creating-account',
        title: 'Creating an Account',
        content: `1. Click "Sign Up" from the navigation menu
2. Enter your Email Address (e.g., your.email@example.com)
3. Choose a unique Username
4. Enter your Full Name
5. Provide your Mobile Number
6. Create a strong Password
7. Select Account Type:
   - Guest: To book stays
   - Host: To list properties
8. Click "Create Account" to complete registration`
      }
    ]
  },
  {
    id: 'searching',
    title: 'Searching for Properties',
    icon: FaSearch,
    description: 'How to find the perfect stay using search and filters.',
    articles: [
      {
        id: 'using-search-bar',
        title: 'Using the Search Bar',
        content: `Steps:
1. Location - Type your location
2. Dates - Select check-in and check-out dates
3. Guests - Use +/- buttons to select number of guests
4. Click "Search"`
      },
      {
        id: 'filtering-results',
        title: 'Filtering Search Results',
        content: `Filter results by:
- Property Type: House, Apartment, Villa, Cabin
- Price Range: Use slider for min/max price per night
- Amenities: WiFi, Kitchen, Parking, Pool, etc.

Sort results by:
- Price (Low to High / High to Low)
- Rating (Highest first)`
      }
    ]
  },
  {
    id: 'viewing-booking',
    title: 'Viewing & Booking',
    icon: FaHome,
    description: ' exploring property details, 3D tours, and making reservations.',
    articles: [
      {
        id: 'property-details',
        title: 'Property Details Page',
        content: `What You'll See:
- High-quality images with gallery
- Complete description
- Price per night
- Amenities list
- Location on interactive map
- Host information
- Reviews and ratings`
      },
      {
        id: '3d-tours',
        title: '3D Virtual Tours',
        content: 'If available, switch to "3D Virtual Tour" tab to explore the property in 3D using Matterport technology.'
      },
      {
        id: 'making-booking',
        title: 'Making a Booking',
        content: `1. Select your dates
2. Choose number of guests
3. Review price breakdown
4. Click "Book Now"
5. Confirm booking`
      }
    ]
  },
  {
    id: 'hosting',
    title: 'Hosting Your Property',
    icon: FaKey,
    description: 'List your property and start earning income.',
    articles: [
      {
        id: 'creating-listing',
        title: 'Creating a New Listing',
        content: `Navigate to "List Property" or "Become a Host" to start.

Step-by-Step Guide:

1. Basic Information
- Property title
- Detailed description
- Property type
- Price per night

2. Property Details
- Beds (1-20), Bathrooms (1-10), Max Guests (1-50)

3. Location Selection
- Set location using interactive map
- Drag marker for precision

4. Amenities
- Select features like WiFi, Kitchen, etc.

5. Upload Images
- Up to 10 images (JPEG/PNG)

6. 3D Virtual Tour (Optional)
- Paste Matterport URL if available

7. Submit
- Review and click "Create Listing"`
      }
    ]
  },
  {
    id: 'managing',
    title: 'Managing Bookings & Listings',
    icon: FaListUl,
    description: 'Manage your reservations and property listings.',
    articles: [
      {
        id: 'your-bookings',
        title: 'Your Bookings (Guest)',
        content: `Access via Profile Menu → "My Bookings"

View all your made reservations with their payment statuses:
- Paid
- Pending

Click "View Details" to see full reservation information.`
      },
      {
        id: 'your-listings',
        title: 'Your Listings (Host)',
        content: `Access via Profile Menu → "Hosting"

- View all active properties
- Edit: Update details, images, price
- Delete: Permanently remove listing`
      }
    ]
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting & Support',
    icon: FaQuestionCircle,
    description: 'Common issues and how to resolve them.',
    articles: [
      {
        id: 'search-issues',
        title: 'Search showing no results?',
        content: `- Try different location spellings
- Adjust filters or date range
- Increase price range`
      },
      {
        id: 'upload-issues',
        title: "Can't upload images?",
        content: `- Max file size: 5MB per image
- Accepted formats: JPEG, PNG
- Try fewer images at once`
      },
      {
        id: 'map-issues',
        title: 'Map not showing location?',
        content: `- Check internet connection
- Refresh the page
- Click map directly if search fails`
      }
    ]
  }
];
