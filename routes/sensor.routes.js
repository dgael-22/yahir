const express = require('express');
const router = express.Router();
const { sensorService: service } = require('../services');

/**
 * @swagger
 * tags:
 *   name: Sensors
 *   description: Endpoints para gestionar sensores
 */

/**
 * @swagger
 * /api/v1/sensors:
 *   get:
 *     summary: Obtiene todos los sensores
 *     tags: [Sensors]
 *     responses:
 *       200:
 *         description: Lista de sensores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: ID del sensor
 *                   type:
 *                     type: string
 *                     enum: [temperature, humidity, co2, noise]
 *                     description: Tipo de sensor
 *                   unit:
 *                     type: string
 *                     description: Unidad de medida
 *                   model:
 *                     type: string
 *                     description: Modelo del sensor
 *                   location:
 *                     type: string
 *                     description: Coordenadas o ubicación
 *                   isActive:
 *                     type: boolean
 *                     description: Estado del sensor
 *                     example: true
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Fecha de creación
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Fecha de última actualización
 */
router.get('/', async (req, res, next) => {
    try {
        const sensors = await service.getAll();
        res.status(200).json(sensors);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/v1/sensors/{id}:
 *   get:
 *     summary: Obtiene un sensor por su ID
 *     tags: [Sensors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del sensor
 *     responses:
 *       200:
 *         description: Sensor encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID del sensor
 *                 type:
 *                   type: string
 *                   enum: [temperature, humidity, co2, noise]
 *                   description: Tipo de sensor
 *                 unit:
 *                   type: string
 *                   description: Unidad de medida
 *                 model:
 *                   type: string
 *                   description: Modelo del sensor
 *                 location:
 *                   type: string
 *                   description: Coordenadas o ubicación
 *                 isActive:
 *                   type: boolean
 *                   description: Estado del sensor
 *                   example: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Fecha de creación
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Fecha de última actualización
 *       404:
 *         description: Sensor no encontrado
 */
router.get('/:id', async (req, res, next) => {
    try {
        const sensor = await service.getById(req.params.id);
        sensor
            ? res.json(sensor)
            : res.status(404).json({ message: 'Sensor no encontrado' });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/v1/sensors:
 *   post:
 *     summary: Crea un nuevo sensor
 *     tags: [Sensors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - unit
 *               - model
 *               - location
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [temperature, humidity, co2, noise]
 *                 description: Tipo de sensor
 *                 example: temperature
 *               unit:
 *                 type: string
 *                 description: Unidad de medida
 *                 example: "°C"
 *               model:
 *                 type: string
 *                 description: Modelo del sensor
 *                 example: "DS18B20"
 *               location:
 *                 type: string
 *                 description: Coordenadas o ubicación
 *                 example: "40.7128,-74.0060"
 *               isActive:
 *                 type: boolean
 *                 description: Estado inicial del sensor
 *                 example: true
 *     responses:
 *       201:
 *         description: Sensor creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID del sensor creado
 *                 type:
 *                   type: string
 *                 unit:
 *                   type: string
 *                 model:
 *                   type: string
 *                 location:
 *                   type: string
 *                 isActive:
 *                   type: boolean
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Datos inválidos
 */
router.post('/', async (req, res, next) => {
    try {
        const newSensor = await service.create(req.body);
        res.status(201).json(newSensor);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/v1/sensors/{id}:
 *   patch:
 *     summary: Actualiza un sensor por su ID
 *     tags: [Sensors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del sensor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [temperature, humidity, co2, noise]
 *                 description: Tipo de sensor
 *               unit:
 *                 type: string
 *                 description: Unidad de medida
 *               model:
 *                 type: string
 *                 description: Modelo del sensor
 *               location:
 *                 type: string
 *                 description: Coordenadas o ubicación
 *               isActive:
 *                 type: boolean
 *                 description: Estado del sensor
 *     responses:
 *       200:
 *         description: Sensor actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 type:
 *                   type: string
 *                 unit:
 *                   type: string
 *                 model:
 *                   type: string
 *                 location:
 *                   type: string
 *                 isActive:
 *                   type: boolean
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Sensor no encontrado
 */
router.patch('/:id', async (req, res, next) => {
    try {
        const updated = await service.update(req.params.id, req.body);
        updated
            ? res.json(updated)
            : res.status(404).json({ message: 'Sensor no encontrado' });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/v1/sensors/{id}:
 *   delete:
 *     summary: Elimina un sensor por su ID
 *     tags: [Sensors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del sensor
 *     responses:
 *       200:
 *         description: Sensor eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sensor eliminado"
 *       404:
 *         description: Sensor no encontrado
 *       409:
 *         description: No se puede eliminar porque tiene lecturas registradas
 */
router.delete('/:id', async (req, res, next) => {
    try {
        const deleted = await service.delete(req.params.id);
        deleted
            ? res.json({ message: 'Sensor eliminado' })
            : res.status(404).json({ message: 'Sensor no encontrado' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;