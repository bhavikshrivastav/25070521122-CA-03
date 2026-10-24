import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "./api";

export default function Login() {
  const [f, setF] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/login", f);
      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.name);
      nav("/home");
    } catch (e) {
      setErr(e.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="box">
      <h2>Login</h2>
      <form onSubmit={submit}>
        <input type="email" placeholder="Email" onChange={(e) => setF({ ...f, email: e.target.value })} required />
        <input type="password" placeholder="Password" onChange={(e) => setF({ ...f, password: e.target.value })} required />
        <button>Login</button>
      </form>
      {err && <p className="err">{err}</p>}
      <p>New user? <Link to="/signup">Sign up</Link></p>
    </div>
  );
}