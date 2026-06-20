import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Стейты для верификации
  const [showVerify, setShowVerify] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState('');

  // Базовый URL бэкенда
  const API_URL = 'https://pure-backend-pz7z.onrender.com';

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
      await fetchBookings(token);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async (token) => {
    const res = await fetch(`${API_URL}/api/bookings`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      setBookings(data);
    }
  };

  // === РЕГИСТРАЦИЯ ===
 const register = async (email, password, name) => {
  try {
    const res = await fetch('https://pure-backend-pz7z.onrender.com/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    // Сначала пытаемся прочитать JSON из ответа (даже если 502)
    const data = await res.json();

    // Если сервер ответил ошибкой (502 или 400)
    if (!res.ok) {
      // Выбрасываем ошибку с текстом от бэкенда
      throw new Error(data.msg || data.message || `Ошибка сервера (${res.status})`);
    }

    // Если всё ок - открываем модалку
    setVerifyEmail(email);
    setShowVerify(true);

  } catch (err) {
    // Пробрасываем ошибку в Register.jsx
    throw err;
  }
};

  // === ПОДТВЕРЖДЕНИЕ КОДА ===
  const verify = async (code) => {
    const res = await fetch(`${API_URL}/api/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: verifyEmail, code })
    });
    
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.msg || 'Неверный код');
    }
    
    localStorage.setItem('token', data.token);
    setUser(data.user);
    await fetchBookings(data.token);
    setShowVerify(false);
    setVerifyEmail('');
  };

  // === ПОВТОРНАЯ ОТПРАВКА КОДА ===
  const resendCode = async () => {
    // Можно вызвать эндпоинт /api/auth/resend, если он есть на бэке
    console.log('Повторная отправка кода на:', verifyEmail);
  };

  // === ЛОГИН ===
  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.msg || 'Ошибка входа');
    }
    
    localStorage.setItem('token', data.token);
    setUser(data.user);
    await fetchBookings(data.token);
    return true;
  };

  // === ВЫХОД ===
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setBookings([]);
  };

  // === БРОНИРОВАНИЕ ===
  const addBooking = async (bookingData) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/api/bookings`, {
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
    const res = await fetch(`${API_URL}/api/bookings/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      setBookings(prev => prev.filter(b => b.id !== id));
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      register, 
      login, 
      logout, 
      bookings, 
      addBooking, 
      cancelBooking, 
      loading,
      showVerify,
      verifyEmail,
      verify,
      resendCode,
      setShowVerify
    }}>
      {children}
    </AuthContext.Provider>
  );
};