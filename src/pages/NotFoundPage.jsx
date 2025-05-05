import { Link } from 'react-router-dom'
import { FaHome } from 'react-icons/fa'

function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-airbnb-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page not found</h2>
        <p className="text-airbnb-light mb-8 max-w-md mx-auto">
          We can't seem to find the page you're looking for. The page might have been moved or deleted.
        </p>
        <Link to="/" className="inline-flex items-center btn-primary">
          <FaHome className="mr-2" />
          Return Home
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage