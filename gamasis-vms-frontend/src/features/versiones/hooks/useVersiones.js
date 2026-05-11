import { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { useProjectStore } from '../../../store/projectStore';

export const useVersiones = () => {
  const [versiones, setVersiones] = useState([]);
  const [loading, setLoading] = useState(false);
  const selectedProject = useProjectStore((state) => state.selectedProject);

  const fetchVersiones = async () => {
    setLoading(true);
    try {
      if (!selectedProject) {
        setVersiones([]);
        return;
      }
      const res = await api.get('/versiones', { params: { id_proyecto: selectedProject.id } }); 
      setVersiones(res.data);
    } catch (error) {
      console.error("Error al obtener versiones", error);
    } finally {
      setLoading(false);
    }
  };

  const createVersion = async (data) => {
    try {
      const res = await api.post('/versiones', data);
      setVersiones((prev) => [res.data, ...prev]);
      return { success: true, data: res.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  };

  // Crea una versión con archivo subido a Supabase Storage
  const createKitVersion = async (formData) => {
    try {
      // Incluir nombre del proyecto activo en el formData para organizar carpetas
      if (selectedProject) {
        formData.append('id_proyecto', selectedProject.id);
        formData.append('nombre_proyecto', selectedProject.nombre);
      }
      const res = await api.post('/versiones/kit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await fetchVersiones(); // Recargar lista
      return { success: true, data: res.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || error.message };
    }
  };

  useEffect(() => {
    fetchVersiones();
    const interval = setInterval(fetchVersiones, 15000); // Polling cada 15s
    return () => clearInterval(interval);
  }, [selectedProject]);

  return { versiones, loading, createVersion, createKitVersion, refresh: fetchVersiones };
};
