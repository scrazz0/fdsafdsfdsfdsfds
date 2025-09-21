import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, LocalizationProvider } from './contexts';
import Layout from './components/Layout';
import HomePage from './components/HomePage';
import PropertiesPage from './components/PropertiesPage';
import AuthPage from './components/AuthPage';
import DashboardPage from './components/DashboardPage';
import StaticPages from './components/StaticPages';
import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:3000');

function App() {
  return (
    <ThemeProvider>
      <LocalizationProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage socket={socket} />} />
              <Route path="properties" element={<PropertiesPage socket={socket} />} />
              {/* For simplicity, PropertyDetailPage is part of PropertiesPage logic */}
              <Route path="how-it-works" element={<StaticPages page="how-it-works" />} />
              <Route path="about" element={<StaticPages page="about" />} />
            </Route>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/dashboard/*" element={<DashboardPage socket={socket} />} />
          </Routes>
        </HashRouter>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;