const express = require('express');
const router = express.Router();
const controller = require('../controllers/personajeController');

router.get('/', controller.listarTodos);
router.post('/', controller.crear);
router.put('/:id', controller.modificar);
router.delete('/:id', controller.eliminar);

module.exports = router;
