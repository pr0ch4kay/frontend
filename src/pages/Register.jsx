import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const ok = await register(email, password, name);

    if (ok) {
      navigate('/verify', { state: { email } });
    }

  } catch (err) {
    alert(err.message || 'Ошибка регистрации');
  }
};

  return (
    <div className="auth-page">
      <div className="auth-container">
        <Link to="/" className="auth-back-home">← На главную</Link>
        <div className="auth-card">
          <h2>Создать аккаунт</h2>
          <p className="auth-subtitle">Присоединяйтесь к Pure Aura</p>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input type="text" placeholder="Имя" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="input-group">
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="input-group">
              <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn-solid auth-btn">Зарегистрироваться</button>
          </form>
          <p className="auth-footer">Уже есть аккаунт? <Link to="/login">Войти</Link></p>
        </div>
      </div>
    </div>
  );
}