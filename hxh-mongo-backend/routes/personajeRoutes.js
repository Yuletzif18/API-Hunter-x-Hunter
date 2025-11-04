const express = require('express');
const router = express.Router();
const controller = require('../controllers/personajeController');

router.get('/', controller.listarTodos);
router.post('/', controller.crear);
router.get('/:nombre', controller.obtenerPorNombre);
router.put('/:nombre', controller.modificar);
router.delete('/:nombre', controller.eliminar);

module.exports = router;
