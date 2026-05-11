import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Interceptor para añadir el Token en cada petición automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar respuestas 401 (Token expirado/inválido)
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 y no es una petición de login o del propio refresh
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/')) {
      if (isRefreshing) {
        // Si ya se está refrescando, poner la petición en espera
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token');

        // Intentar renovar el token usando axios sin interceptores para evitar bucles
        const response = await axios.post('http://localhost:3000/api/auth/refresh', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const newToken = response.data.token;
        localStorage.setItem('token', newToken);
        if (response.data.usuario) {
            localStorage.setItem('user', JSON.stringify(response.data.usuario));
        }

        api.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;
        originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
        
        processQueue(null, newToken);
        
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        // Si la renovación falla, el token es definitivamente inválido.
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirigir al login usando window.location (esto forzará recarga del estado en la app)
        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
