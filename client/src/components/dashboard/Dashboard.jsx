import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, Plus, Eye, BarChart2, Pencil, Trash2 } from 'lucide-react'
import AuthContext from '../../context/AuthContext'
import AlertContext from '../../context/AlertContext'
import axios from 'axios'

const Dashboard = () => {
  const { user, loading: authLoading, isAuthenticated } = useContext(AuthContext)
  const { setAlert } = useContext(AlertContext)
  const [forms, setForms] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return setLoading(false)
        const res = await axios.get('/api/forms', { headers: { 'x-auth-token': token } })
        setForms(res.data)
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }
    if (!authLoading && isAuthenticated) fetchForms()
    else if (!authLoading) setLoading(false)
  }, [authLoading, isAuthenticated])

  const handleDelete = async (formId, formTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${formTitle}"? This action cannot be undone.`)) return
    
    setDeleting(formId)
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`/api/forms/${formId}`, { headers: { 'x-auth-token': token } })
      setForms(forms.filter(f => f._id !== formId))
      setAlert('Form deleted successfully', 'success')
    } catch (err) {
      setAlert(err.response?.data?.msg || 'Failed to delete form', 'error')
    }
    setDeleting(null)
  }

  if (authLoading || loading) return <div className="flex items-center justify-center min-h-[400px] text-text-muted">Loading...</div>
  if (!isAuthenticated) return <div className="text-center py-16"><p className="text-text-muted">Please <Link to="/login" className="text-primary hover:underline">login</Link> to view your dashboard.</p></div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-text-muted">Welcome back, {user?.name}</p>
        </div>
        <Link to="/create-form" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover">
          <Plus className="w-4 h-4" />
          Create Form
        </Link>
      </div>
      {forms.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">No forms yet</h3>
          <p className="text-text-muted mb-6">Get started by creating your first form</p>
          <Link to="/create-form" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover">
            <Plus className="w-4 h-4" />
            Create Form
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map(form => (
            <div key={form._id} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-text-primary flex-1 truncate">{form.title}</h3>
                <div className="flex items-center gap-1 ml-2">
                  <Link to={`/edit-form/${form._id}`} className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-primary hover:bg-accent rounded-lg" title="Edit form">
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button 
                    onClick={() => handleDelete(form._id, form.title)} 
                    disabled={deleting === form._id}
                    className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50" 
                    title="Delete form"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-text-muted mb-4 line-clamp-2">{form.description || 'No description'}</p>
              <div className="flex justify-between text-xs text-text-muted mb-4">
                <span>{form.responsesCount || 0} responses</span>
                <span>{form.fields?.length || 0} fields</span>
              </div>
              <div className="flex gap-2">
                <Link to={`/form/${form._id}`} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-text-muted border border-border rounded-lg hover:bg-accent">
                  <Eye className="w-3.5 h-3.5" />
                  Preview
                </Link>
                <Link to={`/form/${form._id}/responses`} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-text-muted border border-border rounded-lg hover:bg-accent">
                  <BarChart2 className="w-3.5 h-3.5" />
                  Responses
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard
