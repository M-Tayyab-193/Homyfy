import { Link } from 'react-router-dom'
import { FaGlobe, FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa'

function Footer() {
  return (
    <footer className="bg-white mt-8">
      <div className="container-custom py-8">
        <div className="pt-4 border-t border-gray-200 flex flex-col md:flex-row md:justify-between md:items-center">
          
          {/* Left section: Language and currency */}
          <div className="flex items-center space-x-1 mb-4 md:mb-0">
            <span className="text-sm font-medium mr-4">English (US)</span>
            <span className="text-sm font-medium">PKR - Rs.</span>
          </div>

          {/* Right section: Social icons */}
          <div className="flex items-center space-x-3 justify-end">
            <p>Socials: </p>
            <FaFacebookF className="text-airbnb-dark hover:text-airbnb-primary cursor-pointer" />
            <FaTwitter className="text-airbnb-dark hover:text-airbnb-primary cursor-pointer" />
            <FaInstagram className="text-airbnb-dark hover:text-airbnb-primary cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>

  )
}

export default Footer