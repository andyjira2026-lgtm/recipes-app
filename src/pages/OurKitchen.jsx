import Layout from '../components/Layout';

export default function OurKitchen() {
  return (
    <Layout>
      <h2 style={h2}>Our Kitchen</h2>
      <img src="/images/our-kitchen2.png" alt="Our Kitchen" style={img} />
      <img src={`${import.meta.env.BASE_URL}images/our-kitchen.png`} alt="Chef placing a carrot into a large pot" style={img} />
    </Layout>
  );
}

const h2 = { fontSize: '1.8rem', fontWeight: 700, color: '#f97316', marginBottom: '24px' };
const img = { maxWidth: '100%', borderRadius: '8px', marginTop: '24px', display: 'block' };
