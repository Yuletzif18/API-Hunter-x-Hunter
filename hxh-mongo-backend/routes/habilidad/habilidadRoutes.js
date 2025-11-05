const express = require('express');
const router = express.Router();
const controller = require('../../controllers/habilidad/habilidadController');
const { verificarAuth, verificarAdmin } = require('../../middleware/authMiddleware');

// Rutas públicas (lectura) - requieren autenticación pero cualquier rol
router.get('/', verificarAuth, controller.listarTodas);
router.get('/:nombre', verificarAuth, controller.obtenerPorPersonaje);

// Rutas protegidas (escritura) - solo admin
router.post('/', verificarAuth, verificarAdmin, controller.crear);
router.put('/:nombre', verificarAuth, verificarAdmin, controller.modificar);
router.delete('/:nombre', verificarAuth, verificarAdmin, controller.eliminar);

module.exports = router;
