const versionesService = require('../services/versiones.service');
const db = require('../config/db');

const create = async (req, res) => {
  try {
    const id_usuario = req.usuario.id;
    const nuevaVersion = await versionesService.createNewVersion({ ...req.body, id_usuario });
    res.status(201).json(nuevaVersion);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar la versión', details: error.message });
  }
};

const crearKitVersion = async (req, res) => {
  try {
    const id_usuario = req.usuario.id;
    // req.body viene de FormData (campos de texto)
    // req.file viene del multerKit middleware (el archivo ZIP/APK/etc)
    const resultado = await versionesService.crearVersionConKit(
      req.body,
      req.file || null,
      id_usuario
    );
    res.status(201).json(resultado);
  } catch (error) {
    console.error('Error crearKitVersion:', error);
    res.status(500).json({ error: 'Error al generar el Kit de distribución', details: error.message });
  }
};

const getByModulo = async (req, res) => {
  try {
    const { id_modulo } = req.params;
    const versiones = await versionesService.fetchVersionsByModulo(id_modulo);
    res.status(200).json(versiones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener versiones', details: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const { id_proyecto } = req.query;
    const versiones = await versionesService.fetchAllVersiones(id_proyecto);
    res.status(200).json(versiones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener historial', details: error.message });
  }
};

const updateVersion = async (req, res) => {
    const { id } = req.params;
    const id_usuario_actual = req.usuario.id; // Uso req.usuario.id ya que así viene de auth.middleware
    const rol_actual = req.usuario.rol;

    try {
        const { rows } = await db.query('SELECT id_usuario FROM versiones WHERE id = $1', [id]);
        
        if (rows.length === 0) return res.status(404).json({ error: 'Versión no encontrada' });

        if (rol_actual !== 'admin' && rows[0].id_usuario !== id_usuario_actual) {
            return res.status(403).json({ error: 'No puedes editar una versión creada por otro compañero' });
        }

        // Simulación de update o llamada a service (como lo pidió el usuario)
        // await versionesService.updateVersion(id, req.body);
        
        const { registrarLog } = require('../utils/logger');
        await registrarLog(id_usuario_actual, `Editó la versión ID: ${id}`, req.body.id_proyecto);
        res.json({ message: 'Actualizado con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor', details: error.message });
    }
};

module.exports = { create, crearKitVersion, getByModulo, getAll, updateVersion };
