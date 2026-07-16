// Base URL for all API requests.
// In development (Vite), set VITE_API_URL in .env to override.
// In production, set VITE_API_URL to your Render deploy URL.
export const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
