const db = require('../config/db');
const { registrarLog } = require('../utils/logger');

const fetchAllModulos = async (id_proyecto) => {
    let query = 'SELECT * FROM modulos';
    let values = [];
    
    if (id_proyecto) {
        query += ' WHERE id_proyecto = $1';
        values.push(id_proyecto);
    }
    
    query += ' ORDER BY nombre ASC';
    
    const { rows } = await db.query(query, values);
    return rows;
};

const createNewModulo = async (data, id_usuario) => {
    const { nombre, descripcion, id_proyecto } = data;
    
    const query = 'INSERT INTO modulos (nombre, descripcion, id_proyecto) VALUES ($1, $2, $3) RETURNING *';
    const values = [nombre, descripcion || null, id_proyecto];
    const { rows } = await db.query(query, values);

    // Registrar en log de forma no bloqueante (no afecta si falla)
    setImmediate(() => {
        registrarLog(id_usuario, `Creó el módulo "${nombre}"`, id_proyecto || null)
            .catch(err => console.warn('Log no registrado (no crítico):', err.message));
    });

    return rows[0];
};

module.exports = { fetchAllModulos, createNewModulo };
