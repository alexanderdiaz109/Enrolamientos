import { useState } from 'react';
import {
  BookOpen, FileText, Image, Trash2,
  Plus, Calendar, User, Loader2, FolderOpen,
  LayoutGrid, PanelLeftOpen
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useDocs } from '../features/docs/hooks/useDocs';
import { useAuthStore } from '../store/authStore';
import { useProjectStore } from '../store/projectStore';
import DocViewer from '../components/docs/DocViewer';
import DocGallery from '../components/docs/DocGallery';
import UploadDocModal from '../components/docs/UploadDocModal';

// Mapeo de categorías para la sidebar
const CATEGORIAS = {
  pdf:         { label: 'Manuales PDF',      icon: <FileText size={14} />, color: 'text-red-500',    bg: 'bg-red-50    border-red-100'    },
  imagen:      { label: 'Diagramas',          icon: <Image    size={14} />, color: 'text-blue-500',   bg: 'bg-blue-50   border-blue-100'   },
  flujo:       { label: 'Flujos de Proceso',  icon: <Image    size={14} />, color: 'text-indigo-500', bg: 'bg-indigo-50 border-indigo-100' },
  arquitectura:{ label: 'Arquitectura',       icon: <Image    size={14} />, color: 'text-purple-500', bg: 'bg-purple-50 border-purple-100' },
  archivo:     { label: 'Otros archivos',     icon: <FileText size={14} />, color: 'text-slate-500',  bg: 'bg-slate-50  border-slate-100'  },
};

const Documentacion = () => {
  const { docs, loading, eliminarDoc } = useDocs();
  const { user } = useAuthStore();
  const { selectedProject } = useProjectStore();

  const [docActivo, setDocActivo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  // 'galeria' | 'visor'
  const [vista, setVista] = useState('galeria');

  const isAdmin = user?.rol?.toLowerCase() === 'admin' || user?.rol?.toLowerCase() === 'administrador';

  const docsFiltrados = filtroCategoria === 'todos'
    ? docs
    : docs.filter((d) => d.tipo === filtroCategoria);

  const handleEliminar = async (doc) => {
    const res = await eliminarDoc(doc.id);
    if (res.success) {
      toast.success(`"${doc.titulo}" eliminado`);
      if (docActivo?.id === doc.id) setDocActivo(null);
    } else {
      toast.error('Error al eliminar');
    }
  };

  // Abrir en vista Visor al hacer clic en tarjeta de galería
  const handleOpenViewer = (doc) => {
    setDocActivo(doc);
    setVista('visor');
  };

  return (
    <div className="flex flex-col h-full space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen size={26} className="text-blue-600" />
            Central de Documentación
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">
            {selectedProject ? `Proyecto: ${selectedProject.nombre}` : 'Selecciona un proyecto'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Toggle de vista */}
          <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
            <button
              onClick={() => setVista('galeria')}
              title="Vista galería"
              className={`p-2 rounded-lg transition-all ${vista === 'galeria' ? 'bg-white shadow text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LayoutGrid size={17} />
            </button>
            <button
              onClick={() => setVista('visor')}
              title="Vista visor"
              className={`p-2 rounded-lg transition-all ${vista === 'visor' ? 'bg-white shadow text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <PanelLeftOpen size={17} />
            </button>
          </div>

          {isAdmin && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-700 shadow-md shadow-blue-200 transition-all font-semibold"
            >
              <Plus size={18} /> Subir Documento
            </button>
          )}
        </div>
      </div>

      {/* Filtros de categoría */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'todos', label: 'Todos' },
          ...Object.entries(CATEGORIAS).map(([k, v]) => ({ key: k, label: v.label }))
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFiltroCategoria(key)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
              ${filtroCategoria === key
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-600'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Contenido principal — cambia según la vista */}
      {loading ? (
        <div className="flex items-center justify-center py-24 text-slate-400">
          <Loader2 size={28} className="animate-spin" />
        </div>
      ) : vista === 'galeria' ? (
        /* ── VISTA GALERÍA ── */
        <div className="flex-1 overflow-y-auto">
          <DocGallery
            documentos={docsFiltrados}
            onOpenViewer={handleOpenViewer}
            onDelete={handleEliminar}
            isAdmin={isAdmin}
          />
        </div>
      ) : (
        /* ── VISTA VISOR (sidebar + panel) ── */
        <div className="flex gap-5 flex-1 min-h-0">

          {/* Sidebar de documentos */}
          <div className="w-72 flex-shrink-0 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-y-auto">
            {docsFiltrados.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-300 gap-2 px-4 text-center">
                <FolderOpen size={36} strokeWidth={1} />
                <p className="text-slate-400 text-sm font-medium">
                  {docs.length === 0 ? 'Aún no hay documentos.' : 'No hay docs en esta categoría.'}
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {docsFiltrados.map((doc) => {
                  const cat = CATEGORIAS[doc.tipo] || CATEGORIAS.archivo;
                  const isActive = docActivo?.id === doc.id;
                  return (
                    <li key={doc.id}>
                      <button
                        onClick={() => setDocActivo(doc)}
                        className={`w-full text-left p-4 transition-colors group relative
                          ${isActive ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                      >
                        {/* Badge tipo */}
                        <div className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border mb-1.5 ${cat.color} ${cat.bg}`}>
                          {cat.icon} {cat.label}
                        </div>
                        <p className={`text-sm font-semibold leading-snug truncate ${isActive ? 'text-blue-700' : 'text-slate-700'}`}>
                          {doc.titulo}
                        </p>
                        {doc.descripcion && (
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{doc.descripcion}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400">
                          <span className="flex items-center gap-1"><Calendar size={10} />{new Date(doc.creado_en).toLocaleDateString()}</span>
                          {doc.nombre_autor && <span className="flex items-center gap-1"><User size={10} />{doc.nombre_autor}</span>}
                        </div>

                        {isAdmin && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleEliminar(doc); }}
                            className="absolute top-3 right-3 p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all"
                            title="Eliminar"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Panel visor */}
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 overflow-auto min-h-[500px]">
            <DocViewer doc={docActivo} />
          </div>
        </div>
      )}

      {/* Modal de subida */}
      <UploadDocModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Documentacion;
