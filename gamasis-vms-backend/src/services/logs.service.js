const db = require('../config/db');

const getRecentLogs = async (limit = 15) => {
    const query = `
        SELECT 
            l.id, 
            l.accion, 
            l.fecha, 
            u.nombre as nombre_usuario,
            p.nombre as nombre_proyecto
        FROM logs_actividad l
        JOIN usuarios u ON l.id_usuario = u.id
        LEFT JOIN proyectos p ON l.proyecto_afectado = p.id
        ORDER BY l.fecha DESC
        LIMIT $1`;
        
    const { rows } = await db.query(query, [limit]);
    return rows;
};

module.exports = { getRecentLogs };
