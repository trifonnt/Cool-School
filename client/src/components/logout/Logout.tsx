import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from 'use-http';
import { useAuthContext } from '../../contexts/AuthContext';

export default function Logout() {
  const { logoutUser } = useAuthContext();
  const navigate = useNavigate();

  const { loading } = useFetch(
    `${process.env.REACT_APP_API_URL}/auth/logout`,
    []
  );

  useEffect(() => {
    if (!loading) {
      logoutUser();
      navigate('/');
    }
  }, [loading]);

  return <p>Logging out...</p>;
}
