
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [showVerify, setShowVerify] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState("");

  const register = async (email, password) => {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) throw new Error("register failed");

    setVerifyEmail(email);
    setShowVerify(true);
  };

  const verify = async (code) => {
    const res = await fetch("/api/verify", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ email: verifyEmail, code })
    });

    if (!res.ok) throw new Error("verify failed");

    const data = await res.json();

    setToken(data.token);
    localStorage.setItem("token", data.token);
    setUser(data.user);
    setShowVerify(false);
  };

  const login = async (email, password) => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) throw new Error("login failed");

    const data = await res.json();

    setToken(data.token);
    localStorage.setItem("token", data.token);
    setUser(data.user);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      register,
      login,
      verify,
      showVerify,
      setShowVerify,
      verifyEmail
    }}>
      {children}
    </AuthContext.Provider>
  );
}
