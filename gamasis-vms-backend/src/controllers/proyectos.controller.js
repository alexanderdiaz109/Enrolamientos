const proyectosService = require('../services/proyectos.service');

const getAll = async (req, res) => {
  try {
    const proyectos = await proyectosService.fetchAllProyectos();
    res.status(200).json(proyectos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener proyectos', details: error.message });
  }
};

const create = async (req, res) => {
  try {
    const nuevoProyecto = await proyectosService.createNewProyecto(req.body);
    res.status(201).json(nuevoProyecto);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear proyecto', details: error.message });
  }
};

const deleteProyecto = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await proyectosService.deleteProject(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }
    res.status(200).json({ message: 'Proyecto eliminado con éxito', proyecto: deleted });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar proyecto', details: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await proyectosService.updateProject(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar proyecto', details: error.message });
  }
};

module.exports = { getAll, create, deleteProyecto, update };
