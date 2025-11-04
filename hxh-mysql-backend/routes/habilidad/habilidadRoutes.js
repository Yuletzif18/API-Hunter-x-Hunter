/**
 * @swagger
 * tags:
 *   - name: habilidades
 *     description: Operaciones relacionadas con habilidades
 */

/**
 * @swagger
 * /api/habilidades:
 *   get:
 *     tags:
 *       - habilidades
 *     summary: Obtiene todas las habilidades
 *     responses:
 *       '200':
 *         description: Lista de habilidades
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Habilidad'
 *   post:
 *     tags:
 *       - habilidades
 *     summary: Crea una nueva habilidad
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Habilidad'
 *     responses:
 *       '201':
 *         description: Habilidad creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Habilidad'
 *       '400':
 *         description: Datos inválidos
 */

/**
 * @swagger
 * /api/habilidades/{nombre}:
 *   get:
 *     tags:
 *       - habilidades
 *     summary: Obtiene una habilidad por nombre de personaje
 *     parameters:
 *       - in: path
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Habilidad encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Habilidad'
 *       '404':
 *         description: Habilidad no encontrada
 *   put:
 *     tags:
 *       - habilidades
 *     summary: Actualiza una habilidad por nombre de personaje
 *     parameters:
 *       - in: path
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Habilidad'
 *     responses:
 *       '200':
 *         description: Habilidad actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Habilidad'
 *       '400':
 *         description: Datos inválidos
 *       '404':
 *         description: Habilidad no encontrada
 *   delete:
 *     tags:
 *       - habilidades
 *     summary: Elimina una habilidad por nombre de personaje
 *     parameters:
 *       - in: path
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Habilidad eliminada exitosamente
 *       '404':
 *         description: Habilidad no encontrada
 */
const express = require('express');
const router = express.Router();
const controller = require('../../controllers/habilidad/habilidadController');

router.get('/', controller.listarTodas);
router.post('/', controller.crear);
router.get('/:nombre', controller.obtenerPorPersonaje);
router.put('/:nombre', controller.modificar);
router.delete('/:nombre', controller.eliminar);

module.exports = router;
