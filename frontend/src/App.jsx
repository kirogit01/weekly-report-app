import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyReportsPage from './pages/MyReportsPage';
import TeamDashboardPage from './pages/TeamDashboardPage';
import ProjectsPage from './pages/ProjectsPage';

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/my-reports"
        element={
          <ProtectedRoute>
            <MyReportsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['manager']}>
            <TeamDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects"
        element={
          <ProtectedRoute allowedRoles={['manager']}>
            <ProjectsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/"
        element={<Navigate to={user ? (user.role === 'manager' ? '/dashboard' : '/my-reports') : '/login'} replace />}
      />
    </Routes>
  );
}

export default App;
