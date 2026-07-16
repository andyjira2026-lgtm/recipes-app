import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const FIELDS = [
  { label: 'First Name', name: 'firstName' },
  { label: 'Last Name',  name: 'lastName' },
  { label: 'Username',   name: 'username' },
  { label: 'Email',      name: 'email',    type: 'email' },
  { label: 'Password',   name: 'password', type: 'password' },
  { label: 'Location',   name: 'location' },
];

export default function Register() {
  const { register, username, logout, user } = useAuth();
  const [form, setForm] = useState({ firstName: '', lastName: '', username: '', email: '', password: '', location: '' });
  const [error, setError] = useState('');
  const [picData, setPicData] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPicData(ev.target.result);
    reader.readAsDataURL(file);
  };

  const submit = async () => {
    for (const { name } of FIELDS) {
      if (!form[name]) { setError('All fields must be entered.'); return; }
    }
    setLoading(true);
    setError('');
    const err = await register(form, picData);
    setLoading(false);
    if (err) setError(err);
  };

  return (
    <Layout>
      {username ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={s.h2}>Register</h2>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Welcome, {user?.firstName || username}!</h3>
          <button style={s.logoutBtn} onClick={logout}>Log Out</button>
        </div>
      ) : (
        <div>
          <h2 style={s.h2}>Register</h2>
          <div style={s.form}>
            {FIELDS.map(({ label, name, type = 'text' }) => (
              <div key={name} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>{label}</label>
                <input type={type} name={name} value={form[name]} onChange={handle}
                  placeholder={`Enter your ${label.toLowerCase()}`}
                  style={{ padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none' }} />
              </div>
            ))}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Profile Picture</label>
              <input type="file" accept="image/*" ref={fileRef} onChange={handleFile}
                style={{ padding: '6px 8px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.95rem' }} />
            </div>
            {error && <span style={s.error}>{error}</span>}
            <button style={s.btn} onClick={submit} disabled={loading}>
              {loading ? 'Registering…' : 'Submit'}
            </button>
            <Link to="/login" style={s.link}>Already have an account? Log In</Link>
          </div>
        </div>
      )}
    </Layout>
  );
}

const s = {
  h2:        { fontSize: '1.8rem', fontWeight: 700, color: '#f97316', marginBottom: '28px' },
  form:      { backgroundColor: '#f7f8fa', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '480px' },
  btn:       { padding: '11px 28px', backgroundColor: '#f97316', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', alignSelf: 'flex-start' },
  logoutBtn: { padding: '11px 28px', backgroundColor: '#e5e7eb', color: '#1f2328', border: 'none', borderRadius: '6px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', alignSelf: 'flex-start' },
  error:     { color: '#c0392b', fontSize: '0.9rem', fontWeight: 600 },
  link:      { fontSize: '0.9rem', color: '#3b82d4', textDecoration: 'none' },
};
