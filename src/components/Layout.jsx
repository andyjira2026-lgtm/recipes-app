import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API } from '../api';

const RECIPE_COUNT = 3;

function Sidebar() {
  const { username, token } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    if (!username || !token) return;

    // ── Recipes of the Day (stays in localStorage, from external API) ──
    const existing = Array.from({ length: RECIPE_COUNT }, (_, i) => {
      const c = localStorage.getItem(`rotd_${i}_${username}`);
      return c ? JSON.parse(c) : null;
    });

    if (existing.every(Boolean)) {
      setRecipes(existing);
    } else {
      setLoading(true);
      const fetches = existing.map((meal, i) =>
        meal
          ? Promise.resolve(meal)
          : fetch('https://www.themealdb.com/api/json/v1/1/random.php')
              .then(r => r.json())
              .then(data => {
                const m = data.meals[0];
                localStorage.setItem(`rotd_${i}_${username}`, JSON.stringify(m));
                return m;
              })
      );
      Promise.all(fetches)
        .then(meals => { setRecipes(meals); setLoading(false); })
        .catch(() => { setError(true); setLoading(false); });
    }

    // ── User Submissions (from API) ──
    fetch(`${API}/api/recipes`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => setSubmissions(Array.isArray(data) ? data : []))
      .catch(() => setSubmissions([]));
  }, [username, token]);

  return (
    <aside style={styles.sidebar}>
      <h3 style={styles.sidebarHeading}>Recipes of the Day</h3>

      {!username ? (
        <div style={styles.guestBox}>
          <p style={styles.guestMsg}>Log in to view the Recipes of the Day.</p>
          <button style={styles.guestBtn} onClick={() => navigate('/login')}>
            Log In / Register
          </button>
        </div>
      ) : (
        <>
          {loading && <p style={styles.sidebarMuted}>Loading…</p>}
          {error   && <p style={styles.sidebarMuted}>Could not load recipes.</p>}
          {recipes.map((recipe, i) => recipe && (
            <div key={i} style={styles.recipeCard}>
              <img src={recipe.strMealThumb} alt={recipe.strMeal} style={styles.recipeThumb} />
              <Link to={`/recipe-of-the-day/${i}`} style={styles.recipeTitle}>
                {recipe.strMeal}
              </Link>
              <p style={styles.recipeMeta}>{recipe.strCategory} · {recipe.strArea}</p>
            </div>
          ))}
        </>
      )}

      <div style={styles.sidebarDivider} />
      <h3 style={styles.sidebarHeading}>User Submissions</h3>

      {!username ? (
        <p style={styles.sidebarMuted}>Log in to see submissions.</p>
      ) : submissions.length === 0 ? (
        <p style={styles.sidebarMuted}>No submissions yet.</p>
      ) : (
        submissions.map(sub => (
          <Link key={sub.id} to={`/recipe/submitted/${sub.id}`} style={styles.subCard}>
            <img src={sub.picture} alt={sub.title} style={styles.recipeThumb} />
            <div style={styles.subInfo}>
              <span style={styles.recipeTitle}>{sub.title}</span>
              <span style={styles.recipeMeta}>
                {[sub.category, sub.subCategory].filter(Boolean).join(' · ')}
              </span>
              <div style={styles.subAuthor}>
                {sub.submitterPic
                  ? <img src={sub.submitterPic} alt="" style={styles.subAvatar} />
                  : <div style={styles.subAvatarPlaceholder}>{sub.submittedBy.charAt(0).toUpperCase()}</div>
                }
                <span style={styles.subAuthorName}>{sub.submittedBy}</span>
              </div>
            </div>
          </Link>
        ))
      )}
    </aside>
  );
}

