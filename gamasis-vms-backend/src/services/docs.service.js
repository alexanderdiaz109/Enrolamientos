const { createClient } = require('@supabase/supabase-js');
const db = require('../config/db');
const { registrarLog } = require('../utils/logger');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY
);

/**
 * Detecta el tipo de documento basándose en el mimetype del archivo.
 */
const detectarTipo = (mimetype) => {
    if (mimetype === 'application/pdf') return 'pdf';
    if (mimetype.startsWith('image/')) return 'imagen';
    return 'archivo';
};

/**
 * Sube un documento a Supabase Storage y guarda el registro en la DB.
 */
const subirDocumento = async (datos, archivo, id_usuario) => {
    const { id_proyecto, nombre_proyecto, titulo, descripcion, tipo } = datos;

    // 1. Definir ruta organizada: docs/BioMatcher/manual-usuario.pdf
    const fileExt = archivo.originalname.split('.').pop();
    const proyectoSlug = (nombre_proyecto || 'general').replace(/\s+/g, '-');
    const tipoFinal = tipo || detectarTipo(archivo.mimetype);
    const fileName = `${Date.now()}-${archivo.originalname.replace(/\s+/g, '-')}`;
    const fullPath = `${proyectoSlug}/${tipoFinal}/${fileName}`;

    // 2. Subir a Storage bucket 'documentacion' con cliente admin (bypasea RLS)
    const { error: uploadError } = await supabaseAdmin.storage
        .from('documentacion')
        .upload(fullPath, archivo.buffer, {
            contentType: archivo.mimetype,
            upsert: false
        });

    if (uploadError) throw new Error(`Error Storage: ${uploadError.message}`);

    // 3. Obtener URL pública
    const { data: urlData } = supabase.storage
        .from('documentacion')
        .getPublicUrl(fullPath);

    const url_archivo = urlData.publicUrl;

    // 4. Guardar en la tabla documentacion
    const { rows } = await db.query(
        `INSERT INTO documentacion 
          (id_proyecto, titulo, descripcion, tipo, url_archivo, id_usuario) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [id_proyecto, titulo, descripcion || null, tipoFinal, url_archivo, id_usuario]
    );

    // 5. Auditoría (no bloqueante)
    setImmediate(() => {
        registrarLog(id_usuario, `Subió el documento "${titulo}" (${tipoFinal})`, id_proyecto)
            .catch(err => console.warn('Log no registrado:', err.message));
    });

    return rows[0];
};

/**
 * Obtiene todos los documentos de un proyecto.
 */
const getDocumentosByProyecto = async (id_proyecto) => {
    const { rows } = await db.query(
        `SELECT d.*, u.nombre as nombre_autor
         FROM documentacion d
         LEFT JOIN usuarios u ON d.id_usuario = u.id
         WHERE d.id_proyecto = $1
         ORDER BY d.creado_en DESC`,
        [id_proyecto]
    );
    return rows;
};

/**
 * Elimina un documento de la DB (y opcionalmente del storage).
 */
const eliminarDocumento = async (id) => {
    const { rows } = await db.query(
        'DELETE FROM documentacion WHERE id = $1 RETURNING *',
        [id]
    );
    return rows[0];
};

module.exports = { subirDocumento, getDocumentosByProyecto, eliminarDocumento };
