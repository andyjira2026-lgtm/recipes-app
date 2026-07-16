import { useState } from 'react';
import Layout from '../components/Layout';

const CHEFS = [
  { id: 1, name: 'Chef 1', img: '/images/chef1.png' },
  { id: 2, name: 'Chef 2', img: '/images/chef2.png' },
  { id: 3, name: 'Chef 3', img: '/images/chef3.png' },
  { id: 4, name: 'Chef 4', img: '/images/chef4.png' },
];

export default function MeetTheChefs() {
  const [lightbox, setLightbox] = useState(null);

  return (
    <Layout>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#f97316', marginBottom: '24px' }}>Meet the Chefs</h2>
      <img src="/images/our-chefs.png" alt="Our Chefs" style={{ maxWidth: '100%', borderRadius: '8px', marginBottom: '32px', display: 'block' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {CHEFS.map(chef => (
          <div key={chef.id} style={styles.chefItem}>
            <img
              src={chef.img}
              alt={chef.name}
              style={styles.chefImg}
              onClick={() => setLightbox(chef.img)}
            />
            <span style={styles.chefName}>{chef.name}</span>
          </div>
        ))}
      </div>

      <img src="/images/our-chefs2.png" alt="Our Chefs" style={{ maxWidth: '100%', borderRadius: '8px', marginTop: '32px', display: 'block' }} />

      {lightbox && (
        <div style={styles.overlay} onClick={() => setLightbox(null)}>
          <span style={styles.closeBtn}>✕</span>
          <img src={lightbox} alt="Expanded" style={styles.lightboxImg} />
        </div>
      )}
    </Layout>
  );
}

const styles = {
  chefItem: { display: 'flex', alignItems: 'center', gap: '24px', backgroundColor: '#f7f8fa', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '16px' },
  chefImg:  { width: '180px', height: '180px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0, cursor: 'pointer' },
  chefName: { fontSize: '1.3rem', fontWeight: 700, color: '#1f2328' },
  overlay:  { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100, cursor: 'zoom-out' },
  closeBtn: { position: 'absolute', top: '20px', right: '28px', color: '#ffffff', fontSize: '2rem', fontWeight: 300, cursor: 'pointer' },
  lightboxImg: { maxWidth: '90vw', maxHeight: '85vh', borderRadius: '10px', objectFit: 'contain' },
};
