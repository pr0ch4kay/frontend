import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import VerifyModal from './pages/VerifyModal';
import { createPortal } from 'react-dom'; 
import { useState } from 'react'; // <--- ЭТО ВАЖНО!
import { Link } from 'react-router-dom';
import './App.css';

function AppInner() {
  const { 
    user, 
    showVerify, 
    setShowVerify, 
    verifyEmail, 
    verify, 
    resendCode,
    isBookingModalOpen,
    setIsBookingModalOpen,
    addBooking, 
    logout 
  } = useAuth();

  // Стейты для формы записи (перенесены из Home.jsx)
  const [bookingData, setBookingData] = useState({ master: '', time: '', service: 'Косметология' });
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');

  // Список мастеров (чтобы модалка могла их использовать)
  const mastersList = [
    { name: 'Анна Вольская', role: 'Косметолог-эстетист', exp: '12 лет опыта', img: 'https://randomuser.me/api/portraits/women/68.jpg', special: 'Лицо, инъекции' },
    { name: 'Екатерина Ли', role: 'Топ-стилист', exp: '9 лет, эксперт', img: 'https://randomuser.me/api/portraits/women/44.jpg', special: 'Окрашивание, стрижки' },
    { name: 'Мария Теплова', role: 'Визажист', exp: 'Международные сертификаты', img: 'https://randomuser.me/api/portraits/women/90.jpg', special: 'Свадебный макияж' },
    { name: 'Дмитрий Кравцов', role: 'Мастер маникюра', exp: '7 лет', img: 'https://randomuser.me/api/portraits/men/32.jpg', special: 'Дизайн, укрепление' },
    { name: 'Ольга Смирнова', role: 'Специалист по лазерной эпиляции', exp: '5 лет', img: 'https://randomuser.me/api/portraits/women/33.jpg', special: 'Все зоны' },
    { name: 'Ирина Мельник', role: 'Косметолог-эстетист', exp: '10 лет', img: 'https://randomuser.me/api/portraits/women/45.jpg', special: 'Уходовые процедуры' }
  ];

  // Список услуг (чтобы модалка могла их использовать)
  const services = [
    { title: 'Косметология' },
    { title: 'Волосы' },
    { title: 'Makeup' },
    { title: 'Лазерная эпиляция' },
    { title: 'Маникюр' },
    { title: 'Педикюр' }
  ];

  // Обработчик записи (перенесён из Home.jsx)
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Пожалуйста, войдите или зарегистрируйтесь для записи');
      return;
    }
    setProgress(10);
    try {
      await addBooking({
        master: bookingData.master,
        time: bookingData.time,
        name: user.name,
        phone: '',
        date: new Date().toLocaleDateString(),
        service: bookingData.service
      });
      setProgress(100);
      setStatus('✅ Вы записаны! Подтверждение в личном кабинете.');
      setTimeout(() => {
        setProgress(0);
        setStatus('');
        setIsBookingModalOpen(false);
        setBookingData({ master: '', time: '', service: 'Косметология' });
      }, 1500);
    } catch (err) {
      setStatus('❌ Ошибка при записи');
    }
  };

  return (
    <>
      {/* Модалка подтверждения почты */}
      <VerifyModal
        isOpen={showVerify}
        email={verifyEmail}
        onClose={() => setShowVerify(false)}
        onVerify={verify}
        onResend={resendCode}
      />

      {/* Глобальная модалка записи на услугу */}
      {isBookingModalOpen && createPortal(
        <div className="modal-overlay" onClick={() => setIsBookingModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-modal" onClick={() => setIsBookingModalOpen(false)}>&times;</span>
            <h3 style={{ fontSize: 32, marginBottom: 20 }}>Запись на услугу</h3>
            {user ? (
              <>
                <p style={{ marginBottom: 20 }}>Вы записываетесь как <strong>{user.name}</strong></p>
                <form onSubmit={handleBookingSubmit}>
                  <select value={bookingData.master} onChange={e => setBookingData({...bookingData, master: e.target.value})} required style={{ width: '100%', padding: 12, marginBottom: 15, borderRadius: 40 }}>
                    <option value="">Выберите мастера</option>
                    {mastersList.map(m => <option key={m.name}>{m.name}</option>)}
                  </select>
                  <select value={bookingData.service} onChange={e => setBookingData({...bookingData, service: e.target.value})} required style={{ width: '100%', padding: 12, marginBottom: 15, borderRadius: 40 }}>
                    {services.map(s => <option key={s.title}>{s.title}</option>)}
                  </select>
                  <select value={bookingData.time} onChange={e => setBookingData({...bookingData, time: e.target.value})} required style={{ width: '100%', padding: 12, marginBottom: 20, borderRadius: 40 }}>
                    <option value="">Выберите время</option>
                    <option>10:00</option><option>12:00</option><option>14:00</option><option>16:00</option><option>18:00</option>
                  </select>
                  <button type="submit" className="btn-solid" style={{ width: '100%' }}>Записаться</button>
                </form>
                {progress > 0 && <div className="progress-bar" style={{ marginTop: 15 }}><div className="progress-fill" style={{ width: `${progress}%`, height: 6, background: '#D4AF7A', borderRadius: 6 }}></div></div>}
                {status && <p style={{ marginTop: 15, color: status.includes('✅') ? '#D4AF7A' : '#d9534f' }}>{status}</p>}
              </>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <p style={{ marginBottom: '24px' }}>Для записи необходимо войти в аккаунт.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                  <Link to="/login" className="btn-solid" style={{ width: '100%', maxWidth: '280px' }}>Войти</Link>
                  <div style={{ fontSize: '14px', color: '#7A6E62' }}>или</div>
                  <Link to="/register" className="btn-gold" style={{ width: '100%', maxWidth: '280px' }}>Зарегистрироваться</Link>
                </div>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

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