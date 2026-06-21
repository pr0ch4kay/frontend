import { useAuth } from '../context/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function AdminPanel() {
  const { user, logout, bookings, cancelBooking } = useAuth();

  // Если не авторизован или не админ — кидаем на главную
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Принудительно запрашиваем свежие данные при загрузке страницы
  useEffect(() => {
    // Функция загрузки данных уже есть в AuthContext, 
    // но мы можем вызвать её явно, если нужно.
  }, []);

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="container">
          <div className="profile-nav">
            <Link to="/" className="profile-home-btn">← На главную</Link>
            <button onClick={logout} className="profile-logout-btn">Выйти</button>
          </div>
        </div>
      </div>

      <div className="container profile-content">
        <div className="profile-welcome-card">
          <div className="profile-avatar">A</div>
          <div className="profile-welcome-text">
            <h2>Админ-панель</h2>
            <p>Добро пожаловать, {user.name}!</p>
          </div>
        </div>

        <div className="profile-section">
          <h3 className="profile-section-title">Все записи</h3>
          {bookings.length === 0 ? (
            <div className="empty-bookings">
              <p>Пока нет записей</p>
            </div>
          ) : (
            <div className="bookings-grid">
              {bookings.map(booking => (
                <div className="booking-card" key={booking.id}>
                  <div className="booking-card-header">
                    <i className="fas fa-calendar-alt"></i>
                    <span className="booking-date">{booking.date}</span>
                    <span className="booking-time">{booking.time}</span>
                  </div>
                  <div className="booking-master">
                    <i className="fas fa-user"></i> {booking.master}
                  </div>
                  <div className="booking-service">
                    <i className="fas fa-spa"></i> Услуга: {booking.service || 'Косметология'}
                  </div>
                  <div className="booking-client">
                    <i className="fas fa-user-circle"></i> Клиент: {booking.name}
                  </div>
                  <button className="btn-cancel" onClick={() => cancelBooking(booking.id)}>
                    Удалить запись
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}