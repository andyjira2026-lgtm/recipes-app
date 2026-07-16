import { HashRouter as BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import Home          from './pages/Home';
import OurKitchen   from './pages/OurKitchen';
import History      from './pages/History';
import MeetTheChefs from './pages/MeetTheChefs';
import Login        from './pages/Login';
import Register     from './pages/Register';
import Profile         from './pages/Profile';
import RecipeOfTheDay  from './pages/RecipeOfTheDay';
import RecipeApplePie  from './pages/RecipeApplePie';
import UserRecipe      from './pages/UserRecipe';

function PrivateRoute({ children }) {
  const { username } = useAuth();
  return username ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"                    element={<Home />} />
          <Route path="/our-kitchen"         element={<OurKitchen />} />
          <Route path="/history"             element={<History />} />
          <Route path="/meet-the-chefs"      element={<MeetTheChefs />} />
          <Route path="/login"               element={<Login />} />
          <Route path="/register"            element={<Register />} />
          <Route path="/profile"                      element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/recipe-of-the-day/:index"     element={<PrivateRoute><RecipeOfTheDay /></PrivateRoute>} />
          <Route path="/recipe/submitted/:id"         element={<PrivateRoute><UserRecipe /></PrivateRoute>} />
          <Route path="/recipes/apple-pie"            element={<RecipeApplePie />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
