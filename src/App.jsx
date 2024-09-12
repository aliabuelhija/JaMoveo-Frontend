// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { WebSocketProvider } from './WebSocketProvider';
import PlayerMainPage from './pages/PlayerMainPage';
import AdminMainPage from './pages/AdminMainPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import ResultsPage from './pages/ResultsPage';
import LivePage from './pages/LivePage';

function App() {
  return (
    <WebSocketProvider>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/player" element={<PlayerMainPage />} />
        <Route path="/admin" element={<AdminMainPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/live" element={<LivePage />} />
      </Routes>
    </WebSocketProvider>
  );
}

export default App;
