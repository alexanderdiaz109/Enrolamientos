const express = require('express');
const router = express.Router();
const versionesController = require('../controllers/versiones.controller');
const protegerRuta = require('../middlewares/auth.middleware');
const uploadKit = require('../config/multer.kit');

// GET público - consultar historial de versiones global
router.get('/', versionesController.getAll);

// GET público - consultar historial de versiones por módulo
router.get('/modulo/:id_modulo', versionesController.getByModulo);

// POST protegido - crear versión con enlace manual (sin archivo)
router.post('/', protegerRuta, versionesController.create);

// POST protegido - crear Kit de distribución con archivo subido a Storage
router.post('/kit', protegerRuta, uploadKit.single('archivo'), versionesController.crearKitVersion);

// PUT protegido - editar versión (lógica de dueño/admin en controller)
router.put('/:id', protegerRuta, versionesController.updateVersion);

module.exports = router;
