import { useState, useRef } from 'react';
import { useModulos } from '../../modulos/hooks/useModulos';
import { Building2, Package, Link, UploadCloud, FileCheck, Plus, Trash2, Settings2 } from 'lucide-react';
import toast from 'react-hot-toast';

// Constructor visual de parámetros clave-valor (sin JSON manual)
const ParamsBuilder = ({ value, onChange }) => {
  // value es un array de { key, val }
  const addRow = () => onChange([...value, { key: '', val: '' }]);
  const removeRow = (i) => onChange(value.filter((_, idx) => idx !== i));
  const updateRow = (i, field, text) => {
    const next = [...value];
    next[i] = { ...next[i], [field]: text };
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {value.map((row, i) => (
        <div key={i} className="flex gap-2 items-center">
          <input
            placeholder="Parámetro  (ej: puerto)"
            className="flex-1 border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
            value={row.key}
            onChange={(e) => updateRow(i, 'key', e.target.value)}
          />
          <span className="text-slate-400 text-sm font-mono">=</span>
          <input
            placeholder="Valor  (ej: 8080)"
            className="flex-1 border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
            value={row.val}
            onChange={(e) => updateRow(i, 'val', e.target.value)}
          />
          <button
            type="button"
            onClick={() => removeRow(i)}
            className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addRow}
        className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-semibold mt-1 px-1"
      >
        <Plus size={13} /> Agregar parámetro
      </button>
    </div>
  );
};

// Input para múltiples clientes
const ClientTagInput = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const tags = value ? value.split(',').map(t => t.trim()).filter(Boolean) : [];

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = inputValue.trim().replace(/,/g, '');
      if (newTag && !tags.includes(newTag)) {
        onChange([...tags, newTag].join(', '));
      }
      setInputValue('');
    }
  };

  const removeTag = (indexToRemove) => {
    onChange(tags.filter((_, i) => i !== indexToRemove).join(', '));
  };

  return (
    <div className="w-full border border-slate-300 rounded-lg p-1.5 focus-within:ring-2 focus-within:ring-blue-500 bg-white flex flex-wrap gap-1.5 items-center">
      {tags.map((tag, index) => (
        <span key={index} className="flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-medium px-2 py-1 rounded-md border border-indigo-100">
          {tag}
          <button type="button" onClick={() => removeTag(index)} className="hover:text-indigo-900 transition-colors font-bold ml-0.5">
            ×
          </button>
        </span>
      ))}
      <input
        type="text"
        placeholder={tags.length === 0 ? "Ej: Hospital Central (Presiona Enter)" : "Agregar otro..."}
        className="flex-1 outline-none text-sm p-1 min-w-[180px] bg-transparent"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (inputValue.trim()) {
            const newTag = inputValue.trim().replace(/,/g, '');
            if (newTag && !tags.includes(newTag)) {
              onChange([...tags, newTag].join(', '));
            }
            setInputValue('');
          }
        }}
      />
    </div>
  );
};

