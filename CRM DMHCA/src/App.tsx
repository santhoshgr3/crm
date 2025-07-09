import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CRMProvider } from './context/CRMContext';
import Layout from './components/Layout/Layout';
import LoginForm from './components/Auth/LoginForm';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import KanbanBoard from './components/Kanban/KanbanBoard';
import Courses from './pages/Courses';
import Counselors from './pages/Counselors';
import Analytics from './pages/Analytics';
import WhatsAppIntegration from './components/WhatsApp/WhatsAppIntegration';
import Settings from './pages/Settings';
import SalesReport from './pages/SalesReport';
import HospitalsPage from './pages/Hospitals'; // Import the new HospitalsPage component
import Followups from './pages/Followups'; // Import the Followups component
import './i18n';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    // Supabase removed. Use context or REST API for authentication if needed.

    setLoading(false);
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <LoginForm onLogin={handleLogin} />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <CRMProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout onLogout={handleLogout} />}>
            <Route index element={<Dashboard />} />
            <Route path="leads" element={<Leads />} />
            <Route path="kanban" element={<KanbanBoard />} />
            <Route path="courses" element={<Courses />} />
            <Route path="whatsapp" element={<WhatsAppIntegration />} />
            <Route path="counselors" element={<Counselors />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="followups" element={<Followups />} /> {/* Use the actual Followups component here */}
            <Route path="settings" element={<Settings />} />
            <Route path="sales-report" element={<SalesReport />} />
            <Route path="hospitals" element={<HospitalsPage />} /> {/* Add the new route here */}
          </Route>
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </CRMProvider>
  );
}

export default App;