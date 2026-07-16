import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

export default function Login() {
  const { login, username, logout, user } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async () => {
    if (!form.username || !form.password) { setError('All fields must be entered.'); return; }
    setLoading(true);
    setError('');
    const err = await login(form.username, form.password);
    setLoading(false);
    if (err) setError(err);
  };

  return (
    <Layout>
      {username ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={s.h2}>Log In</h2>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Welcome, {user?.firstName || username}!</h3>
          <button style={s.logoutBtn} onClick={logout}>Log Out</button>
        </div>
      ) : (
        <div>
          <h2 style={s.h2}>Log In</h2>
          <div style={s.form}>
            <Field label="Username" name="username" value={form.username} onChange={handle} />
            <Field label="Password" name="password" type="password" value={form.password} onChange={handle} />
            {error && <span style={s.error}>{error}</span>}
            <button style={s.btn} onClick={submit} disabled={loading}>
              {loading ? 'Logging in…' : 'Log In'}
            </button>
            <Link to="/register" style={s.link}>Don't have an account? Register</Link>
          </div>
        </div>
      )}
    </Layout>
  );
}

function Field({ label, name, type = 'text', value, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} placeholder={`Enter your ${label.toLowerCase()}`}
        style={{ padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none' }} />
    </div>
  );
}

const s = {
  h2:        { fontSize: '1.8rem', fontWeight: 700, color: '#f97316', marginBottom: '28px' },
  form:      { backgroundColor: '#f7f8fa', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '440px' },
  btn:       { padding: '11px 28px', backgroundColor: '#f97316', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', alignSelf: 'flex-start' },
  logoutBtn: { padding: '11px 28px', backgroundColor: '#e5e7eb', color: '#1f2328', border: 'none', borderRadius: '6px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', alignSelf: 'flex-start' },
  error:     { color: '#c0392b', fontSize: '0.9rem', fontWeight: 600 },
  link:      { fontSize: '0.9rem', color: '#3b82d4', textDecoration: 'none' },
};
