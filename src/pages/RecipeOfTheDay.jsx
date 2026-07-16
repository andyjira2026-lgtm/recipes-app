import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

export default function RecipeOfTheDay() {
  const { index } = useParams();
  const { username } = useAuth();
  const cached = username ? localStorage.getItem(`rotd_${index ?? 0}_${username}`) : null;
  const meal = cached ? JSON.parse(cached) : null;

  // Pull ingredients + measures into a clean array
  const ingredients = meal
    ? Array.from({ length: 20 }, (_, i) => ({
        ingredient: meal[`strIngredient${i + 1}`],
        measure:    meal[`strMeasure${i + 1}`],
      })).filter(({ ingredient }) => ingredient && ingredient.trim())
    : [];

  if (!meal) {
    return (
      <Layout>
        <p style={styles.empty}>No recipe loaded yet. Log in and visit any page to load today's recipe.</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={styles.page}>

        {/* Header */}
        <div style={styles.header}>
          <img src={meal.strMealThumb} alt={meal.strMeal} style={styles.heroImg} />
          <div style={styles.headerText}>
            <p style={styles.category}>{meal.strCategory} · {meal.strArea}</p>
            <h2 style={styles.title}>{meal.strMeal}</h2>
            {meal.strTags && (
              <div style={styles.tags}>
                {meal.strTags.split(',').map(t => t.trim()).filter(Boolean).map(tag => (
                  <span key={tag} style={styles.tag}>{tag}</span>
                ))}
              </div>
            )}
            {meal.strYoutube && (
              <a href={meal.strYoutube} target="_blank" rel="noreferrer" style={styles.ytLink}>
                ▶ Watch on YouTube
              </a>
            )}
          </div>
        </div>

        <div style={styles.body}>

          {/* Ingredients */}
          <div style={styles.ingredients}>
            <h3 style={styles.sectionHeading}>Ingredients</h3>
            <ul style={styles.ingredientList}>
              {ingredients.map(({ ingredient, measure }, i) => (
                <li key={i} style={styles.ingredientItem}>
                  <span style={styles.measure}>{measure?.trim()}</span>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div style={styles.instructions}>
            <h3 style={styles.sectionHeading}>Instructions</h3>
            {meal.strInstructions.split('\n').filter(p => p.trim()).map((para, i) => (
              <p key={i} style={styles.para}>{para.trim()}</p>
            ))}
          </div>

        </div>
      </div>
    </Layout>
  );
}

const styles = {
  empty: { color: '#57606a', fontSize: '1rem' },
  page:  { display: 'flex', flexDirection: 'column', gap: '32px' },
  header: {
    display: 'flex',
    gap: '28px',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  heroImg: {
    width: '240px',
    height: '240px',
    objectFit: 'cover',
    borderRadius: '10px',
    flexShrink: 0,
  },
  headerText: { display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 },
  category:   { fontSize: '0.85rem', color: '#57606a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 },
  title:      { fontSize: '2rem', fontWeight: 700, color: '#f97316', margin: 0, lineHeight: 1.2 },
  tags: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  tag:  { backgroundColor: '#f0fdf4', color: '#4a9a3f', border: '1px solid #4a9a3f', borderRadius: '20px', padding: '2px 10px', fontSize: '0.78rem', fontWeight: 600 },
  ytLink: { color: '#c0392b', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', marginTop: '4px' },
  body: { display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap' },
  ingredients: { minWidth: '200px', width: '220px', flexShrink: 0 },
  sectionHeading: { fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#1f2328', marginTop: 0, marginBottom: '14px', paddingBottom: '8px', borderBottom: '2px solid #f97316' },
  ingredientList: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' },
  ingredientItem: { display: 'flex', gap: '8px', fontSize: '0.9rem', color: '#1f2328' },
  measure: { minWidth: '70px', fontWeight: 600, color: '#f97316' },
  instructions: { flex: 1 },
  para: { fontSize: '0.95rem', lineHeight: 1.8, color: '#1f2328', marginTop: 0, marginBottom: '12px' },
};
