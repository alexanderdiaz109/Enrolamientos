import { useState, useEffect } from 'react';
import api from '../../../api/axios';

export const useProyectos = () => {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProyectos = async () => {
    setLoading(true);
    try {
      const res = await api.get('/proyectos');
      setProyectos(res.data);
    } catch (error) {
      console.error("Error cargando proyectos", error);
    } finally {
      setLoading(false);
    }
  };

  const createProyecto = async (data) => {
    try {
      const res = await api.post('/proyectos', data);
      setProyectos([res.data, ...proyectos]);
      return { success: true, data: res.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  };

  const updateProyecto = async (id, data) => {
    try {
      await api.put(`/proyectos/${id}`, data);
      fetchProyectos();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  };

  useEffect(() => {
    fetchProyectos();
    const interval = setInterval(fetchProyectos, 15000); // Polling cada 15s
    return () => clearInterval(interval);
  }, []);

  return { proyectos, loading, createProyecto, fetchProyectos, updateProyecto };
};
