import { Plus, Box, MoreVertical, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useModulos } from '../features/modulos/hooks/useModulos';
import { useProjectStore } from '../store/projectStore';
import ModuloForm from '../features/modulos/components/ModuloForm';

const Modulos = () => {
  const { modulos, loading, createModulo } = useModulos();
  const { selectedProject } = useProjectStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreate = async (data) => {
    const res = await createModulo(data);
    if (res.success) {
      setIsModalOpen(false);
      toast.success('Módulo registrado correctamente');
    } else {
      toast.error(res.error || 'No se pudo registrar el módulo');
    }
  };

  const handleOpenModal = () => {
    if (!selectedProject) {
      toast.error('Selecciona un proyecto en el menú lateral primero', { icon: '⚠️' });
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Módulos del Sistema</h2>
          <p className="text-slate-500 text-sm">Gestiona los componentes de software registrados.</p>
        </div>
        <button
          onClick={handleOpenModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all shadow-sm"
        >
          <Plus size={20} /> Nuevo Módulo
        </button>
      </div>

      {/* Aviso si no hay proyecto seleccionado */}
      {!selectedProject && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-4 py-3 text-sm">
          <AlertTriangle size={18} className="flex-shrink-0" />
          <span>Selecciona un <strong>proyecto</strong> en el menú lateral para ver y crear módulos.</span>
        </div>
      )}

      {/* Tabla de Módulos */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Módulo</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Descripción</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="3" className="px-6 py-10 text-center text-slate-400">
                  Cargando módulos...
                </td>
              </tr>
            ) : modulos.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-6 py-10 text-center text-slate-400">
                  No hay módulos registrados aún.
                </td>
              </tr>
            ) : (
              modulos.map((modulo) => (
                <tr key={modulo.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Box size={18} />
                      </div>
                      <span className="font-semibold text-slate-800">{modulo.nombre}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">
                    {modulo.descripcion || '—'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-slate-600 p-1 rounded transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Registrar Nuevo Módulo</h3>
            <ModuloForm onSubmit={handleCreate} onCancel={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Modulos;
