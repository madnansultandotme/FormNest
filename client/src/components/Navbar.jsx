import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { FileText } from 'lucide-react'
import AuthContext from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useContext(AuthContext)

  return (
    <nav className="bg-card shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <FileText className="w-6 h-6" />
            FormNest
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-text-muted hover:text-text-primary text-sm font-medium">Dashboard</Link>
                <Link to="/create-form" className="text-text-muted hover:text-text-primary text-sm font-medium">Create Form</Link>
                <button onClick={logout} className="px-4 py-2 text-sm font-medium text-text-muted border border-border rounded-lg hover:bg-accent">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-text-muted hover:text-text-primary text-sm font-medium">Login</Link>
                <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
