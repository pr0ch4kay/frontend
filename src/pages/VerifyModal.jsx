import { useEffect, useState } from "react";

export default function VerifyModal({
  isOpen,
  email,
  onClose,
  onVerify,
  onResend,
}) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      setCode("");
      setMessage("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerify = async () => {
    if (!code.trim()) {
      setMessage("Введите код");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await onVerify?.(code);

      setMessage("Успешно подтверждено");
    } catch (e) {
      setMessage("Ошибка подтверждения кода");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setMessage("Отправляем код...");

      await onResend?.();

      setMessage("Код отправлен повторно");
    } catch (e) {
      setMessage("Ошибка отправки кода");
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={{ marginBottom: 10 }}>Подтверждение аккаунта</h2>

        <p style={{ marginBottom: 10, opacity: 0.8 }}>
          Код отправлен на: <b>{email || "email не указан"}</b>
        </p>

        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Введите код"
          style={styles.input}
        />

        {message && <div style={styles.message}>{message}</div>}

        <div style={styles.buttons}>
          <button onClick={handleVerify} disabled={loading}>
            {loading ? "Проверка..." : "Подтвердить"}
          </button>

          <button onClick={handleResend} disabled={loading}>
            Отправить снова
          </button>

          <button onClick={onClose} disabled={loading}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modal: {
    width: 380,
    background: "#fff",
    borderRadius: 12,
    padding: 20,
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  },
  input: {
    width: "100%",
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
  },
  buttons: {
    display: "flex",
    gap: 8,
    marginTop: 10,
    flexWrap: "wrap",
  },
  message: {
    fontSize: 12,
    marginTop: 5,
    color: "#333",
  },
};