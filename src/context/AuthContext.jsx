import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { API } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('auth_token') || null);

  // On mount (or when token changes), rehydrate user from the API
  useEffect(() => {
    if (!token) { setUser(null); return; }
    fetch(`${API}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(u => setUser(u))
      .catch(() => {
        // Token expired or invalid — clear it
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
      });
  }, [token]);

  const login = useCallback(async (username, password) => {
    const res = await fetch(`${API}/api/auth/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) return data.error || 'Login failed.';
    localStorage.setItem('auth_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return null;
  }, []);

  const register = useCallback(async (fields, pic) => {
    const res = await fetch(`${API}/api/auth/register`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ ...fields, pic: pic || undefined }),
    });
    const data = await res.json();
    if (!res.ok) return data.error || 'Registration failed.';
    localStorage.setItem('auth_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return null;
  }, []);

  const logout = useCallback(() => {
    if (user) {
      [0, 1, 2].forEach(i => localStorage.removeItem(`rotd_${i}_${user.username}`));
    }
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  }, [user]);

  const updatePic = useCallback(async (dataUrl) => {
    if (!token) return;
    const res = await fetch(`${API}/api/users/me/pic`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body:    JSON.stringify({ pic: dataUrl || null }),
    });
    const data = await res.json();
    if (res.ok) {
      setUser(prev => ({ ...prev, pic: data.pic }));
    }
  }, [token]);

  // Backward-compat helper — just returns the user object
  const getProfile = useCallback(() => user, [user]);

  // Derived for backward compat with components that read `username` directly
  const username = user?.username ?? null;

  return (
    <AuthContext.Provider value={{ user, token, username, login, register, logout, updatePic, getProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
