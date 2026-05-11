import { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { useProjectStore } from '../../../store/projectStore';

export const useModulos = () => {
  const [modulos, setModulos] = useState([]);
  const [loading, setLoading] = useState(false);
  const selectedProject = useProjectStore((state) => state.selectedProject);

  const fetchModulos = async () => {
    setLoading(true);
    try {
      // Si no hay proyecto seleccionado, no cargamos módulos
      if (!selectedProject) {
        setModulos([]);
        return;
      }
      const res = await api.get('/modulos', { params: { id_proyecto: selectedProject.id } });
      setModulos(res.data);
    } catch (error) {
      console.error("Error al obtener módulos", error);
    } finally {
      setLoading(false);
    }
  };

  const createModulo = async (data) => {
    try {
      if (!selectedProject) throw new Error("No hay proyecto seleccionado");
      
      const payload = { ...data, id_proyecto: selectedProject.id };
      const res = await api.post('/modulos', payload);
      setModulos((prev) => [...prev, res.data]);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  };

  useEffect(() => {
    fetchModulos();
    const interval = setInterval(fetchModulos, 15000); // Polling cada 15s
    return () => clearInterval(interval);
  }, [selectedProject]);

  return { modulos, loading, createModulo, refresh: fetchModulos };
};
