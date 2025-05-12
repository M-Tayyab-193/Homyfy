import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useListings } from '../contexts/ListingsContext'
import ListingGrid from '../components/listings/ListingGrid'
import PropertyFilters from '../components/listings/PropertyFilters'
import Hero from '../components/ui/Hero'
import { useMemo } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

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

  useEffect(() => {
    document.title = 'Airbnb Clone | Vacation rentals, cabins, beach houses & more'
  }, [])
  
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
      <div className="container-custom pb-12">
        <PropertyFilters 
          activeFilter={activeFilter}
          currentSort={sortType}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onFilterChange={handleFilterChange}
          onPriceChange={handlePriceChange}
          onSortChange={handleSortChange}
        />
        
        <ListingGrid 
          listings={Array.isArray(currentListings) ? currentListings : []} 
          loading={loading} 
        />

        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 space-x-2">
            <button
              onClick={() => updateSearchParams({ page: (currentPage - 1).toString() })}
              disabled={currentPage === 1}
              className={`p-2 rounded-full ${
                currentPage === 1 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-airbnb-dark hover:bg-gray-100'
              }`}
              aria-label="Previous page"
            >
              <FaChevronLeft />
            </button>
            
            {getPageNumbers().map(number => (
              <button
                key={number}
                onClick={() => updateSearchParams({ page: number.toString() })}
                className={`w-8 h-8 rounded-full ${
                  currentPage === number
                    ? 'bg-airbnb-primary text-white'
                    : 'text-airbnb-dark hover:bg-gray-100'
                }`}
              >
                {number}
              </button>
            ))}
            
            <button
              onClick={() => updateSearchParams({ page: (currentPage + 1).toString() })}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-full ${
                currentPage === totalPages 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-airbnb-dark hover:bg-gray-100'
              }`}
              aria-label="Next page"
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage