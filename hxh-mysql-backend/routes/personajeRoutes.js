/**
 * @swagger
 * tags:
 *   - name: personajes
 *     description: Operaciones relacionadas con personajes
 */

/**
 * @swagger
 * /api/personajes:
 *   get:
 *     tags:
 *       - personajes
 *     summary: Obtiene todos los personajes
 *     responses:
 *       '200':
 *         description: Lista de personajes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Personaje'
 *   post:
 *     tags:
 *       - personajes
 *     summary: Crea un nuevo personaje
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Personaje'
 *     responses:
 *       '201':
 *         description: Personaje creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Personaje'
 *       '400':
 *         description: Datos inválidos
 */

/**
 * @swagger
 * /api/personajes/{nombre}:
 *   get:
 *     tags:
 *       - personajes
 *     summary: Obtiene un personaje por nombre
 *     parameters:
 *       - in: path
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Personaje encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Personaje'
 *       '404':
 *         description: Personaje no encontrado
 *   put:
 *     tags:
 *       - personajes
 *     summary: Actualiza un personaje por nombre
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
 *             $ref: '#/components/schemas/Personaje'
 *     responses:
 *       '200':
 *         description: Personaje actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Personaje'
 *       '400':
 *         description: Datos inválidos
 *       '404':
 *         description: Personaje no encontrado
 *   delete:
 *     tags:
 *       - personajes
 *     summary: Elimina un personaje por nombre
 *     parameters:
 *       - in: path
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Personaje eliminado exitosamente
 *       '404':
 *         description: Personaje no encontrado
 */
const express = require('express');
const router = express.Router();
const controller = require('../controllers/personajeController');

router.get('/', controller.listarTodos);
router.post('/', controller.crear);
router.put('/:id', controller.modificar);
router.delete('/:id', controller.eliminar);

module.exports = router;
