const express = require('express');
const router = express.Router();
const modulosController = require('../controllers/modulos.controller');
const protegerRuta = require('../middlewares/auth.middleware');

// Obtener todos los módulos
router.get('/', protegerRuta, modulosController.getAll);

// Crear un nuevo módulo
router.post('/', protegerRuta, modulosController.create);

module.exports = router;
