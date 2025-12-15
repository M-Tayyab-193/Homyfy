import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import ListingGrid from '../components/listings/ListingGrid'
import PropertyFilters from '../components/listings/PropertyFilters'
import EmptyState from '../components/ui/EmptyState'
import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa'
import supabase from '../supabase/supabase'
import { FaChevronLeft, FaChevronRight} from 'react-icons/fa'

function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const listingsPerPage = 12

  // Get all params from URL
  const location = searchParams.get('location') || ''
  const guests = parseInt(searchParams.get('guests') || '1', 10)
  const activeFilter = searchParams.get('filter') || 'all'
  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const sortType = searchParams.get('sort') || ''
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''
  const amenitiesParam = searchParams.get('amenities')
  
  const selectedAmenities = useMemo(() => {
    return amenitiesParam ? amenitiesParam.split(',') : []
  }, [amenitiesParam])

  useEffect(() => {
    document.title = `${location || 'All locations'} - Homyfy`
    window.scrollTo({ top: 0, behavior: 'smooth' })
    fetchListings()
  }, [location, guests, activeFilter, currentPage, sortType, minPrice, maxPrice, selectedAmenities])

  const fetchListings = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('filtered_listings_mv')
        .select('*', { count: 'exact' })

      // Apply location filter if provided
      if (location) {
        query = query.ilike('location', `%${location}%`)
      }

      // Apply guest count filter
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

      // Apply amenities filter
      if (selectedAmenities.length > 0) {
        query = query.contains('amenity_names', selectedAmenities)
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
      } else {
        query = query.order('created_at', { ascending: false })
      }

      // Calculate pagination
      const start = (currentPage - 1) * listingsPerPage
      const end = start + listingsPerPage - 1
      query = query.range(start, end)

      const { data, error, count } = await query

      if (error) {
        console.error('Error fetching listings:', error)
        throw error
      }

      if (!data) {
        console.warn('No data returned from query')
        setResults([])
        setTotalCount(0)
        return
      }

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
        images: listing.image_urls,
        host: {
          name: listing.host_name,
          email: listing.host_email,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${listing.host_email}`
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

  const handlePriceChange = (min, max, amenities) => {
    updateSearchParams({ 
      minPrice: min || '',
      maxPrice: max || '',
      amenities: amenities?.join(',') || '',
      page: '1'
    })
  }

  const handleSortChange = (sortType) => {
    updateSearchParams({ sort: sortType, page: '1' })
  }

  const handlePageChange = (newPage) => {
    updateSearchParams({ page: newPage.toString() })
  }

  return (
    <div className="container-custom py-6 mt-[90px]">
      {/* Search Summary with gradient background */}
      <motion.div 
        className="relative p-6 mb-8 rounded-2xl overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-sky-50 to-blue-100 opacity-50" />
        
        {/* Content */}
        <div className="relative flex justify-between items-center flex-wrap gap-4">
          <div>
            <motion.h1 
              className="text-3xl font-bold mb-2 gradient-text"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {totalCount} {totalCount === 1 ? 'place' : 'places'}
            </motion.h1>
            <motion.p 
              className="text-gray-600 flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <FaMapMarkerAlt className="#0F1520" />
              {location || 'all locations'}
            </motion.p>
          </div>
          
         
        </div>
      </motion.div>
      
      {/* Property Type Filters */}
      <PropertyFilters 
        activeFilter={activeFilter}
        currentSort={sortType}
        minPrice={minPrice}
        maxPrice={maxPrice}
        selectedAmenities={selectedAmenities}
        onFilterChange={handleFilterChange}
        onPriceChange={handlePriceChange}
        onSortChange={handleSortChange}
      />
      
      {/* Results display */}
      {totalCount === 0 && !loading ? (
        <EmptyState
          icon={FaSearch}
          title="No places found"
          description={`We couldn't find any places matching your search in ${location || 'this location'}. Try adjusting your filters or search in a different area.`}
          actionText="Clear filters"
          onAction={() => setSearchParams({ location: location || '' })}
        />
      ) : (
        <ListingGrid 
          listings={results} 
          loading={loading} 
          emptyMessage={`No places found in ${location || 'this location'}`}
        />
      )}

      {/* Pagination */}
      {totalCount > listingsPerPage && (
        <motion.div 
          className="flex justify-center items-center mt-12 space-x-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-3 rounded-full transition-all btn-ripple ${
              currentPage === 1 
                ? 'text-gray-300 cursor-not-allowed bg-gray-100' 
                : 'text-white bg-gradient-to-r from-[#0F1520] to-[#1a2332] hover:shadow-glow'
            }`}
            whileHover={currentPage !== 1 ? { scale: 1.1 } : {}}
            whileTap={currentPage !== 1 ? { scale: 0.9 } : {}}
          >
            <FaChevronLeft />
          </motion.button>

          <div className="flex space-x-2">
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
                    {showEllipsis && <span className="px-2 text-gray-400">...</span>}
                    <motion.button
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-full font-medium transition-all btn-ripple ${
                        currentPage === page
                          ? 'bg-gradient-to-r from-[#0F1520] to-[#1a2332] text-white shadow-glow'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {page}
                    </motion.button>
                  </div>
                )
              })}
          </div>

          <motion.button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(totalCount / listingsPerPage)}
            className={`p-3 rounded-full transition-all btn-ripple ${
              currentPage === Math.ceil(totalCount / listingsPerPage)
                ? 'text-gray-300 cursor-not-allowed bg-gray-100' 
                : 'text-white bg-gradient-to-r from-[#0F1520] to-[#1a2332] hover:shadow-glow'
            }`}
            whileHover={currentPage !== Math.ceil(totalCount / listingsPerPage) ? { scale: 1.1 } : {}}
            whileTap={currentPage !== Math.ceil(totalCount / listingsPerPage) ? { scale: 0.9 } : {}}
          >
            <FaChevronRight />
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}

export default SearchResultsPage