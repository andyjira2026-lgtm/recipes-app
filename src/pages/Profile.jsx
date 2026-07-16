import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { API } from '../api';

export default function Profile() {
  const { username, user, token, updatePic, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const recipePicRef = useRef(null);

  // Profile picture state
  const [preview, setPreview] = useState(null);
  const [saved, setSaved] = useState(false);

  // Recipe submission state
  const [recipeTitle, setRecipeTitle]           = useState('');
  const [recipeCategory, setRecipeCategory]     = useState('');
  const [recipeSubCategory, setRecipeSubCategory] = useState('');
  const [recipePicPreview, setRecipePicPreview] = useState(null);
  const [ingredientInput, setIngredientInput]   = useState('');
  const [ingredients, setIngredients]           = useState([]);
  const [instructionInput, setInstructionInput] = useState('');
  const [instructions, setInstructions]         = useState([]);
  const [formErrors, setFormErrors]             = useState([]);
  const [submitting, setSubmitting]             = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setPreview(ev.target.result); setSaved(false); };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => { await updatePic(preview); setSaved(true); };

  const handleRemove = async () => {
    await updatePic(null); setPreview(null); setSaved(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRecipePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setRecipePicPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const addIngredient = () => {
    const val = ingredientInput.trim();
    if (!val) return;
    setIngredients(prev => [...prev, val]);
    setIngredientInput('');
  };

  const addInstruction = () => {
    const val = instructionInput.trim();
    if (!val) return;
    setInstructions(prev => [...prev, val]);
    setInstructionInput('');
  };

  const handleSubmit = async () => {
    const errors = [];
    if (!recipeTitle.trim())       errors.push('Title is required.');
    if (!recipeCategory)           errors.push('Category is required.');
    if (!recipePicPreview)         errors.push('Picture is required.');
    if (ingredients.length < 3)    errors.push('At least 3 ingredients are required.');
    if (instructions.length < 3)   errors.push('At least 3 instruction steps are required.');
    setFormErrors(errors);
    if (errors.length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/recipes`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title:       recipeTitle.trim(),
          category:    recipeCategory,
          subCategory: recipeSubCategory,
          picture:     recipePicPreview,
          ingredients,
          instructions,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setFormErrors([data.error || 'Submission failed.']); return; }
      navigate(`/recipe/submitted/${data.id}`);
    } finally {
      setSubmitting(false);
    }
  };

  const currentPic = preview || user?.pic;

  return (
    <Layout>
      <h2 style={styles.heading}>Profile</h2>

      <div style={styles.pageColumns}>

        {/* ── Left: profile card ── */}
        <div style={styles.card}>
          <div style={styles.avatarWrapper}>
            {currentPic ? (
              <img src={currentPic} alt="Profile" style={styles.avatarImg} />
            ) : (
              <div style={styles.avatarPlaceholder}>
                {username ? username.charAt(0).toUpperCase() : '?'}
              </div>
            )}
          </div>

          <div style={styles.info}>
            <p style={styles.name}>
              {user?.firstName || user?.lastName
                ? `${user.firstName} ${user.lastName}`.trim()
                : username}
            </p>
            {user?.email    && <p style={styles.meta}>{user.email}</p>}
            {user?.location && <p style={styles.meta}>{user.location}</p>}
          </div>

          <div style={styles.uploadSection}>
            <p style={styles.label}>Profile Picture</p>
            <input ref={fileInputRef} type="file" accept="image/*"
              style={{ display: 'none' }} onChange={handleFileChange} />
            <div style={styles.btnRow}>
              <button style={styles.btnPrimary} onClick={() => fileInputRef.current?.click()}>
                Choose Image
              </button>
              {preview && !saved && (
                <button style={styles.btnSave} onClick={handleSave}>Save</button>
              )}
              {(user?.pic || preview) && (
                <button style={styles.btnRemove} onClick={handleRemove}>Remove</button>
              )}
            </div>
            {saved && <p style={styles.savedMsg}>Profile picture updated!</p>}
            <button style={styles.btnLogout} onClick={() => { logout(); navigate('/'); }}>
              Log Out
            </button>
          </div>
        </div>

        {/* ── Right: recipe submission form ── */}
        <div style={styles.formPanel}>
          <h3 style={styles.formHeading}>Submit Recipe for Approval</h3>

          {/* Title */}
          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>Title</label>
            <input
              style={styles.input}
              type="text"
              placeholder="Recipe title"
              value={recipeTitle}
              onChange={e => setRecipeTitle(e.target.value)}
            />
          </div>

          {/* Category */}
          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>Category</label>
            <select
              style={styles.select}
              value={recipeCategory}
              onChange={e => setRecipeCategory(e.target.value)}
            >
              <option value="">Select a category…</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Snack">Snack</option>
              <option value="Dinner">Dinner</option>
              <option value="Dessert">Dessert</option>
            </select>
          </div>

          {/* Sub Category */}
          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>Sub Category <span style={styles.optionalTag}>(Optional)</span></label>
            <select
              style={styles.select}
              value={recipeSubCategory}
              onChange={e => setRecipeSubCategory(e.target.value)}
            >
              <option value="">Select a sub category…</option>
              <option value="Italian">Italian</option>
              <option value="Jamaican">Jamaican</option>
              <option value="Mexican">Mexican</option>
              <option value="Chinese">Chinese</option>
              <option value="French">French</option>
              <option value="Southwest">Southwest</option>
              <option value="Seafood">Seafood</option>
              <option value="BBQ">BBQ</option>
              <option value="Southern">Southern</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Picture */}
          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>Picture</label>
            <input ref={recipePicRef} type="file" accept="image/*"
              style={{ display: 'none' }} onChange={handleRecipePicChange} />
            <div style={styles.btnRow}>
              <button style={styles.btnPrimary} onClick={() => recipePicRef.current?.click()}>
                Choose Image
              </button>
              {recipePicPreview && (
                <button style={styles.btnRemove} onClick={() => {
                  setRecipePicPreview(null);
                  if (recipePicRef.current) recipePicRef.current.value = '';
                }}>Remove</button>
              )}
            </div>
            {recipePicPreview && (
              <img src={recipePicPreview} alt="Recipe preview" style={styles.recipePicPreview} />
            )}
          </div>

          {/* Ingredients */}
          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>Ingredients</label>
            <div style={styles.addRow}>
              <input
                style={styles.input}
                type="text"
                placeholder="e.g. 2 cups flour"
                value={ingredientInput}
                onChange={e => setIngredientInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addIngredient()}
              />
              <button style={styles.btnAdd} onClick={addIngredient}>Add</button>
            </div>
            {ingredients.length > 0 && (
              <ul style={styles.itemList}>
                {ingredients.map((item, i) => (
                  <li key={i} style={styles.itemRow}>
                    <span style={styles.itemText}>{item}</span>
                    <button style={styles.btnDelete}
                      onClick={() => setIngredients(prev => prev.filter((_, j) => j !== i))}>
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Instructions */}
          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>Instructions</label>
            <div style={styles.addRow}>
              <input
                style={styles.input}
                type="text"
                placeholder="e.g. Preheat oven to 350°F"
                value={instructionInput}
                onChange={e => setInstructionInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addInstruction()}
              />
              <button style={styles.btnAdd} onClick={addInstruction}>Add</button>
            </div>
            {instructions.length > 0 && (
              <ol style={styles.itemList}>
                {instructions.map((step, i) => (
                  <li key={i} style={styles.itemRow}>
                    <span style={styles.itemText}>{step}</span>
                    <button style={styles.btnDelete}
                      onClick={() => setInstructions(prev => prev.filter((_, j) => j !== i))}>
                      ✕
                    </button>
                  </li>
                ))}
              </ol>
            )}
          </div>

          {formErrors.length > 0 && (
            <div style={styles.errorBox}>
              <p style={styles.errorHeading}>Please fix the following before submitting:</p>
              <ul style={styles.errorList}>
                {formErrors.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            </div>
          )}

          <button style={styles.btnSubmit} onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit for Approval'}
          </button>
        </div>

      </div>
    </Layout>
  );
}

const styles = {
  heading: { fontSize: '1.8rem', fontWeight: 700, color: '#f97316', marginBottom: '24px' },
  pageColumns: { display: 'flex', alignItems: 'flex-start', gap: '48px', flexWrap: 'wrap' },

  // ── Profile card ──
  card:              { display: 'flex', flexDirection: 'column', gap: '24px', minWidth: '240px', maxWidth: '280px' },
  avatarWrapper:     { width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', border: '3px solid #e5e7eb' },
  avatarImg:         { width: '100%', height: '100%', objectFit: 'cover' },
  avatarPlaceholder: { width: '100%', height: '100%', backgroundColor: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 700, fontSize: '2rem' },
  info:              { display: 'flex', flexDirection: 'column', gap: '4px' },
  name:              { fontSize: '1.2rem', fontWeight: 700, color: '#1f2328', margin: 0 },
  meta:              { fontSize: '0.9rem', color: '#57606a', margin: 0 },
  uploadSection:     { display: 'flex', flexDirection: 'column', gap: '10px' },
  label:             { fontSize: '0.85rem', fontWeight: 600, color: '#57606a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' },
  btnRow:            { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  savedMsg:          { fontSize: '0.875rem', color: '#4a9a3f', fontWeight: 600, margin: 0 },

  // ── Buttons ──
  btnPrimary: { padding: '8px 16px', backgroundColor: '#f97316', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  btnSave:    { padding: '8px 16px', backgroundColor: '#4a9a3f', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  btnRemove:  { padding: '8px 16px', backgroundColor: 'transparent', color: '#c0392b', border: '1px solid #c0392b', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  btnLogout:  { padding: '8px 16px', backgroundColor: 'transparent', color: '#c0392b', border: '1px solid #c0392b', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', alignSelf: 'flex-start' },
  btnAdd:     { padding: '8px 14px', backgroundColor: '#f97316', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' },
  btnDelete:  { background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer', fontSize: '0.85rem', padding: '0 4px', lineHeight: 1, fontFamily: 'inherit' },
  btnSubmit:  { marginTop: '8px', padding: '10px 28px', backgroundColor: '#4a9a3f', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },

  // ── Submission form ──
  formPanel:        { flex: 1, borderLeft: '1px solid #e5e7eb', paddingLeft: '48px', minWidth: '300px' },
  formHeading:      { fontSize: '1.2rem', fontWeight: 700, color: '#1f2328', marginTop: 0, marginBottom: '24px' },
  fieldGroup:       { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' },
  fieldLabel:       { fontSize: '0.85rem', fontWeight: 600, color: '#57606a', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input:            { padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.95rem', fontFamily: 'inherit', color: '#1f2328', outline: 'none', flex: 1 },
  select:           { padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.95rem', fontFamily: 'inherit', color: '#1f2328', outline: 'none', backgroundColor: '#ffffff', cursor: 'pointer' },
  addRow:           { display: 'flex', gap: '8px' },
  itemList:         { margin: '4px 0 0 0', padding: '0 0 0 0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' },
  itemRow:          { display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f7f8fa', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '6px 10px' },
  itemText:         { fontSize: '0.9rem', color: '#1f2328' },
  recipePicPreview: { marginTop: '8px', width: '160px', height: '120px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e5e7eb', display: 'block' },
  optionalTag:      { fontSize: '0.78rem', fontWeight: 400, color: '#57606a', textTransform: 'none', letterSpacing: 0 },
  errorBox:         { backgroundColor: '#fff5f5', border: '1px solid #f5c2c2', borderRadius: '6px', padding: '12px 16px', marginBottom: '16px' },
  errorHeading:     { fontSize: '0.875rem', fontWeight: 700, color: '#c0392b', margin: '0 0 8px 0' },
  errorList:        { margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.875rem', color: '#c0392b' },
};
