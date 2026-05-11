const db = require('../config/db');

const getStats = async () => {
    // 1. Obtener los proyectos con sus respectivos conteos
    const proyectosQuery = `
        SELECT 
            p.id,
            p.nombre,
            COUNT(DISTINCT m.id) as modulos,
            COUNT(DISTINCT v.id) as versiones
        FROM proyectos p
        LEFT JOIN modulos m ON m.id_proyecto = p.id
        LEFT JOIN versiones v ON v.id_modulo = m.id
        GROUP BY p.id, p.nombre
        ORDER BY p.creado_en DESC
    `;
    
    // 2. Obtener el total global de usuarios
    const usuariosQuery = 'SELECT COUNT(*) FROM usuarios';

    const [proyectosRes, usuariosRes] = await Promise.all([
        db.query(proyectosQuery),
        db.query(usuariosQuery)
    ]);

    return {
        proyectos: proyectosRes.rows.map(p => ({
            id: p.id,
            nombre: p.nombre,
            modulos: parseInt(p.modulos),
            versiones: parseInt(p.versiones)
        })),
        totalUsuarios: parseInt(usuariosRes.rows[0].count)
    };
};

module.exports = { getStats };