function ProfileBadge() {
  const { username, logout, user } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  if (!username) return null;

  return (
    <div ref={ref} style={styles.badge} onClick={() => setOpen(o => !o)}>
      <div style={styles.badgeCircle}>
        {user?.pic
          ? <img src={user.pic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : username.charAt(0).toUpperCase()}
      </div>
      <span style={styles.badgeName}>{user?.firstName || username}</span>
      {open && (
        <div style={styles.dropdown}>
          <button style={styles.dropdownBtn} onClick={(e) => { e.stopPropagation(); setOpen(false); navigate('/profile'); }}>
            Edit Profile
          </button>
          <button style={styles.dropdownBtn} onClick={(e) => { e.stopPropagation(); logout(); setOpen(false); }}>
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}

export default function Layout({ children }) {
  const { username } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header style={styles.header}>
        <h1 style={{ margin: 0 }}>
          <Link to="/" style={styles.siteTitle}>Today's Top Recipes</Link>
        </h1>
        <ProfileBadge />
      </header>

      <nav style={styles.nav}>
        <ul style={styles.navList}>
          {[
            { to: '/our-kitchen',    label: 'Our Kitchen' },
            { to: '/history',        label: 'History' },
            { to: '/meet-the-chefs', label: 'Meet the Chefs' },
            ...(!username ? [{ to: '/login', label: 'Log In / Register' }] : []),
            ...(username  ? [{ to: '/profile', label: 'Profile' }]         : []),
          ].map(({ to, label }) => (
            <li key={to}>
              <NavLink to={to} style={({ isActive }) => ({ ...styles.navLink, ...(isActive ? styles.navLinkActive : {}) })}>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div style={styles.pageBody}>
        <Sidebar />
        <main style={styles.main}>{children}</main>
      </div>

      <footer style={styles.footer}>Made with IBM Bob</footer>
    </div>
  );
}

const styles = {
  header: {
    width: '100%',
    backgroundColor: '#f7f8fa',
    borderBottom: '1px solid #e5e7eb',
    padding: '20px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'visible',
    position: 'relative',
  },
  siteTitle: {
    fontSize: '2.2rem',
    fontWeight: 700,
    letterSpacing: '-0.5px',
    color: '#1f2328',
    textDecoration: 'none',
  },
  nav: {
    width: '100%',
    backgroundColor: '#f97316',
    borderBottom: '3px solid #c2580a',
  },
  navList: {
    listStyle: 'none',
    display: 'flex',
    justifyContent: 'center',
    gap: '4px',
    padding: '0 16px',
    maxWidth: '760px',
    margin: '0 auto',
  },
  navLink: {
    display: 'block',
    padding: '14px 22px',
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: 600,
    letterSpacing: '0.3px',
    borderBottom: '3px solid transparent',
  },
  navLinkActive: {
    backgroundColor: '#c2580a',
    borderBottom: '3px solid #4a9a3f',
  },
  pageBody: {
    display: 'flex',
    width: '100%',
    flex: 1,
  },
  sidebar: {
    width: '220px',
    minWidth: '220px',
    backgroundColor: '#4a9a3f',
    borderRight: '3px solid #357a2e',
    padding: '28px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    minHeight: 'calc(100vh - 130px)',
  },
  sidebarHeading: {
    fontSize: '0.8rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: '#d4f5ce',
    marginBottom: '8px',
    paddingBottom: '8px',
    borderBottom: '1px solid #357a2e',
  },
  sidebarMuted: {
    color: '#d4f5ce',
    fontSize: '0.85rem',
    margin: 0,
  },
  sidebarDivider: {
    borderTop: '1px solid #357a2e',
    margin: '8px 0',
  },
  subCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    textDecoration: 'none',
    backgroundColor: 'rgba(0,0,0,0.12)',
    borderRadius: '8px',
    padding: '8px',
    cursor: 'pointer',
  },
  subInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  subAuthor: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '4px',
  },
  subAvatar: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  subAvatarPlaceholder: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: '#f97316',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontSize: '0.65rem',
    fontWeight: 700,
    flexShrink: 0,
  },
  subAuthorName: {
    color: '#d4f5ce',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  guestBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  guestMsg: {
    color: '#d4f5ce',
    fontSize: '0.85rem',
    lineHeight: 1.5,
    margin: 0,
  },
  guestBtn: {
    padding: '8px 12px',
    backgroundColor: '#ffffff',
    color: '#4a9a3f',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  recipeCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  recipeThumb: {
    width: '100%',
    borderRadius: '6px',
    display: 'block',
  },
  recipeTitle: {
    color: '#ffffff',
    fontWeight: 700,
    fontSize: '0.9rem',
    lineHeight: 1.4,
    textDecoration: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.3)',
    paddingBottom: '4px',
  },
  recipeMeta: {
    color: '#d4f5ce',
    fontSize: '0.78rem',
    margin: 0,
  },
  main: {
    flex: 1,
    padding: '48px 32px',
  },
  footer: {
    marginTop: 'auto',
    padding: '16px',
    textAlign: 'center',
    fontSize: '12px',
    color: '#57606a',
    borderTop: '1px solid #e5e7eb',
    width: '100%',
  },
  badge: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
    position: 'relative',
  },
  badgeCircle: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#f97316',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontWeight: 700,
    fontSize: '1.1rem',
    overflow: 'hidden',
    border: '2px solid #e5e7eb',
  },
  badgeName: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#57606a',
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    minWidth: '160px',
    zIndex: 200,
    overflow: 'hidden',
  },
  dropdownBtn: {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    padding: '11px 16px',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    fontWeight: 500,
    color: '#1f2328',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
};
