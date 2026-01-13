import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user, loading: authLoading, isAuthenticated } = useContext(AuthContext);
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }
        const res = await axios.get('/api/forms', {
          headers: { 'x-auth-token': token }
        });
        setForms(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err.response?.data || err.message);
        setLoading(false);
      }
    };

    if (!authLoading && isAuthenticated) {
      fetchForms();
    } else if (!authLoading && !isAuthenticated) {
      setLoading(false);
    }
  }, [authLoading, isAuthenticated]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600">
          Please <Link to="/login" className="text-blue-600 hover:underline">login</Link> to view your dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>
        <Link 
          to="/create-form" 
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          + Create Form
        </Link>
      </div>

      {forms.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No forms yet</h3>
          <p className="text-gray-500 mb-6">Get started by creating your first form</p>
          <Link 
            to="/create-form" 
            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Create Form
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map(form => (
            <div key={form._id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{form.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{form.description || 'No description'}</p>
              
              <div className="flex justify-between text-xs text-gray-400 mb-4">
                <span>{form.responsesCount || 0} responses</span>
                <span>{form.fields?.length || 0} fields</span>
              </div>
              
              <div className="flex gap-2">
                <Link 
                  to={`/form/${form._id}`} 
                  className="flex-1 text-center px-3 py-2 text-xs font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Preview
                </Link>
                <Link 
                  to={`/form/${form._id}/responses`} 
                  className="flex-1 text-center px-3 py-2 text-xs font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Responses
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
