import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { API } from '../api';

export default function UserRecipe() {
  const { id } = useParams();
  const { token } = useAuth();
  const [recipe, setRecipe]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/api/recipes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => {
        if (r.status === 404) { setNotFound(true); return null; }
        return r.json();
      })
      .then(data => { if (data) setRecipe(data); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id, token]);

  if (loading) {
    return <Layout><p style={styles.empty}>Loading…</p></Layout>;
  }

  if (notFound || !recipe) {
    return <Layout><p style={styles.empty}>Recipe not found.</p></Layout>;
  }

  const categoryLine = [recipe.category, recipe.subCategory].filter(Boolean).join(' · ');

  return (
    <Layout>
      <div style={styles.page}>

        {/* Thank-you banner */}
        <div style={styles.banner}>
          <p style={styles.bannerTitle}>Thanks for your Submission!</p>
          <p style={styles.bannerSub}>
            Your recipe has been submitted for approval. Once reviewed, it will appear in User Submissions.
          </p>
        </div>

        {/* Recipe card */}
        <div id="recipe" style={styles.header}>
          <img src={recipe.picture} alt={recipe.title} style={styles.heroImg} />
          <div style={styles.headerText}>
            {categoryLine && <p style={styles.category}>{categoryLine}</p>}
            <h2 style={styles.title}>{recipe.title}</h2>
            <p style={styles.submittedBy}>Submitted by {recipe.submittedBy}</p>
          </div>
        </div>

        <div style={styles.body}>

          {/* Ingredients */}
          <div style={styles.ingredientsCol}>
            <h3 style={styles.sectionHeading}>Ingredients</h3>
            <ul style={styles.ingredientList}>
              {recipe.ingredients.map((item, i) => (
                <li key={i} style={styles.ingredientItem}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div style={styles.instructionsCol}>
            <h3 style={styles.sectionHeading}>Instructions</h3>
            <ol style={styles.instructionList}>
              {recipe.instructions.map((step, i) => (
                <li key={i} style={styles.instructionItem}>{step}</li>
              ))}
            </ol>
          </div>

        </div>
      </div>
    </Layout>
  );
}

const styles = {
  empty:       { color: '#57606a', fontSize: '1rem' },
  page:        { display: 'flex', flexDirection: 'column', gap: '36px' },
  banner:      { backgroundColor: '#f0fdf4', border: '1px solid #4a9a3f', borderRadius: '10px', padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '600px' },
  bannerTitle: { fontSize: '1.5rem', fontWeight: 700, color: '#4a9a3f', margin: 0 },
  bannerSub:   { fontSize: '0.95rem', color: '#57606a', margin: 0, lineHeight: 1.6 },

  header:     { display: 'flex', gap: '28px', alignItems: 'flex-start', flexWrap: 'wrap' },
  heroImg:    { width: '240px', height: '240px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0 },
  headerText: { display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 },
  category:   { fontSize: '0.85rem', color: '#57606a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 },
  title:      { fontSize: '2rem', fontWeight: 700, color: '#f97316', margin: 0, lineHeight: 1.2 },
  submittedBy:{ fontSize: '0.85rem', color: '#57606a', margin: 0 },

  body:            { display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap' },
  ingredientsCol:  { minWidth: '200px', width: '220px', flexShrink: 0 },
  instructionsCol: { flex: 1 },

  sectionHeading: {
    fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase',
    letterSpacing: '0.5px', color: '#1f2328', marginTop: 0,
    marginBottom: '14px', paddingBottom: '8px', borderBottom: '2px solid #f97316',
  },
  ingredientList: { listStyle: 'disc', paddingLeft: '18px', margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' },
  ingredientItem: { fontSize: '0.9rem', color: '#1f2328' },
  instructionList:{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' },
  instructionItem:{ fontSize: '0.95rem', lineHeight: 1.7, color: '#1f2328' },
};
