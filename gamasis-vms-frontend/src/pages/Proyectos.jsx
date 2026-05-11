import { FolderPlus, Folder, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useProyectos } from '../features/proyectos/hooks/useProyectos';
import { useAuthStore } from '../store/authStore';

const Proyectos = () => {
  const { proyectos, loading, createProyecto, fetchProyectos, updateProyecto } = useProyectos();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ nombre: '', descripcion: '' });
  const user = useAuthStore((state) => state.user);
  
  // Estados para el menú y edición/eliminación
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [editFormData, setEditFormData] = useState({ nombre: '', descripcion: '' });

  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await createProyecto(newProject);

    if (res.success) {
      toast.success('Proyecto creado con éxito');
      setIsModalOpen(false);
      setNewProject({ nombre: '', descripcion: '' });
    } else {
      toast.error(res.error || 'No se pudo crear el proyecto');
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/proyectos/${projectToDelete.id}`);
      toast.success(`Proyecto "${projectToDelete.nombre}" eliminado`);
      setProjectToDelete(null);
      fetchProyectos();
    } catch (err) {
      toast.error('Error al intentar eliminar el proyecto');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const res = await updateProyecto(projectToEdit.id, editFormData);
    if (res.success) {
      toast.success('Proyecto actualizado con éxito');
      setProjectToEdit(null);
    } else {
      toast.error(res.error || 'Error al actualizar el proyecto');
    }
  };

  const isAdmin = user?.rol?.toLowerCase() === 'admin' || user?.rol?.toLowerCase() === 'administrador';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestión de Proyectos</h2>
          <p className="text-slate-500 text-sm">Administra los productos de software de la empresa.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-md transition-all"
        >
          <FolderPlus size={20} /> Nuevo Proyecto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400">Cargando proyectos...</div>
        ) : proyectos.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400">No hay proyectos registrados.</div>
        ) : (
          proyectos.map((p) => (
            <div key={p.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Folder size={24} />
                </div>
                
                {/* Contenedor del Menú */}
                <div className="relative">
                  <button 
                    onClick={() => setActiveMenuId(activeMenuId === p.id ? null : p.id)}
                    className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
                  >
                    <MoreVertical size={20} />
                  </button>

                  {activeMenuId === p.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-10 py-2 animate-in fade-in zoom-in duration-100">
                      <button 
                        onClick={() => {
                          setEditFormData({ nombre: p.nombre, descripcion: p.descripcion });
                          setProjectToEdit(p);
                          setActiveMenuId(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Edit2 size={14} /> Editar Proyecto
                      </button>
                      {isAdmin && (
                        <button 
                          onClick={() => {
                            setProjectToDelete(p);
                            setActiveMenuId(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 size={14} /> Eliminar Proyecto
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <h3 className="font-bold text-lg text-slate-900">{p.nombre}</h3>
              <p className="text-slate-500 text-sm mt-1 line-clamp-2">{p.descripcion}</p>
            </div>
          ))
        )}
      </div>

      {/* Modal de Creación */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Crear Nuevo Proyecto</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Proyecto</label>
                <input
                  required
                  className="w-full border border-slate-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Detector de movimiento"
                  value={newProject.nombre}
                  onChange={(e) => setNewProject({ ...newProject, nombre: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                <textarea
                  className="w-full border border-slate-300 rounded-lg p-2 h-24 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Describe brevemente el software..."
                  value={newProject.descripcion}
                  onChange={(e) => setNewProject({ ...newProject, descripcion: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600">Cancelar</button>
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all">Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {projectToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">¿Eliminar proyecto?</h3>
              <p className="text-sm text-slate-500 mt-2">
                Esta acción es permanente. Se borrarán todos los <b>módulos</b> y <b>versiones</b> asociados a <b>{projectToDelete.nombre}</b>.
              </p>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setProjectToDelete(null)}
                className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edición */}
      {projectToEdit && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Editar Proyecto</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Proyecto</label>
                <input
                  required
                  className="w-full border border-slate-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
                  value={editFormData.nombre}
                  onChange={(e) => setEditFormData({ ...editFormData, nombre: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                <textarea
                  className="w-full border border-slate-300 rounded-lg p-2 h-24 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  value={editFormData.descripcion}
                  onChange={(e) => setEditFormData({ ...editFormData, descripcion: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setProjectToEdit(null)} className="px-4 py-2 text-slate-600">Cancelar</button>
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all">Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Proyectos;
