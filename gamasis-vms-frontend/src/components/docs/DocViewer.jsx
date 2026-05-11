import { FileText, Image, AlertTriangle } from 'lucide-react';

const DocViewer = ({ doc }) => {
  if (!doc) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-3 select-none">
        <FileText size={56} strokeWidth={1} />
        <p className="text-slate-400 font-medium">Selecciona un documento para visualizarlo</p>
        <p className="text-slate-300 text-sm">Los PDFs y diagramas se mostrarán aquí</p>
      </div>
    );
  }

  const { url_archivo, tipo, titulo } = doc;

  if (tipo === 'pdf') {
    return (
      <div className="flex flex-col h-full gap-3">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <FileText size={16} className="text-red-400" />
          <span className="font-medium text-slate-700 truncate">{titulo}</span>
        </div>
        <embed
          src={`${url_archivo}#toolbar=1&navpanes=0`}
          type="application/pdf"
          className="flex-1 w-full rounded-xl border border-slate-200 shadow-inner min-h-[600px]"
        />
      </div>
    );
  }

  if (tipo === 'imagen' || tipo === 'flujo') {
    return (
      <div className="flex flex-col h-full gap-3">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Image size={16} className="text-blue-400" />
          <span className="font-medium text-slate-700 truncate">{titulo}</span>
        </div>
        <div className="flex-1 overflow-auto bg-slate-50 rounded-xl border border-slate-200 p-4 flex items-center justify-center">
          <img
            src={url_archivo}
            alt={titulo}
            className="max-w-full h-auto mx-auto shadow-lg rounded-lg"
          />
        </div>
      </div>
    );
  }

  // Tipo genérico: ofrecer descarga
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <AlertTriangle size={40} className="text-amber-400" strokeWidth={1.5} />
      <p className="text-slate-500 font-medium">Vista previa no disponible para este tipo de archivo</p>
      <a
        href={url_archivo}
        target="_blank"
        rel="noopener noreferrer"
        className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
      >
        Descargar archivo
      </a>
    </div>
  );
};

export default DocViewer;
