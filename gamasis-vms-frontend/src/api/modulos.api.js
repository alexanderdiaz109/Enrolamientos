// Llamadas a la API de Módulos
import api from '../axios';

export const getModulos = () => api.get('/modulos');
export const createModulo = (data) => api.post('/modulos', data);