const VersionForm = ({ onSubmit, onCancel }) => {
  const { modulos } = useModulos();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    id_modulo: '',
    numero_version: '',
    comentarios_cambios: '',
    ubicacion_cambios: '',
    url_descarga: '',
    cliente: '',
    es_kit_distribucion: false
  });
  // Parámetros como array de pares clave-valor
  const [params, setParams] = useState([]);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convertir pares clave-valor a objeto JSON
    const paramsObj = {};
    params.forEach(({ key, val }) => {
      if (key.trim()) paramsObj[key.trim()] = val.trim();
    });

    // Construir FormData
    const fd = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      fd.append(key, typeof val === 'boolean' ? String(val) : val);
    });
    fd.append('parametros_tecnicos', JSON.stringify(paramsObj));
    if (archivoSeleccionado) {
      fd.append('archivo', archivoSeleccionado);
    }
    onSubmit(fd);
  };

  const copiarEnlace = () => {
    if (!formData.url_descarga) return toast.error('Aún no has puesto un enlace.');
    navigator.clipboard.writeText(formData.url_descarga);
    toast.success('¡Enlace copiado! Ya puedes enviarlo al cliente.');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setArchivoSeleccionado(file);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Módulo */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Módulo Relacionado</label>
        <select
          required
          className="w-full border border-slate-300 rounded-lg p-2 bg-white outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.id_modulo}
          onChange={(e) => setFormData({ ...formData, id_modulo: e.target.value })}
        >
          <option value="">Selecciona un módulo...</option>
          {modulos.map((m) => (
            <option key={m.id} value={m.id}>{m.nombre}</option>
          ))}
        </select>
      </div>

      {/* Versión + Rama */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">Versión (Tag)</label>
          <input
            required
            type="text"
            placeholder="Ej: v1.2.0"
            className="w-full border border-slate-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.numero_version}
            onChange={(e) => setFormData({ ...formData, numero_version: e.target.value })}
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">Ubicación / Rama</label>
          <input
            type="text"
            placeholder="Ej: main, release/1.2"
            className="w-full border border-slate-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.ubicacion_cambios}
            onChange={(e) => setFormData({ ...formData, ubicacion_cambios: e.target.value })}
          />
        </div>
      </div>

      {/* Cliente + Toggle Kit */}
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1.5">
            <Building2 size={14} className="text-slate-400" />
            Clientes Destino
          </label>
          <ClientTagInput
            value={formData.cliente}
            onChange={(val) => setFormData({ ...formData, cliente: val })}
          />
        </div>
        <div
          onClick={() => setFormData({ ...formData, es_kit_distribucion: !formData.es_kit_distribucion })}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border cursor-pointer transition-all select-none text-sm font-medium flex-shrink-0
            ${formData.es_kit_distribucion
              ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-sm'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'}`}
        >
          <Package size={15} />
          Kit
        </div>
      </div>

      {/* Sección Kit */}
      {formData.es_kit_distribucion && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">

          {/* Constructor de parámetros */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1.5">
              <Settings2 size={14} className="text-indigo-500" />
              Parámetros Técnicos
              <span className="text-xs text-slate-400 font-normal ml-auto">Clave = Valor</span>
            </label>
            <ParamsBuilder value={params} onChange={setParams} />
            {params.length > 0 && (
              <p className="text-[10px] text-slate-400 mt-2 font-mono bg-white border border-slate-200 rounded px-2 py-1 truncate">
                {JSON.stringify(Object.fromEntries(params.filter(p => p.key).map(p => [p.key, p.val])))}
              </p>
            )}
          </div>

          {/* Zona de subida de archivo */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1.5">
              <UploadCloud size={14} className="text-slate-400" />
              Archivo del Kit
              <span className="text-xs text-slate-400 font-normal ml-auto">ZIP, EXE, APK, etc.</span>
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-4 cursor-pointer transition-all text-center
                ${archivoSeleccionado
                  ? 'border-green-300 bg-green-50 text-green-700'
                  : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50 text-slate-400'}`}
            >
              <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
              {archivoSeleccionado ? (
                <div className="flex items-center justify-between gap-2 px-2">
                  <div className="flex items-center gap-2">
                    <FileCheck size={18} />
                    <span className="text-sm font-medium">{archivoSeleccionado.name}</span>
                    <span className="text-xs">({(archivoSeleccionado.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setArchivoSeleccionado(null); if(fileInputRef.current) fileInputRef.current.value=''; }}
                    className="text-green-600 hover:text-red-500 text-xs font-semibold"
                  >
                    Quitar
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <UploadCloud size={22} />
                  <p className="text-sm font-medium">Haz clic para seleccionar archivo</p>
                  <p className="text-xs">o arrastra y suelta aquí</p>
                </div>
              )}
            </div>

            {/* URL alternativa: solo si NO hay archivo seleccionado */}
            {!archivoSeleccionado && (
              <div className="mt-2">
                <p className="text-xs text-slate-400 mb-1.5 text-center">— o si el archivo ya está en la nube —</p>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://drive.google.com/file/d/..."
                    className="flex-1 border border-slate-300 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.url_descarga}
                    onChange={(e) => setFormData({ ...formData, url_descarga: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={copiarEnlace}
                    title="Copiar enlace"
                    className="px-3 py-2 bg-white text-slate-500 border border-slate-300 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all"
                  >
                    <Link size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* Confirmación cuando hay archivo: la URL se genera sola */}
            {archivoSeleccionado && (
              <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
                <FileCheck size={12} /> El enlace de descarga se generará automáticamente al guardar
              </p>
            )}
          </div>
        </div>
      )}

      {/* Notas */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Notas de la Versión</label>
        <textarea
          required
          className="w-full border border-slate-300 rounded-lg p-2 h-20 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="¿Qué mejoras o correcciones incluye?"
          value={formData.comentarios_cambios}
          onChange={(e) => setFormData({ ...formData, comentarios_cambios: e.target.value })}
        />
      </div>

      {/* Enlace externo: solo visible cuando NO es Kit con archivo */}
      {(!formData.es_kit_distribucion || !archivoSeleccionado) && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {formData.es_kit_distribucion ? 'Enlace alternativo (sin archivo)' : 'Enlace del Driver / Google Drive'}
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://drive.google.com/file/d/..."
              className="flex-1 border border-slate-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.url_descarga}
              onChange={(e) => setFormData({ ...formData, url_descarga: e.target.value })}
            />
            <button
              type="button"
              onClick={copiarEnlace}
              title="Copiar enlace para el cliente"
              className="px-3 py-2 bg-slate-100 text-slate-600 border border-slate-300 rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all"
            >
              <Link size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          Cancelar
        </button>
        <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-all font-semibold">
          Liberar Versión
        </button>
      </div>
    </form>
  );
};

export default VersionForm;
