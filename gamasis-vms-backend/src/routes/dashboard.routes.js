const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const protegerRuta = require('../middlewares/auth.middleware');

// Protegemos la ruta para que solo usuarios logueados puedan ver las estadísticas
router.get('/stats', protegerRuta, dashboardController.getDashboardStats);
router.get('/logs', protegerRuta, dashboardController.getLogs);

module.exports = router;
