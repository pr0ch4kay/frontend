import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Verify from './pages/Verify';
import Profile from './pages/Profile';

import VerifyModal from './components/VerifyModal'; // ✅ NEW

import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>

        {/* ✅ GLOBAL VERIFY POPUP */}
        <VerifyModal />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/verify" element={<Verify />} />
        </Routes>

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;