import { createContext, useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import supabase from "../supabase/supabase";

const ListingsContext = createContext(null);

export function useListings() {
  return useContext(ListingsContext);
}

export function ListingsProvider({ children }) {
  const [listings, setListings] = useState([]);
  const [featuredListings, setFeaturedListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch wishlist items when component mounts
  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("wishlist")
        .select("listing_id")
        .eq("guest_id", user.id);

      if (error) throw error;

      setWishlist(data.map((item) => item.listing_id));
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    }
  };

  const toggleWishlist = async (listingId) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      toast.info("Please log in to save to your wishlist");
      return;
    }

    const { data, error } = await supabase
      .rpc("toggle_wishlist", {
        p_guest_id: user.id,
        p_listing_id: listingId,
      });

    if (error) throw error;

    const isNowWishlisted = data;

    if (isNowWishlisted) {
      setWishlist((prev) => [...prev, listingId]);
      toast.success("Added to wishlist");
    } else {
      setWishlist((prev) => prev.filter((id) => id !== listingId));
      toast.success("Removed from wishlist");
    }
  } catch (err) {
    console.error("Error updating wishlist:", err);
    toast.error("Failed to update wishlist. Please try again.");
  }
};

const fetchFilteredListings = async (page = 1, limit = 12, filters = {}) => {
    try {
      const start = (page - 1) * limit;
      const end = start + limit - 1;

      let query = supabase
        .from("filtered_listings_mv")
        .select("*", { count: "exact" });

      // Apply filters
      if (filters.type && filters.type !== "all") {
        query = query.eq("property_type", filters.type);
      }
      if (filters.minPrice) {
        query = query.gte("price_value", filters.minPrice);
      }
      if (filters.maxPrice) {
        query = query.lte("price_value", filters.maxPrice);
      }
      if (filters.amenities && filters.amenities.length > 0) {
        query = query.contains("amenity_names", filters.amenities);
      }

      // Apply sorting
      if (filters.sort) {
        switch (filters.sort) {
          case "price_high_low":
            query = query.order("price_value", { ascending: false });
            break;
          case "price_low_high":
            query = query.order("price_value", { ascending: true });
            break;
          case "rating_high_low":
            query = query.order("rating_overall", { ascending: false });
            break;
          case "rating_low_high":
            query = query.order("rating_overall", { ascending: true });
            break;
          default:
            query = query.order("created_at", { ascending: false });
        }
      } else {
        // Default sorting by creation date
        query = query.order("created_at", { ascending: false });
      }

      query = query.range(start, end);

      const { data, error, count } = await query;

      if (error) {
        console.error("Supabase query error:", error)
        throw error
      }
      if (!data) {
        console.warn("Supabase returned no data")
        return []
      }
    
      setTotalCount(count || 0);

      const transformedListings = data.map((listing) => ({
        id: listing.id,
        title: listing.title,
        description: listing.description,
        price: listing.price_value,
        type: listing.property_type,
        beds: listing.bed_count,
        bathrooms: listing.bathroom_count,
        maxGuests: listing.guest_count,
        location: listing.location,
        rating: listing.rating_overall,
        reviewCount: listing.reviews_count,
        images: listing.image_urls,
        host: {
          name: listing.host_name,
          email: listing.host_email,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${listing.host_email}`,
        },
      }));
      

      return transformedListings;
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError(err.message);
      return [];
    }
  };

 const getListingById = async (id) => {
  try {
    const { data, error } = await supabase.rpc("get_listing_by_id", {
      p_id: id,
    });

    if (error) throw error;

    const listing = data[0]; // RPC always returns an array

    return {
      id: listing.id,
      title: listing.title,
      description: listing.description,
      price: listing.price_value,
      type: listing.property_type,
      beds: listing.bed_count,
      bathrooms: listing.bathroom_count,
      maxGuests: listing.guest_count,
      location: listing.location,
      rating: listing.rating_overall,
      reviewCount: listing.reviews_count,
      images: listing.image_urls,
      host: {
        id: listing.host_id,
        name: listing.host_name,
        email: listing.host_email,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${listing.host_email}`,
      },
    };
  } catch (err) {
    console.error("Error fetching listing by ID:", err);
    return null;
  }
};


 const value = {
  listings,
  featuredListings,
  loading,
  error,
  wishlist,
  totalCount,
  toggleWishlist,
  getListingById, // now using RPC
  fetchFilteredListings
};

  return (
    <ListingsContext.Provider value={value}>
      {children}
    </ListingsContext.Provider>
  );
}
