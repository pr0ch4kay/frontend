import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Home() {
  const { user, addBooking, logout, setIsBookingModalOpen } = useAuth();
  const [bookingData, setBookingData] = useState({ master: '', time: '', service: 'Косметология' });
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [timeLeft, setTimeLeft] = useState({ days: 7, hours: 0, minutes: 0, seconds: 0 });
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewMaster, setReviewMaster] = useState('');
  const fadeElements = useRef([]);

  // Загрузка отзывов с сервера
  useEffect(() => {
    fetch('https://pure-backend-pz7z.onrender.com/api/reviews')
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error('Ошибка загрузки отзывов', err));
  }, []);

  // Отправка отзыва на сервер
  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Пожалуйста, войдите, чтобы оставить отзыв');
      return;
    }
    if (!reviewText.trim()) return;
    try {
      const res = await fetch('https://pure-backend-pz7z.onrender.com/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          text: reviewText,
          stars: reviewRating,
          master: reviewMaster
        })
      });
      if (!res.ok) throw new Error('Ошибка');
      const newReview = await res.json();
      setReviews(prev => [newReview, ...prev]);
      setIsReviewModalOpen(false);
      setReviewText('');
      setReviewRating(5);
      setReviewMaster('');
    } catch (err) {
      alert('Не удалось отправить отзыв');
    }
  };

  // Анимация появления
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('appear');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    fadeElements.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addToRefs = (el) => {
    if (el && !fadeElements.current.includes(el)) fadeElements.current.push(el);
  };

  // Таймер
  useEffect(() => {
    const promoEnd = Date.now() + 7 * 86400000;
    const interval = setInterval(() => {
      const diff = promoEnd - Date.now();
      if (diff <= 0) clearInterval(interval);
      else {
        setTimeLeft({
          days: Math.floor(diff / 86400000),
          hours: Math.floor((diff % 86400000) / 3600000),
          minutes: Math.floor((diff % 3600000) / 60000),
          seconds: Math.floor((diff % 60000) / 1000)
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Обработчик записи (вызов addBooking из контекста)
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

  const nextTestimonial = () => setCurrentTestimonial((currentTestimonial + 1) % reviews.length);
  const prevTestimonial = () => setCurrentTestimonial((currentTestimonial - 1 + reviews.length) % reviews.length);

  // Список мастеров (6)
  const mastersList = [
    { name: 'Анна Вольская', role: 'Косметолог-эстетист', exp: '12 лет опыта', img: 'https://randomuser.me/api/portraits/women/68.jpg', special: 'Лицо, инъекции' },
    { name: 'Екатерина Ли', role: 'Топ-стилист', exp: '9 лет, эксперт', img: 'https://randomuser.me/api/portraits/women/44.jpg', special: 'Окрашивание, стрижки' },
    { name: 'Мария Теплова', role: 'Визажист', exp: 'Международные сертификаты', img: 'https://randomuser.me/api/portraits/women/90.jpg', special: 'Свадебный макияж' },
    { name: 'Дмитрий Кравцов', role: 'Мастер маникюра', exp: '7 лет', img: 'https://randomuser.me/api/portraits/men/32.jpg', special: 'Дизайн, укрепление' },
    { name: 'Ольга Смирнова', role: 'Специалист по лазерной эпиляции', exp: '5 лет', img: 'https://randomuser.me/api/portraits/women/33.jpg', special: 'Все зоны' },
    { name: 'Ирина Мельник', role: 'Косметолог-эстетист', exp: '10 лет', img: 'https://randomuser.me/api/portraits/women/45.jpg', special: 'Уходовые процедуры' }
  ];

  // Услуги (6)
  const services = [
    { title: 'Косметология', desc: 'Чистка лица, уходовые процедуры, массаж', price: 'от 4500 ₽', duration: '60–90 мин', icon: 'fa-spa', img: 'https://mgm1.ru/upload/cssinliner_webp/iblock/0f1/8wd63vhf554msjgsco46qr7runrwfs2f.webp' },
    { title: 'Волосы', desc: 'Окрашивание, уход, укладки, ботокс', price: 'от 5500 ₽', duration: '120–180 мин', icon: 'fa-cut', img: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600' },
    { title: 'Makeup', desc: 'Вечерний, свадебный, nude makeup', price: 'от 3500 ₽', duration: '60 мин', icon: 'fa-makeup', img: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600' },
    { title: 'Лазерная эпиляция', desc: 'Безболезненно, на любой зоне', price: 'от 1500 ₽', duration: '15–40 мин', icon: 'fa-bolt', img: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600' },
    { title: 'Маникюр', desc: 'Покрытие, дизайн, уход за кутикулой', price: 'от 2000 ₽', duration: '60 мин', icon: 'fa-hand-peace', img: 'https://i.pinimg.com/originals/55/e4/a7/55e4a78078abb129bfffa927a8c88857.jpg?nii=t' },
    { title: 'Педикюр', desc: 'Комплексный уход за ногами', price: 'от 2500 ₽', duration: '70 мин', icon: 'fa-shoe-prints', img: 'https://i.pinimg.com/originals/8b/a8/b5/8ba8b532d7d36885225a26b9463402bd.png?nii=t' }
  ];

  const galleryImages = [
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
    'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800',
    'https://images.unsplash.com/photo-1595475207225-428b62bda831?w=800',
    'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800'
  ];

  const partners = [
    { name: 'LA MER', logo: 'https://images.squarespace-cdn.com/content/v1/546572f1e4b00c5eabbce373/1643992386106-6TYSB1KK0FY8I6YORRCB/brands_lamer.png' },
    { name: 'Sisley', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Sisley_Paris_logo.svg/1280px-Sisley_Paris_logo.svg.png' },
    { name: 'Kerastase', logo: 'https://w7.pngwing.com/pngs/67/452/png-transparent-kerastase-hd-logo.png' },
    { name: 'Dior', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Dior_Logo.svg/960px-Dior_Logo.svg.png' }
  ];

  return (
    <>
      <header>
        <div className="container header-inner">
          <Link to="/" className="logo">Pure<span>Aura</span></Link>
          <div className="nav-links">
            <a href="#services">Услуги</a>
            <a href="#masters">Мастера</a>
            <a href="#gallery">Работы</a>
            <a href="#reviews">Отзывы</a>
            
            {/* Сразу после "Отзывы" идёт проверка пользователя */}
            {user ? (
              <>
                {/* Золотое имя пользователя */}
                <Link to="/profile" style={{ fontWeight: 600, color: '#D4AF7A', textDecoration: 'none', marginRight: '6px' }}>
                  {user.name}
                </Link>
                {/* Кнопка Выйти */}
                <button 
                  onClick={logout} 
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    fontFamily: 'inherit',
                    fontSize: '16px',
                    color: '#2C2826'
                  }}
                >
                  Выйти
                </button>
              </>
            ) : (
              <Link to="/login" style={{ fontSize: '16px', color: '#2C2826', textDecoration: 'none' }}>Войти</Link>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section style={{ position: 'relative', minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <video autoPlay muted loop playsInline style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}>
            <source src="https://player.vimeo.com/external/455311091.sd.mp4?s=0c6c232b2f75dacfed429be652d4d59a7d59b145&profile_id=164" type="video/mp4" />
          </video>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', zIndex: 1 }}></div>
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', color: 'white', maxWidth: 800, padding: '0 20px' }}>
            <h1 style={{ fontSize: '64px', fontWeight: 600, marginBottom: 20, textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>Подчеркнём вашу<br />естественную красоту</h1>
            <p style={{ fontSize: '20px', marginBottom: 30, opacity: 0.9 }}>Премиальный салон с авторским подходом. Ощутите ритуал заботы о себе.</p>
            <button className="btn-solid" onClick={() => setIsBookingModalOpen(true)}>Записаться</button>
          </div>
        </section>

        {/* Преимущества */}
        <section className="section">
          <div className="container">
            <h2 className="section-title fade-up" ref={addToRefs}>Почему выбирают нас</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 30, margin: '60px 0 40px' }}>
              <div className="feature-card fade-up" ref={addToRefs} style={{ background: 'white', borderRadius: 32, padding: 32, textAlign: 'center' }}><i className="fas fa-certificate" style={{ fontSize: 48, color: '#D4AF7A', marginBottom: 20 }}></i><h3>Сертифицированные мастера</h3><p>Стаж от 8 лет</p></div>
              <div className="feature-card fade-up" ref={addToRefs} style={{ background: 'white', borderRadius: 32, padding: 32, textAlign: 'center' }}><i className="fas fa-leaf" style={{ fontSize: 48, color: '#D4AF7A', marginBottom: 20 }}></i><h3>Премиальная косметика</h3><p>Только лучшие бренды</p></div>
              <div className="feature-card fade-up" ref={addToRefs} style={{ background: 'white', borderRadius: 32, padding: 32, textAlign: 'center' }}><i className="fas fa-hand-sparkles" style={{ fontSize: 48, color: '#D4AF7A', marginBottom: 20 }}></i><h3>Индивидуальный подход</h3><p>Подбор процедуры под вас</p></div>
            </div>
          </div>
        </section>

        {/* Услуги */}
        <section id="services" className="section">
          <div className="container">
            <h2 className="section-title fade-up" ref={addToRefs}>Ритуалы красоты</h2>
            <div className="cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: 30 }}>
              {services.map((s, idx) => (
                <div className="service-card fade-up" ref={addToRefs} key={idx} onClick={() => setIsBookingModalOpen(true)} style={{ cursor: 'pointer' }}>
                  <div className="card-img" style={{ height: 220, backgroundImage: `url(${s.img})`, backgroundSize: 'cover', borderRadius: 28 }}></div>
                  <div className="card-content" style={{ padding: 20 }}>
                    <h3><i className={`fas ${s.icon}`} style={{ marginRight: 8, color: '#D4AF7A' }}></i> {s.title}</h3>
                    <p>{s.desc}</p>
                    <div className="price" style={{ fontSize: 22, color: '#D4AF7A', margin: '10px 0' }}>{s.price}</div>
                    <div className="duration" style={{ fontSize: 13, color: '#9B8B7A' }}><i className="far fa-clock"></i> {s.duration}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Мастера */}
        <section id="masters" className="section">
          <div className="container">
            <h2 className="section-title fade-up" ref={addToRefs}>Наши специалисты</h2>
            <div className="masters-grid">
              {mastersList.map((m, i) => (
                <div className="master-card fade-up" ref={addToRefs} key={i}>
                  <img src={m.img} alt={m.name} className="master-img" />
                  <h3>{m.name}</h3>
                  <p style={{ color: '#D4AF7A', fontWeight: 500 }}>{m.role}</p>
                  <p style={{ fontSize: 14, margin: '8px 0' }}>{m.special}</p>
                  <small>{m.exp}</small>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Галерея */}
        <section id="gallery" className="section">
          <div className="container">
            <h2 className="section-title fade-up" ref={addToRefs}>Визуальная эстетика</h2>
            <div className="gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))', gap: 20 }}>
              {galleryImages.map((img, i) => <img key={i} src={img} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: 28 }} className="fade-up" ref={addToRefs} />)}
            </div>
          </div>
        </section>

        {/* Отзывы */}
        <section id="reviews" className="section">
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginBottom: 30 }}>
              <h2 className="section-title" style={{ marginBottom: 0 }}>Отзывы клиентов</h2>
              <button className="btn-gold" onClick={() => setIsReviewModalOpen(true)}>➕ Оставить отзыв</button>
            </div>
            {reviews.length > 0 ? (
              <div className="testimonial-slider" style={{ position: 'relative', background: '#FEFAF5', borderRadius: 48, padding: 40, marginTop: 20 }}>
                <button className="slider-btn slider-left" onClick={prevTestimonial}>←</button>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#D4AF7A', fontSize: 28, marginBottom: 15 }}>{"★".repeat(reviews[currentTestimonial].stars)}</div>
                  <p style={{ fontStyle: 'italic', fontSize: 18, marginBottom: 20 }}>“{reviews[currentTestimonial].text}”</p>
                  <h4>{reviews[currentTestimonial].name}</h4>
                  <small>{reviews[currentTestimonial].master && `мастер: ${reviews[currentTestimonial].master}`} • {reviews[currentTestimonial].date}</small>
                </div>
                <button className="slider-btn slider-right" onClick={nextTestimonial}>→</button>
              </div>
            ) : (
              <p style={{ textAlign: 'center' }}>Загрузка отзывов...</p>
            )}
          </div>
        </section>

        {/* Акция */}
        <section className="section">
          <div className="container">
            <div className="discount-card fade-up" ref={addToRefs}>
              <div className="discount-badge">🔥 Ограниченное предложение</div>
              <h2 className="discount-title">Скидка <span className="discount-highlight">20%</span> на первый визит</h2>
              <p className="discount-desc">Для новых клиентов при записи через сайт</p>
              <div className="luxury-timer">
                <div className="timer-block"><div className="timer-number">{String(timeLeft.days).padStart(2,'0')}</div><div className="timer-label">дней</div></div>
                <div className="timer-separator">:</div>
                <div className="timer-block"><div className="timer-number">{String(timeLeft.hours).padStart(2,'0')}</div><div className="timer-label">часов</div></div>
                <div className="timer-separator">:</div>
                <div className="timer-block"><div className="timer-number">{String(timeLeft.minutes).padStart(2,'0')}</div><div className="timer-label">минут</div></div>
                <div className="timer-separator">:</div>
                <div className="timer-block"><div className="timer-number">{String(timeLeft.seconds).padStart(2,'0')}</div><div className="timer-label">секунд</div></div>
              </div>
              <button className="btn-discount" onClick={() => setIsBookingModalOpen(true)}>Записаться сейчас <i className="fas fa-arrow-right"></i></button>
            </div>
          </div>
        </section>

        {/* Партнёры */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <h2 className="section-title fade-up" ref={addToRefs}>Наши партнёры</h2>
            <div className="partners-grid" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 40, marginTop: 40 }}>
              {partners.map((p, i) => (
                <div className="partner-card" key={i}>
                  <img src={p.logo} alt={p.name} style={{ height: 50, objectFit: 'contain' }} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Контакты */}
        <section className="section">
          <div className="container contact-row" style={{ background: 'white', borderRadius: 48, padding: 48, display: 'flex', flexWrap: 'wrap', gap: 40 }}>
            <div className="form-area" style={{ flex: 1 }}>
              <h3>Контакты</h3>
              <p><i className="fas fa-map-marker-alt"></i> Москва, Чистопрудный бульвар, 12</p>
              <p><i className="fas fa-phone-alt"></i> +7 (495) 555-33-22</p>
              <p><i className="far fa-envelope"></i> hello@pureaura.ru</p>
              <button className="btn-gold" style={{ marginTop: 30 }} onClick={() => setIsBookingModalOpen(true)}>Записаться</button>
            </div>
            <div className="form-area" style={{ flex: 1 }}>
              <h3>Режим работы</h3>
              <p>Ежедневно: 10:00 – 21:00</p>
              <p>Без выходных</p>
            </div>
          </div>
        </section>
      </main>

      <footer style={{ background: '#1C1917', color: '#CBC2B9', padding: 48, textAlign: 'center' }}>
        <div className="container">© 2025 Pure Aura — премиальный beauty-салон.</div>
      </footer>

      <div className="fixed-buttons">
        <a href="https://wa.me/74955553322" className="whatsapp-btn" target="_blank"><i className="fab fa-whatsapp"></i></a>
        <a href="https://t.me/pureaura_salon" className="telegram-btn" target="_blank"><i className="fab fa-telegram-plane"></i></a>
      </div>

      {/* Модалка отзыва */}
      {isReviewModalOpen && createPortal(
        <div className="modal-overlay" onClick={() => setIsReviewModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-modal" onClick={() => setIsReviewModalOpen(false)}>&times;</span>
            <h3 style={{ fontSize: 28, marginBottom: 20 }}>Оставить отзыв</h3>
            {user ? (
              <form onSubmit={submitReview}>
                <div className="rating-stars" style={{ marginBottom: 20 }}>
                  {[1,2,3,4,5].map(star => (
                    <span key={star} className={`rating-star ${star <= reviewRating ? 'active' : ''}`} onClick={() => setReviewRating(star)}>★</span>
                  ))}
                </div>
                <textarea rows="4" placeholder="Поделитесь впечатлениями..." value={reviewText} onChange={e => setReviewText(e.target.value)} required style={{ width: '100%', padding: 12, borderRadius: 24, border: '1px solid #EADBCE', marginBottom: 15 }}></textarea>
                <select value={reviewMaster} onChange={e => setReviewMaster(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 40, marginBottom: 20 }}>
                  <option value="">К мастеру (необязательно)</option>
                  {mastersList.map(m => <option key={m.name}>{m.name}</option>)}
                </select>
                <button type="submit" className="btn-solid" style={{ width: '100%' }}>Отправить отзыв</button>
              </form>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <p>Пожалуйста, войдите, чтобы оставить отзыв.</p>
                <Link to="/login" className="btn-solid" style={{ marginTop: 20 }}>Войти</Link>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}