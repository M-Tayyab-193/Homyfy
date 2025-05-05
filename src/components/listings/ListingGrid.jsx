import ListingCard from './ListingCard'
import LoadingSpinner from '../ui/LoadingSpinner'

function ListingGrid({ listings = [], loading, emptyMessage = "No listings found" }) {
  // Debugging: Check if listings is an array and log its content
  console.log("Listings prop:", listings);

  // Check if listings is an array, otherwise log an error
  if (!Array.isArray(listings)) {
    console.error("Error: Listings is not an array:", listings);
    return <div>Error: Listings data is not in the expected format.</div>;
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!listings || listings.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">Oops! {emptyMessage}</h3>
        <p className="text-airbnb-light">Try adjusting your search to find what you're looking for.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.isArray(listings) && listings.length > 0 ? (
        listings.map((listing, index) => (
          <div
            key={listing.id}
            className="opacity-0 animate-[fadeIn_0.5s_ease-in-out_forwards]"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <ListingCard listing={listing} />
          </div>
        ))
      ) : (
        <p>No listings available</p>
      )}
    </div>
  )
}

export default ListingGrid
