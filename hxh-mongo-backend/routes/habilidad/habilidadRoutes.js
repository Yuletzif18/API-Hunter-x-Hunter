const express = require('express');
const router = express.Router();
const controller = require('../../controllers/habilidad/habilidadController');

router.get('/habilidades', controller.listarTodas);
router.post('/habilidades', controller.crear);
router.put('/habilidades/:id', controller.modificar);
router.delete('/habilidades/:id', controller.eliminar);

module.exports = router;
