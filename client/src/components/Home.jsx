import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { PenLine, BarChart3, Link2 } from 'lucide-react'
import AuthContext from '../context/AuthContext'

const Home = () => {
  const { user } = useContext(AuthContext)

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-text-primary mb-4">Create Beautiful Forms</h1>
        <p className="text-xl text-text-muted mb-8">Build stunning forms with our easy-to-use form builder</p>
        {!user ? (
          <div className="flex justify-center gap-4">
            <Link to="/register" className="px-6 py-3 text-lg font-medium text-white bg-primary rounded-lg hover:bg-primary-hover">Get Started Free</Link>
            <Link to="/login" className="px-6 py-3 text-lg font-medium text-text-primary bg-card border border-border rounded-lg hover:bg-accent">Login</Link>
          </div>
        ) : (
          <div className="flex justify-center gap-4">
            <Link to="/dashboard" className="px-6 py-3 text-lg font-medium text-white bg-primary rounded-lg hover:bg-primary-hover">Dashboard</Link>
            <Link to="/create-form" className="px-6 py-3 text-lg font-medium text-text-primary bg-card border border-border rounded-lg hover:bg-accent">Create Form</Link>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-3">
            <PenLine className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">Easy Builder</h3>
          <p className="text-text-muted">Create forms with an intuitive interface. No coding required!</p>
        </div>
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-3">
            <BarChart3 className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">Analytics</h3>
          <p className="text-text-muted">Get instant insights from your form responses.</p>
        </div>
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-3">
            <Link2 className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">Easy Sharing</h3>
          <p className="text-text-muted">Share your forms via links or embed them.</p>
        </div>
      </div>
    </div>
  )
}

export default Home
