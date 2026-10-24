import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "./api";

export default function Signup() {
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const nav = useNavigate();
  const ch = (e) => setF({ ...f, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/signup", f);
      nav("/login");
    } catch (e) {
      setErr(e.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="box">
      <h2>Sign Up</h2>
      <form onSubmit={submit}>
        <input name="name" placeholder="Name" onChange={ch} required />
        <input name="email" type="email" placeholder="Email" onChange={ch} required />
        <input name="password" type="password" placeholder="Password" onChange={ch} required />
        <button>Create account</button>
      </form>
      {err && <p className="err">{err}</p>}
      <p>Already registered? <Link to="/login">Login</Link></p>
    </div>
  );
}