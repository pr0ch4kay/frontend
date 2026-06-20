
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Verify from './pages/Verify';
import Profile from './pages/Profile';
import VerifyModal from './pages/VerifyModal';

import './App.css';

function AppInner() {
  const { showVerify, setShowVerify, verifyEmail } = useAuth();

  return (
    <>
      <VerifyModal
        isOpen={showVerify}
        email={verifyEmail}
        onClose={() => setShowVerify(false)}
        onVerify={verifyEmail}
        onResend={() => {}}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/verify" element={<Verify />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </AuthProvider>
  );
}
