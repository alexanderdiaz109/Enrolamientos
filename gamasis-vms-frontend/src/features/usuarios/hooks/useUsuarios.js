import { useState, useEffect } from 'react';
import api from '../../../api/axios';

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const res = await api.get('/usuarios');
      setUsuarios(res.data);
    } catch (error) {
      console.error("Error cargando usuarios", error);
    } finally {
      setLoading(false);
    }
  };

  const addUsuario = async (data) => {
    try {
      await api.post('/usuarios', data);
      fetchUsuarios();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  };

  const updateRole = async (userId, nuevoRol) => {
    try {
      await api.patch(`/usuarios/${userId}/rol`, { rol: nuevoRol });
      fetchUsuarios();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  };

  useEffect(() => {
    fetchUsuarios();
    const interval = setInterval(fetchUsuarios, 15000); // Polling cada 15s
    return () => clearInterval(interval);
  }, []);

  return { usuarios, loading, addUsuario, updateRole };
};
