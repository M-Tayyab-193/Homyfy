import supabase from "../supabase/supabase";

// Cache for profile images
const imageCache = new Map();

export async function fetchProfileImageById(userId) {
  if (!userId) {
    return null;
  }

  // Check cache first
  if (imageCache.has(userId)) {
    return imageCache.get(userId);
  }

  try {
    const { data, error } = await supabase.rpc("get_user_profile_image", {
      p_user_id: userId,
    });

    if (error) {
      console.error("Error fetching profile image:", error);
      return null;
    }

    // Cache the result
    imageCache.set(userId, data);
    return data;
  } catch (err) {
    console.error("Unexpected error fetching profile image:", err);
    return null;
  }
}

// Clear cache function (useful for profile updates)
export function clearProfileImageCache(userId) {
  if (userId) {
    imageCache.delete(userId);
  } else {
    imageCache.clear();
  }
}