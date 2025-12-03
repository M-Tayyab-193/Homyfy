import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useListings } from '../contexts/ListingsContext'
import ListingGrid from '../components/listings/ListingGrid'
import PropertyFilters from '../components/listings/PropertyFilters'
import Hero from '../components/ui/Hero'
import SectionDivider from '../components/ui/SectionDivider'
import { useMemo } from 'react'
import { FaChevronLeft, FaChevronRight, FaHome } from 'react-icons/fa'

function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { fetchFilteredListings, totalCount } = useListings()
  const [currentListings, setCurrentListings] = useState([])
  const [loading, setLoading] = useState(true)
  const listingsPerPage = 12

  // Get filter params from URL
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
    const loadListings = async () => {
      setLoading(true)
      const filters = {
        type: activeFilter,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        sort: sortType,
        amenities: selectedAmenities.length ? selectedAmenities : undefined
      }
      try {
        const listings = await fetchFilteredListings(currentPage, listingsPerPage, filters)
        setCurrentListings(Array.isArray(listings) ? listings : [])
      } catch (error) {
        console.error("Error fetching listings:", error)
        setCurrentListings([])
      }
      setLoading(false)
    }
    loadListings()
  }, [currentPage, activeFilter, sortType, minPrice, maxPrice, selectedAmenities, fetchFilteredListings])

  const totalPages = Math.ceil(totalCount / listingsPerPage)

  const getPageNumbers = () => {
    const pages = []
    pages.push(currentPage)
    
    if (currentPage > 1) {
      pages.unshift(currentPage - 1)
    }
    
    if (currentPage < totalPages) {
      pages.push(currentPage + 1)
    }
    
    if (pages.length < 3) {
      if (currentPage === 1 && totalPages >= 3) {
        pages.push(currentPage + 2)
      } else if (currentPage === totalPages && totalPages >= 3) {
        pages.unshift(currentPage - 2)
      }
    }
    
    return pages
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

  const handlePriceChange = (min, max, selectedAmenities) => {
    updateSearchParams({ 
      minPrice: min || '',
      maxPrice: max || '',
      amenities: selectedAmenities?.join(',') || '',
      page: '1'
    })
  }

  const handleSortChange = (sortType) => {
    updateSearchParams({ sort: sortType, page: '1' })
  }

  return (
    <div>
      <Hero />
      <div className="mt-48 sm:mt-40 md:mt-32 lg:mt-20">
        <SectionDivider icon={FaHome} text="Explore Properties" />
      </div>
      <div className="container-custom pb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PropertyFilters 
            activeFilter={activeFilter}
            currentSort={sortType}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onFilterChange={handleFilterChange}
            onPriceChange={handlePriceChange}
            onSortChange={handleSortChange}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ListingGrid 
            listings={Array.isArray(currentListings) ? currentListings : []} 
            loading={loading} 
          />
        </motion.div>

        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center items-center mt-12 space-x-3"
          >
            <motion.button
              onClick={() => updateSearchParams({ page: (currentPage - 1).toString() })}
              disabled={currentPage === 1}
              whileHover={currentPage !== 1 ? { scale: 1.1 } : {}}
              whileTap={currentPage !== 1 ? { scale: 0.9 } : {}}
              className={`p-3 rounded-full transition-all ${
                currentPage === 1 
                  ? 'text-gray-300 cursor-not-allowed bg-gray-100' 
                  : 'text-white hover:shadow-glow'
              }`}
              style={currentPage !== 1 ? { background: 'linear-gradient(to right, #0F1520, #1a2332)' } : {}}
              aria-label="Previous page"
            >
              <FaChevronLeft />
            </motion.button>
            
            <div className="flex space-x-2">
              {getPageNumbers().map(number => (
                <motion.button
                  key={number}
                  onClick={() => updateSearchParams({ page: number.toString() })}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-10 h-10 rounded-full font-medium transition-all ${
                    currentPage === number
                      ? 'text-white shadow-glow'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                  style={currentPage === number ? { background: 'linear-gradient(to right, #0F1520, #1a2332)' } : {}}
                >
                  {number}
                </motion.button>
              ))}
            </div>
            
            <motion.button
              onClick={() => updateSearchParams({ page: (currentPage + 1).toString() })}
              disabled={currentPage === totalPages}
              whileHover={currentPage !== totalPages ? { scale: 1.1 } : {}}
              whileTap={currentPage !== totalPages ? { scale: 0.9 } : {}}
              className={`p-3 rounded-full transition-all ${
                currentPage === totalPages 
                  ? 'text-gray-300 cursor-not-allowed bg-gray-100' 
                  : 'text-white hover:shadow-glow'
              }`}
              style={currentPage !== totalPages ? { background: 'linear-gradient(to right, #0F1520, #1a2332)' } : {}}
              aria-label="Next page"
            >
              <FaChevronRight />
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default HomePage