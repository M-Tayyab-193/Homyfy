import supabase from "../supabase/supabase";
import { toast } from "react-toastify";

export async function fetchProfileImageById(userId) {
  console.log('fetchProfileImage: Starting with userId:', userId);
  
  if (!userId) {
    console.log('fetchProfileImage: No userId provided, returning null');
    return null;
  }

  try {
    console.log('fetchProfileImage: Making RPC call');
    const { data, error } = await supabase.rpc("get_user_profile_image", {
      p_user_id: userId,
    });

    if (error) {
      console.error("fetchProfileImage: RPC error:", error);
      toast.error("Error fetching profile image via RPC:", error.message);
      return null;
    }

    console.log('fetchProfileImage: Success, returning data:', data);
    return data; // string or null
  } catch (err) {
    console.error("fetchProfileImage: Unexpected error:", err);
    toast.error("Unexpected error in fetchProfileImageById:", err);
    return null;
  }
}