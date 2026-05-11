const db = require('../config/db');

/**
 * @param {string} id_usuario - Quién lo hizo
 * @param {string} accion - Qué hizo (ej: "Creó el módulo 'Login'")
 * @param {string} id_proyecto - A qué proyecto pertenece
 */
const registrarLog = async (id_usuario, accion, id_proyecto = null) => {
    try {
        await db.query(
            'INSERT INTO logs_actividad (id_usuario, accion, proyecto_afectado) VALUES ($1, $2, $3)',
            [id_usuario, accion, id_proyecto]
        );
    } catch (error) {
        console.error("Error al registrar log:", error);
    }
};

module.exports = { registrarLog };
