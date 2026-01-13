import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

const NotFound = () => (
  <div className="text-center py-20">
    <h1 className="text-6xl font-bold text-border mb-4">404</h1>
    <h2 className="text-2xl font-semibold text-text-primary mb-4">Page Not Found</h2>
    <p className="text-text-muted mb-8">The page you're looking for doesn't exist.</p>
    <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover">
      <Home className="w-4 h-4" />
      Go Home
    </Link>
  </div>
)

export default NotFound
