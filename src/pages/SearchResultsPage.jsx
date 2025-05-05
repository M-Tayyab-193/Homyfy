import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ListingGrid from '../components/listings/ListingGrid'
import PropertyFilters from '../components/listings/PropertyFilters'
import Map from '../components/map/Map'
import { FaMapMarkerAlt, FaList } from 'react-icons/fa'
import supabase from '../supabase/supabase'

function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [results, setResults] = useState([])
  const [showMap, setShowMap] = useState(false)
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const listingsPerPage = 12

  // Get all params from URL
  const location = searchParams.get('location') || ''
  const checkIn = searchParams.get('checkIn') 
    ? new Date(searchParams.get('checkIn')) 
    : new Date()
  const checkOut = searchParams.get('checkOut')
    ? new Date(searchParams.get('checkOut'))
    : new Date(new Date().setDate(new Date().getDate() + 7))
  const guests = parseInt(searchParams.get('guests') || '1', 10)
  const activeFilter = searchParams.get('filter') || 'all'
  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const sortType = searchParams.get('sort') || ''
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''

  useEffect(() => {
    document.title = `${location || 'All locations'} - Airbnb Clone`
    fetchListings()
  }, [location, guests, activeFilter, currentPage, sortType, minPrice, maxPrice])

  const fetchListings = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('listings')
        .select(`
          *,
          users (
            id,
            fullname,
            email
          ),
          listing_images (
            image_url
          )
        `, { count: 'exact' })

      // Apply location filter if provided
      if (location) {
        query = query.ilike('location', `%${location}%`)
      }

      // Apply guest count filter - ensure guest_count is exactly equal to or greater
      if (guests > 0) {
        query = query.eq('guest_count', guests)
      }

      // Apply property type filter
      if (activeFilter !== 'all') {
        query = query.eq('property_type', activeFilter)
      }

      // Apply price range filters
      if (minPrice) {
        query = query.gte('price_value', parseFloat(minPrice))
      }
      if (maxPrice) {
        query = query.lte('price_value', parseFloat(maxPrice))
      }

      // Apply sorting
      if (sortType) {
        switch (sortType) {
          case 'price_high_low':
            query = query.order('price_value', { ascending: false })
            break
          case 'price_low_high':
            query = query.order('price_value', { ascending: true })
            break
          case 'rating_high_low':
            query = query.order('rating_overall', { ascending: false })
            break
          case 'rating_low_high':
            query = query.order('rating_overall', { ascending: true })
            break
        }
      }

      // Calculate pagination
      const start = (currentPage - 1) * listingsPerPage
      const end = start + listingsPerPage - 1
      query = query.range(start, end)

      const { data, error, count } = await query

      if (error) throw error

      // Transform the data
      const transformedData = data.map(listing => ({
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
        images: listing.listing_images.map(img => img.image_url),
        host: {
          id: listing.users?.id,
          name: listing.users?.fullname,
          email: listing.users?.email
        }
      }))

      setResults(transformedData)
      setTotalCount(count || 0)
    } catch (error) {
      console.error('Error fetching listings:', error)
      setResults([])
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }

  const updateSearchParams = (updates) => {
    const newParams = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value)
      } else {
        newParams.delete(key)
      }
    })
    setSearchParams(newParams)
  }

  const handleFilterChange = (filter) => {
    updateSearchParams({ filter, page: '1' })
  }

  const handlePriceChange = (min, max) => {
    updateSearchParams({ 
      minPrice: min || '',
      maxPrice: max || '',
      page: '1'
    })
  }

  const handleSortChange = (sortType) => {
    updateSearchParams({ sort: sortType, page: '1' })
  }

  const handlePageChange = (newPage) => {
    updateSearchParams({ page: newPage.toString() })
  }

  // Format date range for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  
  const dateRangeDisplay = `${formatDate(checkIn)} - ${formatDate(checkOut)}`

  return (
    <div className="container-custom py-6">
      {/* Search Summary */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-semibold mb-1">
            {totalCount} {totalCount === 1 ? 'place' : 'places'} in {location || 'all locations'}
          </h1>
          <p className="text-airbnb-light">
            {dateRangeDisplay} · {guests} {guests === 1 ? 'guest' : 'guests'}
          </p>
        </div>
        
        <button
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-black transition-colors"
          onClick={() => setShowMap(!showMap)}
        >
          {showMap ? (
            <>
              <FaList />
              <span>Show list</span>
            </>
          ) : (
            <>
              <FaMapMarkerAlt />
              <span>Show map</span>
            </>
          )}
        </button>
      </div>
      
      {/* Property Type Filters */}
      <PropertyFilters 
        activeFilter={activeFilter}
        currentSort={sortType}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onFilterChange={handleFilterChange}
        onPriceChange={handlePriceChange}
        onSortChange={handleSortChange}
      />
      
      {/* Results display - Grid or Map */}
      {showMap ? (
        <div className="h-[70vh] rounded-xl overflow-hidden">
          <Map
            latitude={40.7128}
            longitude={-74.0060}
            zoom={10}
            markers={results.map(listing => ({
              id: listing.id,
              latitude: listing.latitude,
              longitude: listing.longitude,
              title: listing.title,
              price: listing.price
            }))}
          />
        </div>
      ) : (
        <ListingGrid 
          listings={results} 
          loading={loading} 
          emptyMessage={`No places found in ${location || 'this location'}`}
        />
      )}

      {/* Pagination */}
      {totalCount > listingsPerPage && (
        <div className="flex justify-center items-center mt-8 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-full ${
              currentPage === 1 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-airbnb-dark hover:bg-gray-100'
            }`}
          >
            &lt;
          </button>

          {Array.from({ length: Math.ceil(totalCount / listingsPerPage) }, (_, i) => i + 1)
            .filter(page => {
              return (
                page === 1 ||
                page === Math.ceil(totalCount / listingsPerPage) ||
                Math.abs(page - currentPage) <= 1
              )
            })
            .map((page, i, arr) => {
              const prevPage = arr[i - 1];
              const showEllipsis = prevPage && page - prevPage > 1;
              return (
                <div key={page} className="flex items-center">
                  {showEllipsis && <span className="px-2">...</span>}
                  <button
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentPage === page
                        ? 'bg-airbnb-primary text-white'
                        : 'text-airbnb-dark hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                </div>
              )
            })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(totalCount / listingsPerPage)}
            className={`p-2 rounded-full ${
              currentPage === Math.ceil(totalCount / listingsPerPage)
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-airbnb-dark hover:bg-gray-100'
            }`}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  )
}

export default SearchResultsPage