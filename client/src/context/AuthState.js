import React, { useReducer, useEffect } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload
      };
    case 'AUTH_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false
      };
    case 'AUTH_ERROR':
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null
      };
    default:
      return state;
  }
};

const AuthState = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const config = {
          headers: { 'x-auth-token': token }
        };
        const res = await axios.get('/api/auth/me', config);
        dispatch({ type: 'USER_LOADED', payload: res.data });
      } catch (err) {
        dispatch({ type: 'AUTH_ERROR' });
      }
    } else {
      dispatch({ type: 'AUTH_ERROR' });
    }
  };

  const register = async (name, email, password) => {
    try {
      const config = {
        headers: { 'Content-Type': 'application/json' }
      };
      const body = JSON.stringify({ name, email, password });
      const res = await axios.post('/api/auth/register', body, config);
      dispatch({ type: 'AUTH_SUCCESS', payload: res.data });
      return { success: true };
    } catch (err) {
      dispatch({ type: 'AUTH_ERROR' });
      return { 
        success: false, 
        message: err.response?.data?.msg || err.response?.data?.errors?.[0]?.msg || 'Registration failed' 
      };
    }
  };

  const login = async (email, password) => {
    try {
      const config = {
        headers: { 'Content-Type': 'application/json' }
      };
      const body = JSON.stringify({ email, password });
      const res = await axios.post('/api/auth/login', body, config);
      dispatch({ type: 'AUTH_SUCCESS', payload: res.data });
      return { success: true };
    } catch (err) {
      dispatch({ type: 'AUTH_ERROR' });
      return { 
        success: false, 
        message: err.response?.data?.msg || err.response?.data?.errors?.[0]?.msg || 'Login failed' 
      };
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        register,
        login,
        logout,
        loadUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthState;
