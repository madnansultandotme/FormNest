import { useReducer, useEffect } from 'react'
import axios from 'axios'
import AuthContext from './AuthContext'

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null
}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'USER_LOADED':
      return { ...state, isAuthenticated: true, loading: false, user: action.payload }
    case 'AUTH_SUCCESS':
      localStorage.setItem('token', action.payload.token)
      return { ...state, token: action.payload.token, user: action.payload.user, isAuthenticated: true, loading: false }
    case 'AUTH_ERROR':
    case 'LOGOUT':
      localStorage.removeItem('token')
      return { ...state, token: null, isAuthenticated: false, loading: false, user: null }
    default:
      return state
  }
}

const AuthState = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const res = await axios.get('/api/auth/me', { headers: { 'x-auth-token': token } })
        dispatch({ type: 'USER_LOADED', payload: res.data })
      } catch {
        dispatch({ type: 'AUTH_ERROR' })
      }
    } else {
      dispatch({ type: 'AUTH_ERROR' })
    }
  }

  const register = async (name, email, password) => {
    try {
      const res = await axios.post('/api/auth/register', { name, email, password })
      dispatch({ type: 'AUTH_SUCCESS', payload: res.data })
      return { success: true }
    } catch (err) {
      dispatch({ type: 'AUTH_ERROR' })
      return { success: false, message: err.response?.data?.msg || 'Registration failed' }
    }
  }

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password })
      dispatch({ type: 'AUTH_SUCCESS', payload: res.data })
      return { success: true }
    } catch (err) {
      dispatch({ type: 'AUTH_ERROR' })
      return { success: false, message: err.response?.data?.msg || 'Login failed' }
    }
  }

  const logout = () => dispatch({ type: 'LOGOUT' })

  return (
    <AuthContext.Provider value={{ ...state, register, login, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthState
