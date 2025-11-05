const express = require('express');
const router = express.Router();
const controller = require('../controllers/personajeController');
const { verificarAuth, verificarAdmin } = require('../middleware/authMiddleware');

// Rutas públicas (lectura) - requieren autenticación pero cualquier rol
router.get('/', verificarAuth, controller.listarTodos);
router.get('/:nombre', verificarAuth, controller.obtenerPorNombre);

// Rutas protegidas (escritura) - solo admin
router.post('/', verificarAuth, verificarAdmin, controller.crear);
router.put('/:nombre', verificarAuth, verificarAdmin, controller.modificar);
router.delete('/:nombre', verificarAuth, verificarAdmin, controller.eliminar);

module.exports = router;
