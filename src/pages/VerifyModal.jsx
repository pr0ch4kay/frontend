import { useState } from 'react';

export default function VerifyModal({ isOpen, email, onClose, onVerify, onResend }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onVerify(code);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-modal" onClick={onClose}>&times;</span>
        <h3 style={{ fontSize: 28, marginBottom: 10 }}>Подтверждение почты</h3>
        <p style={{ color: '#7A6E62', marginBottom: 20 }}>
          Мы отправили код на <strong>{email}</strong>. Введите его ниже.
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
      </div>
    </div>
  );
}