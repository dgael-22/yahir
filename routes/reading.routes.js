const express = require('express');
const router = express.Router();
const { readingService: service } = require('../services');

/**
 * @swagger
 * tags:
 *   name: Readings
 *   description: Endpoints para gestionar lecturas de sensores
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Reading:
 *       type: object
 *       required:
 *         - sensorId
 *         - value
 *       properties:
 *         id:
 *           type: string
 *           description: ID auto-generado de la lectura
 *         sensorId:
 *           type: string
 *           description: ID del sensor que generó la lectura
 *         value:
 *           type: number
 *           format: float
 *           description: Valor medido por el sensor
 *         time:
 *           type: string
 *           format: date-time
 *           description: Timestamp de cuando se tomó la medición
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del registro
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 */

/**
 * @swagger
 * /api/v1/readings:
 *   get:
 *     summary: Obtiene todas las lecturas
 *     tags: [Readings]
 *     responses:
 *       200:
 *         description: Lista de lecturas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reading'
 */
router.get('/', async (req, res, next) => {
    try {
        const readings = await service.getAll();
        res.status(200).json(readings);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/v1/readings/{id}:
 *   get:
 *     summary: Obtiene una lectura por su ID
 *     tags: [Readings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la lectura
 *     responses:
 *       200:
 *         description: Lectura encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reading'
 *       404:
 *         description: Lectura no encontrada
 */
router.get('/:id', async (req, res, next) => {
    try {
        const reading = await service.getById(req.params.id);
        reading
            ? res.json(reading)
            : res.status(404).json({ message: 'Lectura no encontrada' });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/v1/readings:
 *   post:
 *     summary: Crea una nueva lectura
 *     tags: [Readings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sensorId
 *               - value
 *             properties:
 *               sensorId:
 *                 type: string
 *                 description: ID del sensor
 *                 example: "507f1f77bcf86cd799439011"
 *               value:
 *                 type: number
 *                 format: float
 *                 description: Valor de la lectura
 *                 example: 25.5
 *               time:
 *                 type: string
 *                 format: date-time
 *                 description: Timestamp de la lectura (opcional, usa fecha actual por defecto)
 *                 example: "2024-01-15T10:30:00Z"
 *     responses:
 *       201:
 *         description: Lectura creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reading'
 *       400:
 *         description: Datos inválidos
 */
router.post('/', async (req, res, next) => {
    try {
        const newReading = await service.create(req.body);
        res.status(201).json(newReading);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/v1/readings/{id}:
 *   patch:
 *     summary: Actualiza una lectura por su ID
 *     tags: [Readings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la lectura
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: number
 *                 format: float
 *                 description: Nuevo valor de la lectura
 *                 example: 26.1
 *               time:
 *                 type: string
 *                 format: date-time
 *                 description: Nuevo timestamp de la lectura
 *                 example: "2024-01-15T10:35:00Z"
 *     responses:
 *       200:
 *         description: Lectura actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reading'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Lectura no encontrada
 *       422:
 *         description: No se puede cambiar el sensor asociado a una lectura existente
 */
router.patch('/:id', async (req, res, next) => {
    try {
        if (req.body.sensorId) {
            return res.status(422).json({ 
                message: 'No se puede cambiar el sensor asociado a una lectura existente' 
            });
        }
        
        const updated = await service.update(req.params.id, req.body);
        updated
            ? res.json(updated)
            : res.status(404).json({ message: 'Lectura no encontrada' });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/v1/readings/{id}:
 *   delete:
 *     summary: Elimina una lectura por su ID
 *     tags: [Readings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la lectura
 *     responses:
 *       200:
 *         description: Lectura eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lectura eliminada"
 *                 id:
 *                   type: string
 *                   description: ID de la lectura eliminada
 *       404:
 *         description: Lectura no encontrada
 */
router.delete('/:id', async (req, res, next) => {
    try {
        const deleted = await service.delete(req.params.id);
        deleted
            ? res.json({ message: 'Lectura eliminada', id: req.params.id })
            : res.status(404).json({ message: 'Lectura no encontrada' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
