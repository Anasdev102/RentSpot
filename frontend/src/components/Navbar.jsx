import { LogOut, Menu, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import UserNotifications from './UserNotifications';

const linkClass = ({ isActive }) =>
  `text-[11px] font-semibold transition ${isActive ? 'text-primary' : 'text-slate-700 hover:text-primary'}`;

const smoothScrollTo = (sectionId) => {
  const target = document.getElementById(sectionId);

  if (!target) {
    return;
  }

  const headerOffset = 84;
  const start = window.scrollY;
  const targetPosition = target.getBoundingClientRect().top + start - headerOffset;
  const distance = targetPosition - start;
  const duration = 1050;
  const startedAt = performance.now();
  const easeInOut = (progress) => (progress < 0.5 ? 4 * progress ** 3 : 1 - ((-2 * progress + 2) ** 3) / 2);

  const animate = (now) => {
    const elapsed = now - startedAt;
    const progress = Math.min(elapsed / duration, 1);

    window.scrollTo(0, start + distance * easeInOut(progress));

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};

export default function Navbar() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { t } = useLanguage();
  const dashboardPath = user?.role === 'admin' ? '/admin' : '/dashboard';

  const scrollToSection = (sectionId) => {
    setOpen(false);

    if (location.pathname !== '/') {
      navigate('/', { state: { scrollToSection: sectionId } });
      return;
    }

    if (location.hash !== `#${sectionId}`) {
      window.history.pushState(null, '', `#${sectionId}`);
    }
    smoothScrollTo(sectionId);
  };

  useEffect(() => {
    const sectionId = location.state?.scrollToSection || location.hash.slice(1);

    if (location.pathname === '/' && sectionId) {
      setTimeout(() => {
        window.history.replaceState(null, '', `#${sectionId}`);
        smoothScrollTo(sectionId);
      }, 320);
    }
  }, [location.pathname, location.hash, location.state]);

  const sectionLinkClass = 'text-[11px] font-semibold text-slate-700 transition hover:text-primary';

  const signOut = async () => {
    setOpen(false);
    await dispatch(logout());
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5">
        <Link to="/" className="text-base font-black tracking-tight">
          <span><span className="text-primary">RENT</span><span className="text-secondary">SPOT</span></span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={linkClass}>{t('nav.home')}</NavLink>
          <NavLink to="/stadiums" className={linkClass}>{t('nav.stadiums')}</NavLink>
          <button type="button" onClick={() => scrollToSection('how')} className={sectionLinkClass}>{t('nav.how')}</button>
          <button type="button" onClick={() => scrollToSection('about')} className={sectionLinkClass}>{t('nav.about')}</button>
          <button type="button" onClick={() => scrollToSection('contact')} className={sectionLinkClass}>{t('nav.contact')}</button>
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          {user ? (
            <>
              <UserNotifications isAdmin={user.role === 'admin'} />
              <Link to={dashboardPath} className="grid h-7 w-7 place-items-center rounded-full bg-slate-100 text-primary"><UserRound size={15} /></Link>
              <button type="button" onClick={signOut} className="grid h-7 w-7 place-items-center rounded-full bg-red-50 text-red-600 transition hover:bg-red-100" aria-label="Logout">
                <LogOut size={14} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-md bg-primary px-3.5 py-1.5 text-[11px] font-bold text-white transition hover:bg-blue-700">{t('nav.login')}</Link>
            </>
          )}
        </div>
        <button className="rounded-lg p-2 text-primary md:hidden" onClick={() => setOpen(!open)} aria-label="Open menu">
          <Menu />
        </button>
      </div>
      {open && (
        <div className="panel-pop border-t border-black/5 bg-white px-4 pb-4 md:hidden">
          <div className="grid gap-3">
            <LanguageSwitcher />
            <Link to="/" onClick={() => setOpen(false)}>{t('nav.home')}</Link>
            <Link to="/stadiums" onClick={() => setOpen(false)}>{t('nav.stadiums')}</Link>
            <button type="button" onClick={() => scrollToSection('how')} className="text-left">{t('nav.how')}</button>
            <button type="button" onClick={() => scrollToSection('about')} className="text-left">{t('nav.about')}</button>
            <button type="button" onClick={() => scrollToSection('contact')} className="text-left">{t('nav.contact')}</button>
            <Link to={user ? dashboardPath : '/login'} onClick={() => setOpen(false)}>{user ? t('nav.dashboard') : t('nav.login')}</Link>
            {user && <button type="button" onClick={signOut} className="flex items-center gap-2 text-left text-red-600"><LogOut size={16} /> {t('nav.logout')}</button>}
          </div>
        </div>
      )}
    </header>
  );
}
