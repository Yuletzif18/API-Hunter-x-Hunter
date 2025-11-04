const express = require('express');
const router = express.Router();
const controller = require('../../controllers/habilidad/habilidadController');

router.get('/', controller.listarTodas);
router.post('/', controller.crear);
router.put('/:id', controller.modificar);
router.delete('/:id', controller.eliminar);

module.exports = router;
