const modulosService = require('../services/modulos.service');

const getAll = async (req, res) => {
    try {
        const { id_proyecto } = req.query;
        const modulos = await modulosService.fetchAllModulos(id_proyecto);
        res.status(200).json(modulos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los módulos', details: error.message });
    }
};

const create = async (req, res) => {
    try {
        console.log("req.usuario:", req.usuario);
        const id_usuario = req.usuario.id;
        console.log("req.body:", req.body);
        const nuevoModulo = await modulosService.createNewModulo(req.body, id_usuario);
        res.status(201).json(nuevoModulo);
    } catch (error) {
        console.error("CREATE ERROR STACK:", error);
        if (error.code === '23505') { // Postgres unique constraint violation
            return res.status(400).json({ error: 'Ya existe un módulo con ese nombre.' });
        }
        res.status(500).json({ error: 'Error al crear el módulo', details: error.message });
    }
};

module.exports = { getAll, create };
