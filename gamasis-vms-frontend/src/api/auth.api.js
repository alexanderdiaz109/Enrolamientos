// Llamadas a la API de Autenticación
import api from '../axios';

export const loginApi = (credentials) => api.post('/auth/login', credentials);
export const registerApi = (data) => api.post('/usuarios', data);
