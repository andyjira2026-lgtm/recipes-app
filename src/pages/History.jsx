import Layout from '../components/Layout';

export default function History() {
  return (
    <Layout>
      <h2 style={h2}>History</h2>
      <img src={`${import.meta.env.BASE_URL}images/history2.png`} alt="History" style={img} />
      <img src={`${import.meta.env.BASE_URL}images/history.png`}  alt="History" style={img} />
    </Layout>
  );
}

const h2 = { fontSize: '1.8rem', fontWeight: 700, color: '#f97316', marginBottom: '24px' };
const img = { maxWidth: '100%', borderRadius: '8px', marginTop: '24px', display: 'block' };
