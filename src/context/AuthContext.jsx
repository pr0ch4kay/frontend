import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // verify modal state
  const [showVerify, setShowVerify] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const res = await fetch('https://pure-backend-pz7z.onrender.com/api/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        await fetchBookings(token);
      } else {
        localStorage.removeItem('token');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async (token) => {
    const res = await fetch('https://pure-backend-pz7z.onrender.com/api/bookings', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (res.ok) {
      const data = await res.json();
      setBookings(data);
    }
  };

  // =========================
  // REGISTER 
  // =========================
  const register = async (email, password, name) => {
  const res = await fetch('https://pure-backend-pz7z.onrender.com/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message);
  }

  const data = await res.json();

  // ❗ важно: НЕ логиним сразу
  return true;
};

  // =========================
  // VERIFY EMAIL
  // =========================
  const verifyEmail = async (code) => {
    const res = await fetch('https://pure-backend-pz7z.onrender.com/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message);
    }

    const data = await res.json();

    // login after verify
    localStorage.setItem('token', data.token);

    setUser(data.user);
    setShowVerify(false);

    await fetchBookings(data.token);

    return true;
  };

  const login = async (email, password) => {
    const res = await fetch('https://pure-backend-pz7z.onrender.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message);
    }

    const data = await res.json();

    localStorage.setItem('token', data.token);
    setUser(data.user);

    await fetchBookings(data.token);

    return true;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setBookings([]);
  };

  const addBooking = async (bookingData) => {
    const token = localStorage.getItem('token');

    const res = await fetch('https://pure-backend-pz7z.onrender.com/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bookingData)
    });

    if (res.ok) {
      const newBooking = await res.json();
      setBookings(prev => [...prev, newBooking]);
    } else {
      throw new Error('Не удалось создать запись');
    }
  };

  const cancelBooking = async (id) => {
    const token = localStorage.getItem('token');

    const res = await fetch(`https://pure-backend-pz7z.onrender.com/api/bookings/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (res.ok) {
      setBookings(prev => prev.filter(b => b.id !== id));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        register,
        login,
        logout,
        bookings,
        addBooking,
        cancelBooking,
        loading,

        // ✅ NEW EXPORTS
        showVerify,
        setShowVerify,
        verifyEmail
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};