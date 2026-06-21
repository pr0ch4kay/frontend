import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user, logout, bookings, cancelBooking, setIsBookingModalOpen } = useAuth();

  // Если пользователь не авторизован – показываем красивую карточку с предложением войти
  if (!user) {
    return (
      <div className="profile-guest-page">
        <div className="profile-guest-overlay"></div>
        <div className="profile-guest-card">
          <div className="guest-icon">✨</div>
          <h2>Личный кабинет</h2>
          <p>Войдите или зарегистрируйтесь, чтобы видеть свои записи, накапливать бонусы и получать персональные скидки.</p>
          <div className="guest-buttons">
            <Link to="/login" className="btn-solid">Войти</Link>
            <Link to="/register" className="btn-gold">Зарегистрироваться</Link>
          </div>
          <Link to="/" className="guest-back">← На главную</Link>
        </div>
      </div>
    );
  }

  // Для авторизованного пользователя
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
          <div className="profile-avatar">{user.name ? user.name.charAt(0).toUpperCase() : '?'}</div>
          <div className="profile-welcome-text">
            <h2>Добро пожаловать, <span>{user.name || 'Гость'}!</span></h2>
            <p>Ваша персонализированная зона красоты</p>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-number">{bookings.length}</span>
            <span className="stat-label">активных записей</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">✨</span>
            <span className="stat-label">бонусов: 1500</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">🏆</span>
            <span className="stat-label">уровень: Gold</span>
          </div>
        </div>

        <div className="profile-section">
          <h3 className="profile-section-title">Ваши записи</h3>
          {bookings.length === 0 ? (
            <div className="empty-bookings">
              <p>У вас пока нет записей</p>
              <button 
                className="btn-solid" 
                onClick={() => setIsBookingModalOpen(true)}
              >
                Записаться сейчас
              </button>
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
                  <button className="btn-cancel" onClick={() => cancelBooking(booking.id)}>
                    Отменить запись
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