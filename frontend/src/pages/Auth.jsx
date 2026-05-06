import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { login, register } from '../features/auth/authSlice';

export default function Auth({ mode }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { error, loading } = useSelector((state) => state.auth);
  const googleError = params.get('google_error');
  const isRegister = mode === 'register';
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', password_confirmation: '' });

  const submit = async (event) => {
    event.preventDefault();
    const action = isRegister ? register(form) : login({ email: form.email, password: form.password });
    const result = await dispatch(action);
    if (result.meta.requestStatus === 'fulfilled') {
      navigate(result.payload.user.role === 'admin' ? '/admin' : '/dashboard');
    }
  };

  const googleLogin = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8001';
    window.location.href = `${backendUrl}/api/auth/google/redirect`;
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto grid min-h-[calc(100vh-56px)] max-w-6xl items-center gap-8 px-4 py-8 md:grid-cols-[1fr_1fr]">
        <section className={`relative hidden min-h-[540px] overflow-hidden rounded-lg md:block ${isRegister ? 'md:order-2' : ''}`}>
          <img className="absolute inset-0 h-full w-full object-cover" src={isRegister ? 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=900&q=85' : 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?auto=format&fit=crop&w=900&q=85'} alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
          <div className="absolute bottom-10 left-8 max-w-sm text-white">
            <h1 className="text-4xl font-black leading-tight">Your Game.<br />Your Field.<br />Anytime.</h1>
            <p className="mt-5 text-sm leading-6 text-white/85">Book the best sports fields in your city with ease.</p>
          </div>
        </section>
        <form onSubmit={submit} className="mx-auto grid w-full max-w-md gap-3.5 rounded-lg border border-slate-200 bg-white p-8 shadow-soft">
          <div className="text-center">
            <h1 className="text-2xl font-black">{isRegister ? 'Create Account' : 'Welcome Back!'}</h1>
            <p className="mt-1 text-xs text-muted">{isRegister ? 'Join RENTSPOT today' : 'Login to your account'}</p>
          </div>
          {isRegister && <label className="text-xs font-semibold text-slate-600">Full Name<input className="input mt-2" placeholder="Anas Elidrissi" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>}
          <label className="text-xs font-semibold text-slate-600">Email<input className="input mt-2" placeholder="your@example.com" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
          {isRegister && <label className="text-xs font-semibold text-slate-600">Phone Number<input className="input mt-2" placeholder="+212 6 12 34 56 78" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>}
          <label className="text-xs font-semibold text-slate-600">Password<input className="input mt-2" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></label>
          {isRegister && <label className="text-xs font-semibold text-slate-600">Confirm Password<input className="input mt-2" placeholder="Confirm password" type="password" value={form.password_confirmation} onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })} required /></label>}
          {(error || googleError) && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error || googleError}</p>}
          {!isRegister && <div className="flex items-center justify-between text-xs text-muted"><label className="flex items-center gap-2"><input type="checkbox" /> Remember me</label><span>Forgot password?</span></div>}
          <button className="btn-primary" disabled={loading}>{loading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}</button>
          <div className="relative py-1 text-center text-xs text-slate-400 before:absolute before:left-0 before:top-1/2 before:h-px before:w-[38%] before:bg-slate-200 after:absolute after:right-0 after:top-1/2 after:h-px after:w-[38%] after:bg-slate-200">or continue with</div>
          <button type="button" onClick={googleLogin} className="btn-outline"><span className="font-black text-red-500">G</span> Continue with Google</button>
          <p className="text-center text-sm text-muted">
            {isRegister ? 'Already have an account?' : 'Need an account?'} <Link className="font-bold text-primary" to={isRegister ? '/login' : '/register'}>{isRegister ? 'Login' : 'Register'}</Link>
          </p>
        </form>
      </main>
    </>
  );
}
