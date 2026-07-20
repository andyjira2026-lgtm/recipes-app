import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout>
      <img src={`${import.meta.env.BASE_URL}images/home.png`} alt="Today's Top Recipes" style={{ maxWidth: '100%', borderRadius: '8px' }} />
    </Layout>
  );
}
