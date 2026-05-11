const { createClient } = require('@supabase/supabase-js');
const db = require('../config/db');
const { registrarLog } = require('../utils/logger');

// Cliente público (lectura)
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
// Cliente con privilegios para uploads (bypasea RLS)
const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY // Fallback al anon si no hay service key
);

const createNewVersion = async (data) => {
  const { 
    id_modulo, 
    id_usuario, 
    numero_version, 
    comentarios_cambios, 
    ubicacion_cambios,
    url_descarga,
    cliente,
    parametros_tecnicos,
    es_kit_distribucion
  } = data;

  // Parsear parametros si viene como string
  let params = {};
  if (parametros_tecnicos) {
    try {
      params = typeof parametros_tecnicos === 'string'
        ? JSON.parse(parametros_tecnicos)
        : parametros_tecnicos;
    } catch(e) {
      params = {};
    }
  }

  try {
    const resVersion = await db.query(
      `INSERT INTO versiones 
        (id_modulo, id_usuario, numero_version, comentarios_cambios, ubicacion_cambios, cliente, parametros_tecnicos, es_kit_distribucion)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [id_modulo, id_usuario, numero_version, comentarios_cambios, ubicacion_cambios,
       cliente || null, JSON.stringify(params), es_kit_distribucion || false]
    );

    const versionId = resVersion.rows[0].id;

    if (url_descarga) {
      const nombreCliente = cliente ? cliente.replace(/\s+/g, '_') : 'general';
      await db.query(
        `INSERT INTO drivers (id_version, nombre_archivo, google_drive_id, url_descarga)
         VALUES ($1, $2, $3, $4)`,
        [versionId, `Driver-${numero_version}-${nombreCliente}`, 'manual_link', url_descarga]
      );
    }

    return { id: versionId, ...data };
  } catch (error) {
    throw error;
  }
};

const fetchVersionsByModulo = async (id_modulo) => {
  const query = `
    SELECT v.*, u.nombre as autor 
    FROM versiones v
    JOIN usuarios u ON v.id_usuario = u.id
    WHERE v.id_modulo = $1
    ORDER BY v.creado_en DESC`;
  
  const { rows } = await db.query(query, [id_modulo]);
  return rows;
};

const fetchAllVersiones = async (id_proyecto) => {
    let query = `
        SELECT 
            v.*, 
            m.nombre as nombre_modulo, 
            u.nombre as nombre_usuario,
            COALESCE(v.url_descarga, d.url_descarga) AS url_descarga
        FROM versiones v
        JOIN modulos m ON v.id_modulo = m.id
        JOIN usuarios u ON v.id_usuario = u.id
        LEFT JOIN drivers d ON d.id_version = v.id
    `;
    let values = [];

    if (id_proyecto) {
        query += ' WHERE m.id_proyecto = $1';
        values.push(id_proyecto);
    }

    query += ' ORDER BY v.creado_en DESC';

    const { rows } = await db.query(query, values);
    return rows;
};

const crearVersionConKit = async (datos, archivo, id_usuario) => {
    const {
        id_modulo,
        id_proyecto,
        nombre_proyecto,
        numero_version,
        comentarios_cambios,
        ubicacion_cambios,
        cliente,
        parametros_tecnicos,
        es_kit_distribucion
    } = datos;

    // Parsear parámetros
    let params = {};
    if (parametros_tecnicos) {
        try {
            params = typeof parametros_tecnicos === 'string'
                ? JSON.parse(parametros_tecnicos)
                : parametros_tecnicos;
        } catch(e) {
            params = {};
        }
    }

    let url_descarga = datos.url_descarga || null;

    // Si viene un archivo, subirlo a Supabase Storage (no-fatal: si falla, usa url_descarga)
    if (archivo) {
        try {
            const fileExt = archivo.originalname.split('.').pop();
            const proyectoSlug = (nombre_proyecto || 'proyecto').replace(/\s+/g, '-');
            const clienteSlug  = (cliente || 'general').replace(/\s+/g, '-');
            const versionSlug  = numero_version.replace(/\s+/g, '-');

            const folderPath = `${proyectoSlug}/${clienteSlug}/${versionSlug}`;
            const fileName   = `kit-${versionSlug}.${fileExt}`;
            const fullPath   = `${folderPath}/${fileName}`;

            // Usar cliente admin para bypasear RLS en el upload
            const { error: uploadError } = await supabaseAdmin.storage
                .from('versiones')
                .upload(fullPath, archivo.buffer, {
                    contentType: archivo.mimetype,
                    upsert: true
                });

            if (uploadError) {
                console.warn(`⚠️  Storage upload falló: ${uploadError.message}`);
            } else {
                const { data: publicUrlData } = supabase.storage
                    .from('versiones')
                    .getPublicUrl(fullPath);
                url_descarga = publicUrlData.publicUrl;
            }
        } catch (storageErr) {
            console.warn('⚠️  Storage no disponible, guardando con url_descarga:', storageErr.message);
        }
    }

    const resVersion = await db.query(
        `INSERT INTO versiones 
          (id_modulo, id_usuario, numero_version, comentarios_cambios, ubicacion_cambios,
           cliente, parametros_tecnicos, es_kit_distribucion)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
        [id_modulo, id_usuario, numero_version, comentarios_cambios || null,
         ubicacion_cambios || null, cliente || null,
         JSON.stringify(params), es_kit_distribucion === 'true' || es_kit_distribucion === true]
    );
    const versionId = resVersion.rows[0].id;

    // Guardar URL en versiones directamente (columna unificada) Y en drivers
    if (url_descarga) {
        const nombreCliente = cliente ? cliente.replace(/\s+/g, '_') : 'general';
        // Guardar en versiones (fuente principal)
        await db.query(
            'UPDATE versiones SET url_descarga = $1 WHERE id = $2',
            [url_descarga, versionId]
        );
        // Guardar en drivers (compatibilidad)
        await db.query(
            `INSERT INTO drivers (id_version, nombre_archivo, google_drive_id, url_descarga)
             VALUES ($1, $2, $3, $4)`,
            [versionId, `kit-${numero_version}-${nombreCliente}`, 'supabase_storage', url_descarga]
        );
    }

    // Auditoría (no bloqueante)
    if (id_usuario) {
        setImmediate(() => {
            registrarLog(
                id_usuario,
                `Liberó Kit ${numero_version}${cliente ? ` para ${cliente}` : ''}`,
                id_proyecto || null
            ).catch(err => console.warn('Log no registrado:', err.message));
        });
    }

    return { id: versionId, url_descarga, numero_version, cliente };
};

module.exports = { createNewVersion, fetchVersionsByModulo, fetchAllVersiones, crearVersionConKit };
