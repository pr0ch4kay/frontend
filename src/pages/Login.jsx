
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      nav("/profile");
    } catch (e) {
      alert("login error");
    }
  };

  return (
    <form onSubmit={submit}>
      <input placeholder="email" onChange={e=>setEmail(e.target.value)} />
      <input placeholder="password" type="password" onChange={e=>setPassword(e.target.value)} />
      <button>Login</button>
    </form>
  );
}
