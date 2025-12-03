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
 *         description: Fecha inicial para filtrar (ISO 8601)
 *         example: "2024-01-01T00:00:00Z"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Fecha final para filtrar (ISO 8601)
 *         example: "2024-12-31T23:59:59Z"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 1000
 *           default: 100
 *         description: Límite de resultados (1-1000)
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Número de resultados a saltar para paginación
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
 *           minimum: 1
 *           maximum: 500
 *           default: 50
 *         description: Límite de resultados (1-500)
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
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Orden de las lecturas por timestamp
 *     responses:
 *       200:
 *         description: Lista de lecturas del sensor
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reading'
 *       404:
 *         description: Sensor no encontrado o no tiene lecturas
 */
router.get('/sensor/:sensorId', async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const filters = {
            sensorId: req.params.sensorId,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            limit: limit,
            order: req.query.order || 'desc'
        };
        const readings = await service.getBySensorId(req.params.sensorId, filters);
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
 *                 example: "sensor-12345"
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
 *       404:
 *         description: Sensor no encontrado
 *       409:
 *         description: El sensor está inactivo
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
        // No permitir cambiar sensorId en una lectura existente
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
