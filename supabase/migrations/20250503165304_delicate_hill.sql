/*
  # Update filtered listings materialized view
  
  1. Changes
    - Aggregate image URLs into an array
    - Add distinct to prevent duplicates
    - Add index for better performance
*/

DROP MATERIALIZED VIEW IF EXISTS filtered_listings_mv;

CREATE MATERIALIZED VIEW filtered_listings_mv AS
SELECT
  l.id,
  l.title,
  l.description,
  l.price_value,
  l.property_type,
  l.bed_count,
  l.bathroom_count,
  l.guest_count,
  l.location,
  l.rating_overall,
  l.reviews_count,
  l.created_at,
  array_agg(DISTINCT li.image_url) AS image_urls,
  u.fullname AS host_name,
  u.email AS host_email,
  array_agg(DISTINCT a.amenity_name) AS amenity_names
FROM
  listings l
  LEFT JOIN listing_images li ON l.id = li.listing_id
  LEFT JOIN users u ON l.user_id = u.id
  LEFT JOIN listing_amenities la ON l.id = la.listing_id
  LEFT JOIN amenities a ON la.amenity_id = a.id
GROUP BY
  l.id, u.fullname, u.email;

CREATE INDEX idx_filtered_listings_mv_id ON filtered_listings_mv (id);