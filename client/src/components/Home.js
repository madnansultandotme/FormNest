import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Create Beautiful Forms
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Build stunning forms with our easy-to-use form builder
        </p>
        
        {!user ? (
          <div className="flex justify-center gap-4">
            <Link 
              to="/register" 
              className="px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started - It's Free
            </Link>
            <Link 
              to="/login" 
              className="px-6 py-3 text-lg font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Login
            </Link>
          </div>
        ) : (
          <div className="flex justify-center gap-4">
            <Link 
              to="/dashboard" 
              className="px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </Link>
            <Link 
              to="/create-form" 
              className="px-6 py-3 text-lg font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Create New Form
            </Link>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="text-3xl mb-3">✏️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Builder</h3>
          <p className="text-gray-600">Create forms with an intuitive interface. No coding required!</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="text-3xl mb-3">📊</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Analytics</h3>
          <p className="text-gray-600">Get instant insights from your form responses with charts.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="text-3xl mb-3">🔗</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Sharing</h3>
          <p className="text-gray-600">Share your forms via links or embed them in websites.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
