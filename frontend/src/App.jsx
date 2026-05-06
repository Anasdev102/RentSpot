import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminCrud from './pages/admin/AdminCrud';
import AdminDashboard from './pages/admin/AdminDashboard';
import ContactMessages from './pages/admin/ContactMessages';
import Auth from './pages/Auth';
import Checkout from './pages/Checkout';
import GoogleCallback from './pages/GoogleCallback';
import Home from './pages/Home';
import StadiumDetails from './pages/StadiumDetails';
import Stadiums from './pages/Stadiums';
import Dashboard from './pages/user/Dashboard';

function ScrollManager() {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollToSection) {
      return;
    }

    if (location.hash) {
      window.setTimeout(() => {
        document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname, location.hash]);

  return null;
}

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollManager />
      <div key={isAdminRoute ? 'admin' : location.pathname} className={isAdminRoute ? undefined : 'route-transition'}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/stadiums" element={<Stadiums />} />
          <Route path="/stadiums/:id" element={<StadiumDetails />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/register" element={<Auth mode="register" />} />
          <Route path="/auth/google/callback" element={<GoogleCallback />} />

          <Route element={<ProtectedRoute role="user" />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/checkout" element={<Checkout />} />
          </Route>

          <Route element={<ProtectedRoute role="admin" />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="sports" element={<AdminCrud resource="sports" />} />
              <Route path="stadiums" element={<AdminCrud resource="stadiums" />} />
              <Route path="reservations" element={<AdminCrud resource="reservations" />} />
              <Route path="payments" element={<AdminCrud resource="payments" />} />
              <Route path="users" element={<AdminCrud resource="users" />} />
              <Route path="reviews" element={<AdminCrud resource="reviews" />} />
              <Route path="contact-messages" element={<ContactMessages />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </>
  );
}
