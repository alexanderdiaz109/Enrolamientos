const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');
const protegerRuta = require('../middlewares/auth.middleware');
const { soloAdmin } = require('../middlewares/role.middleware');
const upload = require('../config/multer.config');

router.get('/', protegerRuta, usuariosController.getUsuarios);
router.post('/', protegerRuta, usuariosController.createUsuario);

router.post('/avatar', 
    protegerRuta, 
    upload.single('avatar'), 
    usuariosController.actualizarAvatar
);

router.patch('/:id/rol', protegerRuta, soloAdmin, usuariosController.cambiarRol);

module.exports = router;
