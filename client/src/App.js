import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import CreateForm from './components/forms/CreateForm';
import FormPreview from './components/forms/FormPreview';
import FormResponses from './components/forms/FormResponses';
import FormAnalytics from './components/forms/FormAnalytics';
import NotFound from './components/layout/NotFound';
import Alert from './components/layout/Alert';

// Contexts
import AuthState from './context/AuthState';
import AlertState from './context/AlertState';

function App() {
  return (
    <AuthState>
      <AlertState>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Alert />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/create-form" element={<CreateForm />} />
                <Route path="/form/:id" element={<FormPreview />} />
                <Route path="/form/:id/responses" element={<FormResponses />} />
                <Route path="/form/:id/analytics" element={<FormAnalytics />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AlertState>
    </AuthState>
  );
}

export default App;
