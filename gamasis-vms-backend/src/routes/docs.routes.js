const express = require('express');
const router = express.Router();
const docsController = require('../controllers/docs.controller');
const protegerRuta = require('../middlewares/auth.middleware');
const { soloAdmin } = require('../middlewares/role.middleware');
const uploadKit = require('../config/multer.kit'); // reutilizamos el multer de archivos grandes

// GET: listar documentos de un proyecto
router.get('/', protegerRuta, docsController.getByProyecto);

// POST: subir documento (solo admin)
router.post('/', protegerRuta, soloAdmin, uploadKit.single('archivo'), docsController.subir);

// DELETE: eliminar documento (solo admin)
router.delete('/:id', protegerRuta, soloAdmin, docsController.eliminar);

module.exports = router;
