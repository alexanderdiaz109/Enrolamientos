import { UserPlus, Mail, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUsuarios } from '../features/usuarios/hooks/useUsuarios';
import { useAuthStore } from '../store/authStore';
import { useState } from 'react';
import Avatar from '../components/common/Avatar';

const Usuarios = () => {
  const { usuarios, loading, addUsuario, updateRole } = useUsuarios();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ nombre: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { user: currentUser } = useAuthStore();

  const handleRoleChange = async (userId, nuevoRol) => {
    if (userId === currentUser.id) {
      return toast.error("No puedes cambiar tu propio rango. Necesitas que otro Admin lo haga.");
    }

    const res = await updateRole(userId, nuevoRol);
    if (res.success) {
      toast.success(`Rol actualizado a ${nuevoRol.toUpperCase()}`);
    } else {
      toast.error(res.error || "Error al cambiar rol");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    const res = await addUsuario(newUser);
    if (res.success) {
      setIsModalOpen(false);
      setNewUser({ nombre: '', email: '', password: '' });
      toast.success('Nuevo integrante añadido al equipo', { icon: '👥' });
    } else {
      const msg = res.error || 'Error al crear el usuario. Revisa los datos.';
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Equipo de Desarrollo</h2>
          <p className="text-slate-500 text-sm">Gestiona los accesos al sistema VMS.</p>
        </div>
        {(currentUser?.rol?.toLowerCase() === 'admin' || currentUser?.rol?.toLowerCase() === 'administrador') && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-md transition-all"
          >
            <UserPlus size={20} /> Nuevo Integrante
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Nombre</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Email</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan="3" className="px-6 py-8 text-center text-slate-400">Cargando equipo...</td></tr>
            ) : usuarios.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar fotoUrl={user.foto_url} nombre={user.nombre} size="sm" />
                    <span className="font-medium text-slate-800">{user.nombre}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {(currentUser.rol?.toLowerCase() === 'admin' || currentUser.rol?.toLowerCase() === 'administrador') ? (
                    <div className="relative inline-block w-36">
                      <select
                        value={user.rol.toLowerCase()}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className={`w-full text-[10px] font-bold uppercase py-1.5 px-3 pr-6 rounded-full border-0 cursor-pointer outline-none appearance-none transition-all ring-1 ring-inset
                          ${(user.rol.toLowerCase() === 'admin' || user.rol.toLowerCase() === 'administrador')
                            ? 'bg-purple-50 text-purple-700 ring-purple-200 hover:bg-purple-100 hover:ring-purple-300 shadow-sm shadow-purple-100/50' 
                            : 'bg-slate-50 text-slate-600 ring-slate-200 hover:bg-slate-100 hover:ring-slate-300'}`}
                      >
                        <option value="developer">Developer</option>
                        <option value="admin">Administrador</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                        <svg className={`h-3 w-3 ${(user.rol.toLowerCase() === 'admin' || user.rol.toLowerCase() === 'administrador') ? 'text-purple-500' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <span className={`px-2 py-1.5 rounded-full text-[10px] font-bold uppercase ring-1 ring-inset inline-block text-center min-w-[80px]
                      ${(user.rol.toLowerCase() === 'admin' || user.rol.toLowerCase() === 'administrador') ? 'bg-purple-50 text-purple-700 ring-purple-200' : 'bg-slate-50 text-slate-600 ring-slate-200'}`}>
                      {user.rol}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para Nuevo Usuario */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Registrar Desarrollador</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                <input
                  required
                  className="w-full border border-slate-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
                  value={newUser.nombre}
                  onChange={(e) => setNewUser({...newUser, nombre: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Institucional</label>
                <input
                  required
                  type="email"
                  className="w-full border border-slate-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña Temporal</label>
                <input
                  required
                  type="password"
                  className="w-full border border-slate-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                />
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600">Cancelar</button>
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">Crear Acceso</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;
