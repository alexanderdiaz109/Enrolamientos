import { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { useProjectStore } from '../../../store/projectStore';

export const useDocs = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const selectedProject = useProjectStore((state) => state.selectedProject);

  const fetchDocs = async () => {
    if (!selectedProject) { setDocs([]); return; }
    setLoading(true);
    try {
      const res = await api.get('/docs', { params: { id_proyecto: selectedProject.id } });
      setDocs(res.data);
    } catch (error) {
      console.error('Error al obtener documentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const subirDoc = async (formData) => {
    if (!selectedProject) return { success: false, error: 'No hay proyecto seleccionado' };
    setUploading(true);
    try {
      formData.append('id_proyecto', selectedProject.id);
      formData.append('nombre_proyecto', selectedProject.nombre);
      const res = await api.post('/docs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await fetchDocs();
      return { success: true, data: res.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || error.message };
    } finally {
      setUploading(false);
    }
  };

  const eliminarDoc = async (id) => {
    try {
      await api.delete(`/docs/${id}`);
      setDocs((prev) => prev.filter((d) => d.id !== id));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  };

  useEffect(() => { 
    fetchDocs(); 
    const interval = setInterval(fetchDocs, 15000); // Polling cada 15s
    return () => clearInterval(interval);
  }, [selectedProject]);

  return { docs, loading, uploading, subirDoc, eliminarDoc, refresh: fetchDocs };
};
