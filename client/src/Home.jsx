import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const [editId, setEditId] = useState(null);
  const nav = useNavigate();

  const load = async () => setNotes((await api.get("/notes")).data);
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    if (editId) await api.put(`/notes/${editId}`, form);
    else await api.post("/notes", form);
    setForm({ title: "", content: "" });
    setEditId(null);
    load();
  };

  const del = async (id) => { await api.delete(`/notes/${id}`); load(); };
  const edit = (n) => { setEditId(n._id); setForm({ title: n.title, content: n.content }); };
  const logout = () => { localStorage.clear(); nav("/login"); };

  return (
    <div className="home">
      <header>
        <h2>Welcome, {localStorage.getItem("name")}</h2>
        <button onClick={logout}>Logout</button>
      </header>
      <form onSubmit={save}>
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <textarea placeholder="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
        <button>{editId ? "Update" : "Add"} Note</button>
      </form>
      <div className="grid">
        {notes.map((n) => (
          <div className="card" key={n._id}>
            <h3>{n.title}</h3>
            <p>{n.content}</p>
            <button onClick={() => edit(n)}>Edit</button>
            <button onClick={() => del(n._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}