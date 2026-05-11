const docsService = require('../services/docs.service');

const getByProyecto = async (req, res) => {
    try {
        const { id_proyecto } = req.query;
        if (!id_proyecto) return res.status(400).json({ error: 'id_proyecto es requerido' });
        const docs = await docsService.getDocumentosByProyecto(id_proyecto);
        res.status(200).json(docs);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener documentos', details: error.message });
    }
};

const subir = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No se recibió ningún archivo' });
        const id_usuario = req.usuario.id;
        const doc = await docsService.subirDocumento(req.body, req.file, id_usuario);
        res.status(201).json(doc);
    } catch (error) {
        console.error('Error al subir documento:', error);
        res.status(500).json({ error: 'Error al subir el documento', details: error.message });
    }
};

const eliminar = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await docsService.eliminarDocumento(id);
        if (!deleted) return res.status(404).json({ error: 'Documento no encontrado' });
        res.status(200).json({ message: 'Documento eliminado', documento: deleted });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar documento', details: error.message });
    }
};

module.exports = { getByProyecto, subir, eliminar };
