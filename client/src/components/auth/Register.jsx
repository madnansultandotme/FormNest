import { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'
import AlertContext from '../../context/AlertContext'

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', password2: '' })
  const [loading, setLoading] = useState(false)
  const { register } = useContext(AuthContext)
  const { setAlert } = useContext(AlertContext)
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) return setAlert('Please fill all fields', 'error')
    if (form.password !== form.password2) return setAlert('Passwords do not match', 'error')
    if (form.password.length < 6) return setAlert('Password must be at least 6 characters', 'error')
    setLoading(true)
    const result = await register(form.name, form.email, form.password)
    if (result.success) {
      setAlert('Registration successful!', 'success')
      navigate('/dashboard')
    } else {
      setAlert(result.message, 'error')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Create Account</h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required minLength="6" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input type="password" value={form.password2} onChange={(e) => setForm({...form, password2: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required minLength="6" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">{loading ? 'Creating...' : 'Sign Up'}</button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">Already have an account? <Link to="/login" className="text-blue-600 hover:underline font-medium">Login</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Register
