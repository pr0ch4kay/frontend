import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Стейты для модалки верификации
  const [showVerify, setShowVerify] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState('');
  const [currentCode, setCurrentCode] = useState(''); // <-- АВТОМАТИЧЕСКИЙ КОД

  // Стейты для модалки записи (ВЕРНУЛ ИЗ СТАРОГО КОДА)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const API_URL = 'https://pure-backend-pz7z.onrender.com';

  // 1. Загрузка пользователя при обновлении страницы
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${API_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => {
          if (res.ok) return res.json();
          else {
            localStorage.removeItem('token');
            return null;
          }
        })
        .then(data => {
          if (data && data.user) {
            setUser(data.user);
            fetchBookings(token);
          }
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

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
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.msg || 'Ошибка регистрации');
    }
    
    setVerifyEmail(email);
    // 💥 Забираем код из ответа бэка и кладём в стейт
    setCurrentCode(data.testCode || '');
    setShowVerify(true);
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
    setCurrentCode(''); // Очищаем код после входа
  };

  // === ПОВТОРНАЯ ОТПРАВКА ===
  const resendCode = async () => {
    console.log('Запрос на повторную отправку кода на:', verifyEmail);
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
      setShowVerify,
      currentCode, // <--- КОД ДЛЯ АВТО-ВЕРИФИКАЦИИ
      
      // ВОЗВРАЩАЕМ МОДАЛКУ ЗАПИСИ
      isBookingModalOpen,
      setIsBookingModalOpen
    }}>
      {children}
    </AuthContext.Provider>
  );
};