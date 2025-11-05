const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verificarAuth, verificarAdmin } = require('../middleware/authMiddleware');

// Rutas públicas
router.post('/registro', authController.registrar);
router.post('/login', authController.login);

// Rutas protegidas
router.get('/verificar', verificarAuth, authController.verificarToken);
router.get('/usuarios', verificarAuth, verificarAdmin, authController.listarUsuarios);

module.exports = router;
