import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setGoogleSession } from '../features/auth/authSlice';

export default function GoogleCallback() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const token = params.get('token');
    const userParam = params.get('user');

    if (!token || !userParam) {
      navigate('/login');
      return;
    }

    try {
      const user = JSON.parse(atob(userParam));
      dispatch(setGoogleSession({ token, user }));
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (error) {
      navigate('/login?google_error=Google login response was invalid. Please try again.');
    }
  }, [dispatch, navigate, params]);

  return (
    <main className="grid min-h-screen place-items-center bg-page px-4">
      <div className="card p-6 text-center">
        <h1 className="text-2xl font-black">Signing you in...</h1>
        <p className="mt-2 text-muted">Please wait while RENTSPOT connects your Google account.</p>
      </div>
    </main>
  );
}
