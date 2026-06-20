import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      alert('Неверный email или пароль');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <Link to="/" className="auth-back-home">← На главную</Link>
        <div className="auth-card">
          <h2>Добро пожаловать</h2>
          <p className="auth-subtitle">Войдите в свой аккаунт</p>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="input-group">
              <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn-solid auth-btn">Войти</button>
          </form>
          <p className="auth-footer">Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></p>
        </div>
      </div>
    </div>
  );
}