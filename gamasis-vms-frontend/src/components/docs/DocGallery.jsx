import { FileText, Map, Layout, ExternalLink, Trash2, Copy, FolderOpen, FileCheck } from 'lucide-react';
import toast from 'react-hot-toast';

// Config visual por tipo de documento
const TIPO_CONFIG = {
  pdf: {
    icon: <FileText size={32} />,
    iconColor: 'text-red-500',
    bg: 'bg-red-50',
    border: 'border-red-100',
    badge: 'bg-red-100 text-red-600',
    label: 'Manual PDF',
  },
  flujo: {
    icon: <Map size={32} />,
    iconColor: 'text-green-500',
    bg: 'bg-green-50',
    border: 'border-green-100',
    badge: 'bg-green-100 text-green-700',
    label: 'Flujo de Proceso',
  },
  arquitectura: {
    icon: <Layout size={32} />,
    iconColor: 'text-purple-500',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    badge: 'bg-purple-100 text-purple-700',
    label: 'Arquitectura',
  },
  imagen: {
    icon: <FileCheck size={32} />,
    iconColor: 'text-blue-500',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    badge: 'bg-blue-100 text-blue-700',
    label: 'Diagrama',
  },
  archivo: {
    icon: <FileText size={32} />,
    iconColor: 'text-slate-400',
    bg: 'bg-slate-50',
    border: 'border-slate-100',
    badge: 'bg-slate-100 text-slate-600',
    label: 'Archivo',
  },
};

// Mini avatar con iniciales como fallback
const MiniAvatar = ({ nombre, fotoUrl }) => {
  const iniciales = nombre
    ? nombre.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return fotoUrl ? (
    <img
      src={fotoUrl}
      alt={nombre}
      className="w-6 h-6 rounded-full object-cover border border-slate-200"
    />
  ) : (
    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
      {iniciales}
    </div>
  );
};

const DocGallery = ({ documentos, onOpenViewer, onDelete, isAdmin }) => {
  const copiarUrl = (url, titulo) => {
    navigator.clipboard.writeText(url);
    toast.success(`Enlace de "${titulo}" copiado para el cliente`);
  };

  if (documentos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-300 gap-3">
        <FolderOpen size={52} strokeWidth={1} />
        <p className="text-slate-400 font-medium text-sm">No hay documentos en esta categoría</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-1">
      {documentos.map((doc) => {
        const config = TIPO_CONFIG[doc.tipo] || TIPO_CONFIG.archivo;

        return (
          <div
            key={doc.id}
            className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            {/* Cabecera de la tarjeta */}
            <div className={`${config.bg} border-b ${config.border} p-5 flex items-start justify-between`}>
              {/* Icono grande con color */}
              <div className={`${config.iconColor} transition-transform group-hover:scale-110 duration-300`}>
                {config.icon}
              </div>

              {/* Botones de acción — aparecen al hover */}
              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
                <button
                  onClick={() => onOpenViewer(doc)}
                  className="p-1.5 bg-white hover:bg-blue-50 text-blue-600 rounded-lg shadow-sm transition-colors"
                  title="Ver documento"
                >
                  <ExternalLink size={15} />
                </button>
                <button
                  onClick={() => copiarUrl(doc.url_archivo, doc.titulo)}
                  className="p-1.5 bg-white hover:bg-indigo-50 text-indigo-500 rounded-lg shadow-sm transition-colors"
                  title="Copiar URL para el cliente"
                >
                  <Copy size={15} />
                </button>
                {isAdmin && (
                  <button
                    onClick={() => onDelete(doc)}
                    className="p-1.5 bg-white hover:bg-red-50 text-red-500 rounded-lg shadow-sm transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>

            {/* Cuerpo de la tarjeta */}
            <div className="px-5 py-4">
              <div className="mb-1">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${config.badge}`}>
                  {config.label}
                </span>
              </div>
              <h4 className="font-bold text-slate-800 line-clamp-1 mt-2 mb-1 group-hover:text-blue-700 transition-colors">
                {doc.titulo}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-2 min-h-[32px]">
                {doc.descripcion || 'Sin descripción técnica adicional.'}
              </p>
            </div>

            {/* Footer */}
            <div className="px-5 pb-4 border-t border-slate-100 pt-3 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                {doc.creado_en ? new Date(doc.creado_en).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}
              </span>

              {doc.nombre_autor && (
                <div className="flex items-center gap-1.5">
                  <MiniAvatar nombre={doc.nombre_autor} fotoUrl={doc.foto_url} />
                  <span className="text-[10px] text-slate-400 font-medium">
                    {doc.nombre_autor.split(' ')[0]}
                  </span>
                </div>
              )}
            </div>

            {/* Barra de acción inferior — Ver completo */}
            <button
              onClick={() => onOpenViewer(doc)}
              className="w-full py-2.5 bg-slate-50 hover:bg-blue-600 text-slate-400 hover:text-white text-xs font-semibold border-t border-slate-100 transition-all duration-200 flex items-center justify-center gap-1.5"
            >
              <ExternalLink size={13} />
              Ver documento completo
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default DocGallery;
