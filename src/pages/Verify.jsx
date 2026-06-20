
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Verify() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

 const verifyEmail = async () => {
  const res = await fetch('https://pure-backend-pz7z.onrender.com/api/auth/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code })
  });

  if (res.ok) {
    const data = await res.json();

    localStorage.setItem('token', data.token);
    navigate('/profile');
  }
};

  return (
    <div style={{padding:20}}>
      <h2>Verify Email</h2>
      <input value={code} onChange={(e)=>setCode(e.target.value)} />
      <button onClick={handleVerify}>Confirm</button>
    </div>
  );
}
