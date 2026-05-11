import { LayoutDashboard, Box, History, Users, LogOut, FolderTree, Folder, BookOpen } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useProjectStore } from '../store/projectStore';
import { useProyectos } from '../features/proyectos/hooks/useProyectos';
import Avatar from './common/Avatar';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useState } from 'react';

const Sidebar = () => {
  const location = useLocation();
  const { user, login, logout } = useAuthStore();
  const { selectedProject, setSelectedProject } = useProjectStore();
  const { proyectos, fetchProyectos } = useProyectos();
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Si no hay proyectos cargados, cargarlos
    if (proyectos.length === 0) {
      fetchProyectos();
    }
  }, []);

  useEffect(() => {
    if (proyectos.length > 0) {
      const isValid = selectedProject && proyectos.some(p => p.id === selectedProject.id);
      if (!isValid) {
        setSelectedProject(proyectos[0]);
      }
    }
  }, [proyectos, selectedProject, setSelectedProject]);

  const handleProjectChange = (e) => {
    const projId = e.target.value;
    const proj = proyectos.find(p => p.id === projId);
    if (proj) setSelectedProject(proj);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    setUploading(true);
    const toastId = toast.loading('Subiendo foto...');

    try {
      const res = await api.post('/usuarios/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Actualizar el estado global con la nueva foto
      login({ ...user, foto_url: res.data.foto_url }, localStorage.getItem('token'));
      toast.success('Foto actualizada con éxito', { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error('Error al subir la imagen', { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
    { icon: <Folder size={20} />, label: 'Proyectos', path: '/proyectos' },
    { icon: <Box size={20} />, label: 'Módulos', path: '/modulos' },
    { icon: <History size={20} />, label: 'Versiones', path: '/versiones' },
    { icon: <BookOpen size={20} />, label: 'Documentación', path: '/docs' },
    { icon: <Users size={20} />, label: 'Usuarios', path: '/usuarios' },
  ];

  return (
    <div className="h-screen w-64 bg-slate-900 text-white flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-4 text-blue-400">
          <FolderTree size={24} />
          <h1 className="text-xl font-bold tracking-wider">VMS</h1>
        </div>
        
        {/* Selector de Proyecto */}
        <div className="mt-2">
          <label className="text-xs text-slate-500 uppercase font-semibold mb-1 block">Proyecto Activo</label>
          <select 
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2 text-sm focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
            value={selectedProject?.id || ''}
            onChange={handleProjectChange}
          >
            {proyectos.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
            {proyectos.length === 0 && <option value="">Cargando...</option>}
          </select>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              location.pathname === item.path
              ? 'bg-blue-600 text-white'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 flex flex-col gap-4">
        {user && (
          <div className="flex items-center gap-3 px-3">
            <div className="relative group cursor-pointer">
              <label htmlFor="avatar-upload" className={`cursor-pointer block ${uploading ? 'opacity-50' : ''}`}>
                <Avatar fotoUrl={user.foto_url} nombre={user.nombre} size="sm" />
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[8px] text-white font-bold uppercase tracking-wider text-center leading-tight">Subir</span>
                </div>
              </label>
              <input 
                id="avatar-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleAvatarUpload}
                disabled={uploading}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-200">{user.nombre}</span>
              <span className="text-[10px] text-slate-500 uppercase">{user.rol}</span>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center space-x-3 p-3 w-full text-slate-400 hover:text-red-400 transition-colors bg-slate-800/50 rounded-lg hover:bg-slate-800"
        >
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
