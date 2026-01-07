import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { CreateSnippet } from './pages/CreateSnippet';
import { Profile } from './pages/Profile';
import { AdminDashboard } from './pages/AdminDashboard';
import { useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

const PrivateRoute = ({ children, adminOnly = false, allowedRoles = [] }: { children: React.ReactElement; adminOnly?: boolean; allowedRoles?: string[] }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;

  if (adminOnly && user?.role !== 'admin') return <Navigate to="/" />;

  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export const App = () => {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/create" element={<PrivateRoute adminOnly={false} allowedRoles={['admin', 'editor']}><CreateSnippet /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
        </Routes>
      </div>
    </ToastProvider>
  );
};

export default App;
