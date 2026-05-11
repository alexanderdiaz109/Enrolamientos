import { useState, useRef } from 'react';
import { FileText, Upload, X, FileCheck, UploadCloud, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDocs } from '../../features/docs/hooks/useDocs';

const TIPOS = [
  { value: 'pdf',          label: 'Manual de Usuario (PDF)',       accept: '.pdf' },
  { value: 'flujo',        label: 'Diagrama de Flujo (Imagen)',    accept: 'image/*' },
  { value: 'arquitectura', label: 'Arquitectura Técnica (Imagen)', accept: 'image/*' },
  { value: 'imagen',       label: 'Otra imagen / Diagrama',        accept: 'image/*' },
  { value: 'archivo',      label: 'Otro archivo',                  accept: '*' },
];

const UploadDocModal = ({ isOpen, onClose, onSuccess }) => {
  const { subirDoc, uploading } = useDocs();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({ titulo: '', descripcion: '', tipo: 'pdf' });
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);

  const tipoActual = TIPOS.find((t) => t.value === formData.tipo) || TIPOS[0];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setArchivoSeleccionado(file);
    // Auto-ajustar tipo si no coincide
    if (file.type === 'application/pdf' && formData.tipo !== 'pdf') {
      setFormData((prev) => ({ ...prev, tipo: 'pdf' }));
    } else if (file.type.startsWith('image/') && formData.tipo === 'pdf') {
      setFormData((prev) => ({ ...prev, tipo: 'flujo' }));
    }
  };

  const handleTipoChange = (tipo) => {
    setFormData((prev) => ({ ...prev, tipo }));
    // Limpiar archivo si el tipo cambió y puede no ser compatible
    setArchivoSeleccionado(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!archivoSeleccionado) {
      toast.error('Selecciona un archivo primero');
      return;
    }

    const fd = new FormData();
    fd.append('titulo', formData.titulo);
    fd.append('descripcion', formData.descripcion);
    fd.append('tipo', formData.tipo);
    fd.append('archivo', archivoSeleccionado);

    const toastId = toast.loading('Subiendo documento...');
    const res = await subirDoc(fd);

    if (res.success) {
      toast.success(`"${formData.titulo}" guardado correctamente`, { id: toastId });
      // Resetear
      setFormData({ titulo: '', descripcion: '', tipo: 'pdf' });
      setArchivoSeleccionado(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      onSuccess?.();
      onClose();
    } else {
      toast.error(res.error || 'Error al subir el documento', { id: toastId });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-150">

        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Upload size={20} className="text-blue-600" />
            Subir Documentación
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Título */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Título del Documento
            </label>
            <input
              required
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              className="w-full border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Ej: Diagrama de Flujo de Biometría"
            />
          </div>

          {/* Tipo — selector visual por botones */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Tipo de Archivo
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TIPOS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => handleTipoChange(t.value)}
                  className={`text-left px-3 py-2.5 rounded-xl border text-xs font-medium transition-all
                    ${formData.tipo === t.value
                      ? 'bg-blue-50 border-blue-400 text-blue-700 shadow-sm'
                      : 'border-slate-200 text-slate-500 hover:border-blue-200 hover:text-blue-600'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Descripción / Parámetros
              <span className="text-slate-400 font-normal ml-1">(opcional)</span>
            </label>
            <textarea
              rows="2"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="w-full border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
              placeholder="Explica qué parámetros técnicos cubre este documento..."
            />
          </div>

          {/* Zona de carga */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept={tipoActual.accept}
              onChange={handleFileChange}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all
                ${archivoSeleccionado
                  ? 'border-green-300 bg-green-50'
                  : 'border-slate-200 hover:bg-slate-50 hover:border-blue-300'}`}
            >
              {archivoSeleccionado ? (
                <div className="flex items-center justify-center gap-2 text-green-700">
                  <FileCheck size={22} />
                  <div className="text-left">
                    <p className="text-sm font-semibold truncate max-w-[240px]">
                      {archivoSeleccionado.name}
                    </p>
                    <p className="text-xs text-green-600">
                      {(archivoSeleccionado.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <div className="p-3 bg-blue-50 text-blue-500 rounded-full">
                    {formData.tipo === 'pdf' ? <FileText size={24} /> : <UploadCloud size={24} />}
                  </div>
                  <p className="text-sm font-medium text-slate-600">
                    Haz clic para seleccionar archivo
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {formData.tipo === 'pdf' ? 'Solo PDF' : 'PDF o Imágenes'} · Máx. 200MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Botón submit */}
          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-200/60 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {uploading
              ? <><Loader2 size={18} className="animate-spin" /> Subiendo...</>
              : <><Upload size={18} /> Guardar Documentación</>
            }
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadDocModal;
