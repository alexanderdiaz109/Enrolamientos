// Llamadas a la API de Versiones
import api from '../axios';

export const getVersionesByModulo = (id_modulo) => api.get(`/versiones/modulo/${id_modulo}`);
export const createVersion = (data) => api.post('/versiones', data);
