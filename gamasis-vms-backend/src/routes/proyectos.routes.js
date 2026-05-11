const express = require('express');
const router = express.Router();
const proyectosController = require('../controllers/proyectos.controller');
const protegerRuta = require('../middlewares/auth.middleware');
const { soloAdmin } = require('../middlewares/role.middleware');

router.get('/', protegerRuta, proyectosController.getAll);
router.post('/', protegerRuta, proyectosController.create);
router.put('/:id', protegerRuta, soloAdmin, proyectosController.update);
router.delete('/:id', protegerRuta, soloAdmin, proyectosController.deleteProyecto);

module.exports = router;
