
export default function VerifyModal({ isOpen, email, onClose, onVerify }) {
  const handle = async (e) => {
    e.preventDefault();
    const code = e.target.code.value;
    await onVerify(code);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position:"fixed", inset:0, background:"rgba(0,0,0,0.5)",
      display:"flex", alignItems:"center", justifyContent:"center"
    }}>
      <div style={{background:"#fff", padding:20}}>
        <h3>Verify {email}</h3>

        <form onSubmit={handle}>
          <input name="code" placeholder="code" />
          <button>Verify</button>
        </form>

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
