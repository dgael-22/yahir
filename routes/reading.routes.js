const express = require('express');
const router = express.Router();
const { readingService: service } = require('../services');

/**
 * @swagger
 * tags:
 *   name: Readings
 *   description: Endpoints para gestionar lecturas
 */

/**
 * @swagger
 * /api/v1/readings:
 *   get:
 *     summary: Obtiene todas las lecturas con filtros opcionales
 *     tags: [Readings]
 *     parameters:
 *       - in: query
 *         name: sensorId
 *         schema:
 *           type: string
 *         description: Filtrar por ID de sensor
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Fecha inicial para filtrar
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Fecha final para filtrar
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *         description: Límite de resultados
 *     responses:
 *       200:
 *         description: Lista de lecturas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   sensorId:
 *                     type: string
 *                   value:
 *                     type: number
 *                   time:
 *                     type: string
 *                     format: date-time
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 */
router.get('/', async (req, res, next) => {
    try {
        const filters = req.query;
        const readings = await service.getAll(filters);
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
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 sensorId:
 *                   type: string
 *                 value:
 *                   type: number
 *                 time:
 *                   type: string
 *                   format: date-time
 *                 createdAt:
 *                   type: string
 *                   format: date-time
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
 * /api/v1/readings/sensor/{sensorId}:
 *   get:
 *     summary: Obtiene lecturas por ID de sensor
 *     tags: [Readings]
 *     parameters:
 *       - in: path
 *         name: sensorId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del sensor
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Límite de resultados
 *     responses:
 *       200:
 *         description: Lista de lecturas del sensor
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   sensorId:
 *                     type: string
 *                   value:
 *                     type: number
 *                   time:
 *                     type: string
 *                     format: date-time
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: Sensor no encontrado
 */
router.get('/sensor/:sensorId', async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const readings = await service.getBySensorId(req.params.sensorId, limit);
        res.status(200).json(readings);
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
 *               value:
 *                 type: number
 *                 description: Valor de la lectura
 *               time:
 *                 type: string
 *                 format: date-time
 *                 description: Timestamp de la lectura (opcional, usa fecha actual por defecto)
 *     responses:
 *       201:
 *         description: Lectura creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 sensorId:
 *                   type: string
 *                 value:
 *                   type: number
 *                 time:
 *                   type: string
 *                   format: date-time
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Sensor no encontrado
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
 *               sensorId:
 *                 type: string
 *                 description: ID del sensor
 *               value:
 *                 type: number
 *                 description: Nuevo valor de la lectura
 *               time:
 *                 type: string
 *                 format: date-time
 *                 description: Nuevo timestamp de la lectura
 *     responses:
 *       200:
 *         description: Lectura actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 sensorId:
 *                   type: string
 *                 value:
 *                   type: number
 *                 time:
 *                   type: string
 *                   format: date-time
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Lectura no encontrada
 */
router.patch('/:id', async (req, res, next) => {
    try {
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
 *       404:
 *         description: Lectura no encontrada
 */
router.delete('/:id', async (req, res, next) => {
    try {
        const deleted = await service.delete(req.params.id);
        deleted
            ? res.json({ message: 'Lectura eliminada' })
            : res.status(404).json({ message: 'Lectura no encontrada' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;