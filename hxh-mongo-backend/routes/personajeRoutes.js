const express = require('express');
const router = express.Router();
const controller = require('../controllers/personajeController');

router.get('/personajes', controller.listarTodos);
router.post('/personajes', controller.crear);
router.put('/personajes/:id', controller.modificar);
router.delete('/personajes/:id', controller.eliminar);

module.exports = router;
