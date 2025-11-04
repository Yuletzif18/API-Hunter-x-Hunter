const express = require('express');
const router = express.Router();
const controller = require('../../controllers/habilidad/habilidadController');

router.get('/', controller.listarTodas);
router.post('/', controller.crear);
router.get('/:nombre', controller.obtenerPorPersonaje);
router.put('/:nombre', controller.modificar);
router.delete('/:nombre', controller.eliminar);

module.exports = router;
