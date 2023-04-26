import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '~/features';

export function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: pathname } });
    }
  }, [user, navigate, pathname]);

  if (!user) {
    return null;
  }

  return children;
}
