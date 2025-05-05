import { Link } from 'react-router-dom'
import { FaGlobe, FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa'

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-8">
      <div className="container-custom py-8">
        {/* Footer Links - Desktop */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-sm mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link to="/help" className="text-sm text-airbnb-dark hover:underline">Help Center</Link></li>
              <li><Link to="/aircover" className="text-sm text-airbnb-dark hover:underline">AirCover</Link></li>
              <li><Link to="/safety" className="text-sm text-airbnb-dark hover:underline">Safety information</Link></li>
              <li><Link to="/accessibility" className="text-sm text-airbnb-dark hover:underline">Accessibility</Link></li>
              <li><Link to="/cancellation-options" className="text-sm text-airbnb-dark hover:underline">Cancellation options</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-sm mb-4">Community</h3>
            <ul className="space-y-3">
              <li><Link to="/disaster-relief" className="text-sm text-airbnb-dark hover:underline">Disaster relief</Link></li>
              <li><Link to="/combating-discrimination" className="text-sm text-airbnb-dark hover:underline">Combating discrimination</Link></li>
              <li><Link to="/referrals" className="text-sm text-airbnb-dark hover:underline">Refer a host</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-sm mb-4">Hosting</h3>
            <ul className="space-y-3">
              <li><Link to="/become-a-host" className="text-sm text-airbnb-dark hover:underline">Become a Host</Link></li>
              <li><Link to="/aircover-for-hosts" className="text-sm text-airbnb-dark hover:underline">AirCover for Hosts</Link></li>
              <li><Link to="/hosting-resources" className="text-sm text-airbnb-dark hover:underline">Hosting resources</Link></li>
              <li><Link to="/community-forum" className="text-sm text-airbnb-dark hover:underline">Community forum</Link></li>
              <li><Link to="/responsible-hosting" className="text-sm text-airbnb-dark hover:underline">Responsible hosting</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-sm mb-4">Airbnb</h3>
            <ul className="space-y-3">
              <li><Link to="/newsroom" className="text-sm text-airbnb-dark hover:underline">Newsroom</Link></li>
              <li><Link to="/features" className="text-sm text-airbnb-dark hover:underline">New features</Link></li>
              <li><Link to="/careers" className="text-sm text-airbnb-dark hover:underline">Careers</Link></li>
              <li><Link to="/investors" className="text-sm text-airbnb-dark hover:underline">Investors</Link></li>
              <li><Link to="/gift-cards" className="text-sm text-airbnb-dark hover:underline">Gift cards</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Accordion Links - Mobile */}
        <div className="md:hidden space-y-4 mb-8">
          <details className="group">
            <summary className="flex justify-between items-center font-bold text-sm cursor-pointer list-none">
              <span>Support</span>
              <span className="transition group-open:rotate-180">+</span>
            </summary>
            <ul className="mt-3 space-y-3">
              <li><Link to="/help" className="text-sm text-airbnb-dark hover:underline">Help Center</Link></li>
              <li><Link to="/aircover" className="text-sm text-airbnb-dark hover:underline">AirCover</Link></li>
              <li><Link to="/safety" className="text-sm text-airbnb-dark hover:underline">Safety information</Link></li>
              <li><Link to="/cancellation-options" className="text-sm text-airbnb-dark hover:underline">Cancellation options</Link></li>
            </ul>
          </details>
          
          <details className="group">
            <summary className="flex justify-between items-center font-bold text-sm cursor-pointer list-none">
              <span>Community</span>
              <span className="transition group-open:rotate-180">+</span>
            </summary>
            <ul className="mt-3 space-y-3">
              <li><Link to="/disaster-relief" className="text-sm text-airbnb-dark hover:underline">Disaster relief</Link></li>
              <li><Link to="/combating-discrimination" className="text-sm text-airbnb-dark hover:underline">Combating discrimination</Link></li>
            </ul>
          </details>
          
          <details className="group">
            <summary className="flex justify-between items-center font-bold text-sm cursor-pointer list-none">
              <span>Hosting</span>
              <span className="transition group-open:rotate-180">+</span>
            </summary>
            <ul className="mt-3 space-y-3">
              <li><Link to="/become-a-host" className="text-sm text-airbnb-dark hover:underline">Become a Host</Link></li>
              <li><Link to="/hosting-resources" className="text-sm text-airbnb-dark hover:underline">Hosting resources</Link></li>
              <li><Link to="/responsible-hosting" className="text-sm text-airbnb-dark hover:underline">Responsible hosting</Link></li>
            </ul>
          </details>
          
          <details className="group">
            <summary className="flex justify-between items-center font-bold text-sm cursor-pointer list-none">
              <span>Airbnb</span>
              <span className="transition group-open:rotate-180">+</span>
            </summary>
            <ul className="mt-3 space-y-3">
              <li><Link to="/newsroom" className="text-sm text-airbnb-dark hover:underline">Newsroom</Link></li>
              <li><Link to="/careers" className="text-sm text-airbnb-dark hover:underline">Careers</Link></li>
              <li><Link to="/investors" className="text-sm text-airbnb-dark hover:underline">Investors</Link></li>
            </ul>
          </details>
        </div>
        
        {/* Footer Bottom */}
        <div className="pt-4 border-t border-gray-200 flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="flex flex-col md:flex-row md:items-center mb-4 md:mb-0">
            <p className="text-sm text-airbnb-dark">© 2025 Airbnb, Inc.</p>
            <div className="hidden md:flex md:items-center">
              <span className="mx-2">·</span>
              <Link to="/privacy" className="text-sm text-airbnb-dark hover:underline">Privacy</Link>
              <span className="mx-2">·</span>
              <Link to="/terms" className="text-sm text-airbnb-dark hover:underline">Terms</Link>
              <span className="mx-2">·</span>
              <Link to="/sitemap" className="text-sm text-airbnb-dark hover:underline">Sitemap</Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <FaGlobe className="text-airbnb-dark mr-2" />
              <span className="text-sm font-medium">English (US)</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium mr-1">$</span>
              <span className="text-sm font-medium">USD</span>
            </div>
            <div className="flex items-center space-x-3">
              <FaFacebookF className="text-airbnb-dark hover:text-airbnb-primary cursor-pointer" />
              <FaTwitter className="text-airbnb-dark hover:text-airbnb-primary cursor-pointer" />
              <FaInstagram className="text-airbnb-dark hover:text-airbnb-primary cursor-pointer" />
            </div>
          </div>
          
          {/* Mobile-only Privacy and Terms */}
          <div className="md:hidden flex flex-wrap mt-4">
            <Link to="/privacy" className="text-sm text-airbnb-dark hover:underline mr-4">Privacy</Link>
            <Link to="/terms" className="text-sm text-airbnb-dark hover:underline mr-4">Terms</Link>
            <Link to="/sitemap" className="text-sm text-airbnb-dark hover:underline">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer