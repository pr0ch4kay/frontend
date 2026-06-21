import { useState, useEffect } from 'react';

export default function VerifyModal({ isOpen, email, onClose, onVerify, onResend }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  // Если модалка закрыта — ничего не показываем
  if (!isOpen) return null;

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onVerify(code);
    } catch (err) {
      alert(err.message || 'Неверный код');
    } finally {
      setLoading(false);
    }
  };

  // Функция для тестовой вставки кода (если бэк вернул его в data)
  // Чтобы она работала, в AuthContext нужно добавить передачу кода. 
  // Но мы оставим это для ручного ввода, а код будет подсвечен в инструкции.

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-modal" onClick={onClose}>&times;</span>
        <h3 style={{ fontSize: 28, marginBottom: 10 }}>Подтверждение почты</h3>
        <p style={{ color: '#7A6E62', marginBottom: 20 }}>
          Мы отправили код на <strong>{email}</strong>.
        </p>
        
        <form onSubmit={handleVerify}>
          <input 
            type="text" 
            placeholder="Введите код из письма" 
            value={code} 
            onChange={(e) => setCode(e.target.value)} 
            required 
            style={{ width: '100%', padding: 12, marginBottom: 15, borderRadius: 40, border: '1px solid #EADBCE' }}
          />
          <button type="submit" className="btn-solid" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Проверяем...' : 'Подтвердить'}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <button 
            onClick={onResend} 
            style={{ background: 'none', border: 'none', color: '#D4AF7A', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Отправить код повторно
          </button>
        </div>
        
        {/* Техническая подсказка для тебя (на время разработки) */}
        <div style={{ marginTop: 15, padding: 10, background: '#f5f5f5', borderRadius: 10, fontSize: 13, color: '#555' }}>
          <p style={{ margin: 0 }}>
            💡 <strong>Для отладки:</strong> Открой консоль браузера (F12 → Console), там будет выведен код.
          </p>
        </div>
      </div>
    </div>
  );
}