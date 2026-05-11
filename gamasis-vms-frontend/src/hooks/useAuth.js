// Hook personalizado para gestionar autenticación
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { loginApi } from '../api/auth.api';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login, logout, isAuthenticated, user } = useAuthStore();

  const handleLogin = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await loginApi({ email, password });
      login(data.usuario, data.token);
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Error de autenticación');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, logout, isAuthenticated, user, loading, error };
};
