const db = require('../config/db');

const fetchAllProyectos = async () => {
    const query = 'SELECT * FROM proyectos ORDER BY creado_en DESC';
    const { rows } = await db.query(query);
    return rows;
};

const createNewProyecto = async (data) => {
    const { nombre, descripcion } = data;
    const query = 'INSERT INTO proyectos (nombre, descripcion) VALUES ($1, $2) RETURNING *';
    const values = [nombre, descripcion];
    const { rows } = await db.query(query, values);
    return rows[0];
};

const deleteProject = async (id) => {
    const { rows } = await db.query('DELETE FROM proyectos WHERE id = $1 RETURNING *', [id]);
    return rows[0];
};

const updateProject = async (id, data) => {
    const { nombre, descripcion } = data;
    const { rows } = await db.query(
        'UPDATE proyectos SET nombre = $1, descripcion = $2 WHERE id = $3 RETURNING *',
        [nombre, descripcion, id]
    );
    return rows[0];
};

module.exports = { fetchAllProyectos, createNewProyecto, deleteProject, updateProject };
