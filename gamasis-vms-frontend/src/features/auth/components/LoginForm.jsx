import { useState } from 'react';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../api/axios';
import { useAuthStore } from '../../../store/authStore';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      const { usuario, token } = response.data;

      // Guardamos en el store global
      login(usuario, token);

      toast.success(`¡Bienvenido de nuevo, ${usuario.nombre}!`, {
        style: { background: '#0f172a', color: '#fff', border: '1px solid #1e293b' }
      });

      // ¡Al Dashboard!
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al conectar con el servidor';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm text-center">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">Correo</label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 text-slate-500" size={18} />
          <input
            type="email"
            required
            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="usuario@gamasis.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">Contraseña</label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 text-slate-500" size={18} />
          <input
            type={showPassword ? "text" : "password"}
            required
            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 pl-10 pr-10 text-white focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
      >
        {loading ? <Loader2 className="animate-spin" size={20} /> : <span>Ingresar al Sistema</span>}
      </button>
    </form>
  );
};

export default LoginForm;
