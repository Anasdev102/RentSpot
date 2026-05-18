import { useEffect, useState } from 'react';
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
      }, 360);
      return;
    }

    const timeout = window.setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 240);

    return () => window.clearTimeout(timeout);
  }, [location.pathname, location.hash]);

  return null;
}

function AppRoutes({ location }) {
  return (
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
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [stage, setStage] = useState('route-enter');

  useEffect(() => {
    const sameRoute = displayLocation.pathname === location.pathname && displayLocation.search === location.search && displayLocation.hash === location.hash;

    if (sameRoute) {
      return undefined;
    }

    setStage('route-exit');

    const timeout = window.setTimeout(() => {
      setDisplayLocation(location);
      setStage('route-enter');
    }, 240);

    return () => window.clearTimeout(timeout);
  }, [displayLocation, location]);

  return (
    <div className={`route-transition-shell ${stage}`}>
      <AppRoutes location={displayLocation} />
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <AnimatedRoutes />
    </>
  );
}
