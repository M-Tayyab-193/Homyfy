/**
 * Helper utilities for Matterport 3D virtual tours
 */

/**
 * Extracts Matterport ID from a full URL or returns the ID if already provided
 * @param {string} url - Matterport URL or ID
 * @returns {string|null} - Extracted Matterport ID or null if invalid
 * 
 * Supported formats:
 * - https://my.matterport.com/show/?m=XXXXXXXXXX
 * - Direct ID: XXXXXXXXXX
 */
export const extractMatterportId = (url) => {
  if (!url || typeof url !== 'string') return null;
  
  const trimmedUrl = url.trim();
  
  try {
    // Try to parse as URL
    const urlObj = new URL(trimmedUrl);
    const params = new URLSearchParams(urlObj.search);
    const id = params.get('m');
    
    if (id) return id;
  } catch {
    // Not a valid URL, might be just an ID
  }
  
  // Check if it's already just an ID (typically 11 characters)
  // Matterport IDs are alphanumeric
  if (/^[a-zA-Z0-9]{10,12}$/.test(trimmedUrl)) {
    return trimmedUrl;
  }
  
  return null;
};

/**
 * Validates if a Matterport URL or ID is valid
 * @param {string} url - Matterport URL or ID to validate
 * @returns {boolean} - True if valid
 */
export const isValidMatterportUrl = (url) => {
  return extractMatterportId(url) !== null;
};

/**
 * Generates Matterport embed URL from ID
 * @param {string} id - Matterport ID
 * @returns {string} - Full embed URL
 */
export const getMatterportEmbedUrl = (id) => {
  if (!id) return null;
  return `https://my.matterport.com/show/?m=${id}&play=1`;
};
