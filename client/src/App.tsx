import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Homee from './pages/Homee';
import AnalyseProject from './pages/AnalyseProject';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import AnalysedProjects from './pages/AnalysedProjects';
import Profile from './pages/Profile';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthStore } from './store/authStore';
import { apiFetch } from './lib/api';

const App = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const setAuthChecked = useAuthStore((state) => state.setAuthChecked);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await apiFetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setAuthChecked(true);
      }
    };

    initAuth();
  }, [setUser, setAuthChecked]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Homee />} />
        <Route path='/homee' element={<Homee />} />
        <Route
          path='/analyse'
          element={
            <ProtectedRoute>
              <AnalyseProject />
            </ProtectedRoute>
          }
        />
        <Route
          path='/dashboard'
          element={
            <ProtectedRoute requiredRole="STUDENT">
              <Homee />
            </ProtectedRoute>
          }
        />
        <Route
          path='/tpo-dashboard'
          element={
            <ProtectedRoute requiredRole="TPO">
              <Homee />
            </ProtectedRoute>
          }
        />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route
          path='/analysedprojects'
          element={
            <ProtectedRoute>
              <AnalysedProjects />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path='/unauthorized' element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;