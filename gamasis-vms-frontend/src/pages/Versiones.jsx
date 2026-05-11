import { useState } from 'react';
import { Plus, History, Calendar, User, Search, FileX, Building2, Package, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { useVersiones } from '../features/versiones/hooks/useVersiones';
import VersionForm from '../features/versiones/components/VersionForm';

const Versiones = () => {
  const { versiones, loading, createKitVersion } = useVersiones();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedParams, setExpandedParams] = useState({});
  const [uploading, setUploading] = useState(false);

  const toggleParams = (id) => setExpandedParams(prev => ({ ...prev, [id]: !prev[id] }));

  const copiarEnlace = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('¡Enlace copiado! Ya puedes enviarlo al cliente.');
  };

  const handleCreate = async (formData) => {
    setUploading(true);
    const toastId = toast.loading(formData.has('archivo') ? 'Subiendo Kit al repositorio...' : 'Registrando versión...');
    const res = await createKitVersion(formData);
    setUploading(false);
    if (res.success) {
      setIsModalOpen(false);
      toast.success(
        res.data?.cliente
          ? `Kit v${res.data.numero_version} para ${res.data.cliente} liberado ✅`
          : 'Nueva versión liberada con éxito 🚀',
        { id: toastId }
      );
    } else {
      toast.error(res.error || 'Error al liberar la versión', { id: toastId });
    }
  };

  // Lógica de filtrado en tiempo real
  const versionesFiltradas = versiones.filter((v) => {
    const busqueda = searchTerm.toLowerCase();
    return (
      v.nombre_modulo?.toLowerCase().includes(busqueda) ||
      v.numero_version?.toLowerCase().includes(busqueda) ||
      v.comentarios_cambios?.toLowerCase().includes(busqueda) ||
      v.cliente?.toLowerCase().includes(busqueda)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Historial de Versiones</h2>
          <p className="text-slate-500 text-sm">Control de cambios y liberaciones de BioMatcher.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
        >
          <Plus size={20} /> Nueva Versión
        </button>
      </div>

      {/* BARRA DE BÚSQUEDA */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Buscar por módulo, versión o cambios..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {loading ? (
          <p className="text-center py-10 text-slate-400 font-medium">Sincronizando historial...</p>
        ) : versionesFiltradas.length > 0 ? (
          versionesFiltradas.map((v) => (
            <div key={v.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 transition-all shadow-sm group">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-bold uppercase">
                      {v.numero_version}
                    </span>
                    {v.es_kit_distribucion && (
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs font-bold uppercase flex items-center gap-1">
                        <Package size={10} /> Kit
                      </span>
                    )}
                    <h3 className="font-bold text-slate-800 text-lg">
                      {v.nombre_modulo || 'Módulo Desconocido'}
                    </h3>
                  </div>
                  <p className="text-slate-600 text-sm">{v.comentarios_cambios}</p>
                  {v.cliente && (
                    <div className="flex items-center flex-wrap gap-1.5 mt-1">
                      <Building2 size={12} className="text-slate-400" />
                      {v.cliente.split(',').map((c, i) => (
                        <span key={i} className="px-2 py-0.5 bg-indigo-50/70 text-indigo-700 border border-indigo-100 rounded text-xs font-medium">
                          {c.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="text-right text-xs text-slate-400 space-y-1 ml-auto">
                  <div className="flex items-center justify-end gap-1 font-medium italic">
                    <Calendar size={12}/> 
                    {v.creado_en ? new Date(v.creado_en).toLocaleDateString() : '---'}
                  </div>
                  <div className="flex items-center justify-end gap-1 font-medium">
                    <User size={12}/> 
                    {v.nombre_usuario || 'Sistema'}
                  </div>
                </div>
              </div>

              {/* Parámetros Técnicos (JSONB) */}
              {v.parametros_tecnicos && Object.keys(v.parametros_tecnicos).length > 0 && (
                <div className="mt-3">
                  <button
                    onClick={() => toggleParams(v.id)}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-600 transition-colors font-medium"
                  >
                    {expandedParams[v.id] ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
                    Ver configuración del kit
                  </button>
                  {expandedParams[v.id] && (
                    <pre className="mt-2 bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 font-mono overflow-x-auto">
                      {JSON.stringify(v.parametros_tecnicos, null, 2)}
                    </pre>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                <div className="text-xs text-slate-400 font-mono">
                  Branch: <span className="text-slate-600">{v.ubicacion_cambios}</span>
                </div>
                <div className="flex items-center gap-2">
                  {v.url_descarga && (
                    <button
                      onClick={() => copiarEnlace(v.url_descarga)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="Copiar enlace para el cliente"
                    >
                      <Copy size={14} />
                    </button>
                  )}
                  {v.url_descarga && (
                    <a 
                      href={v.url_descarga} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors shadow-sm flex items-center gap-2"
                    >
                      Descargar Componente
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          /* ESTADO VACÍO CUANDO NO HAY RESULTADOS */
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <FileX size={48} className="text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">No se encontraron versiones con esa búsqueda.</p>
            <button onClick={() => setSearchTerm('')} className="text-blue-600 text-sm mt-2 hover:underline">
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl animate-in zoom-in duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><History size={24}/></div>
              <h3 className="text-2xl font-bold text-slate-900">Nueva Versión</h3>
            </div>
            <VersionForm onSubmit={handleCreate} onCancel={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Versiones;
