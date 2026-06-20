import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import VerifyModal from "./pages/VerifyModal";

function AppInner() {
  const { showVerify, setShowVerify, verifyEmail, verify } = useAuth();

  return (
    <>
      <VerifyModal
        isOpen={showVerify}
        email={verifyEmail}
        onClose={() => setShowVerify(false)}
        onVerify={verify}
        onResend={() => {}}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
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
