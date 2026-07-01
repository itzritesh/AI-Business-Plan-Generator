import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';

// Layouts
import DashboardLayout from './layouts/DashboardLayout.jsx';

// Pages
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import BusinessPlan from './pages/BusinessPlan.jsx';
import MarketResearch from './pages/MarketResearch.jsx';
import FinancialModel from './pages/FinancialModel.jsx';
import PitchDeck from './pages/PitchDeck.jsx';
import StartupCoach from './pages/StartupCoach.jsx';
import Validation from './pages/Validation.jsx';
import Profile from './pages/Profile.jsx';

// Main stylesheet
import './styles/theme.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected SaaS routes wrapped in layout validation checks */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/business-plan" element={<BusinessPlan />} />
              <Route path="/market-research" element={<MarketResearch />} />
              <Route path="/financial-model" element={<FinancialModel />} />
              <Route path="/pitch-deck" element={<PitchDeck />} />
              <Route path="/startup-coach" element={<StartupCoach />} />
              <Route path="/validation" element={<Validation />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Fallback routing */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
