const express = require('express');
const mongoose = require('mongoose'); 
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
 * components:
 *   schemas:
 *     Sensor:
 *       type: object
 *       required:
 *         - type
 *         - unit
 *         - model
 *         - location
 *       properties:
 *         id:
 *           type: string
 *           description: ID del sensor (ObjectId de MongoDB)
 *         type:
 *           type: string
 *           enum: [temperature, humidity, co2, noise]
 *           description: Tipo de sensor
 *         unit:
 *           type: string
 *           description: Unidad de medida
 *         model:
 *           type: string
 *           description: Modelo del sensor
 *         location:
 *           type: string
 *           description: Coordenadas o ubicación
 *         isActive:
 *           type: boolean
 *           description: Estado del sensor
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
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
 *                 $ref: '#/components/schemas/Sensor'
 */
router.get('/', async (req, res, next) => {
    try {
        const sensors = await service.getAll();
        res.status(200).json(sensors);
    } catch (error) {
        console.error('Error en GET /sensors:', error);
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
 *         description: ID del sensor (ObjectId de MongoDB)
 *     responses:
 *       200:
 *         description: Sensor encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sensor'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Sensor no encontrado
 */
router.get('/:id', async (req, res, next) => {
    try {
        const sensorId = req.params.id;
        
        // Validar formato de ObjectId
        if (!mongoose.Types.ObjectId.isValid(sensorId)) {
            return res.status(400).json({ 
                message: 'ID inválido',
                error: `El ID '${sensorId}' no es un ObjectId válido de MongoDB`
            });
        }
        
        const sensor = await service.getById(sensorId);
        
        if (sensor) {
            res.json(sensor);
        } else {
            res.status(404).json({ 
                message: 'Sensor no encontrado',
                id: sensorId
            });
        }
    } catch (error) {
        console.error(`Error en GET /sensors/${req.params.id}:`, error);
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
 *               $ref: '#/components/schemas/Sensor'
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: Ya existe un sensor con características similares
 */
router.post('/', async (req, res, next) => {
    try {
        const newSensor = await service.create(req.body);
        res.status(201).json(newSensor);
    } catch (error) {
        console.error('Error en POST /sensors:', error);
        
        // Manejar error de duplicado
        if (error.code === 11000 || error.message.includes('duplicate')) {
            return res.status(409).json({
                message: 'Ya existe un sensor con estas características',
                error: error.message
            });
        }
        
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
 *         description: ID del sensor (ObjectId de MongoDB)
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
 *               $ref: '#/components/schemas/Sensor'
 *       400:
 *         description: ID inválido o datos incorrectos
 *       404:
 *         description: Sensor no encontrado
 *       409:
 *         description: Conflicto con datos existentes
 */
router.patch('/:id', async (req, res, next) => {
    try {
        const sensorId = req.params.id;
        
        // Validar formato de ObjectId
        if (!mongoose.Types.ObjectId.isValid(sensorId)) {
            return res.status(400).json({ 
                message: 'ID inválido',
                error: `El ID '${sensorId}' no es un ObjectId válido de MongoDB`
            });
        }
        
        const updated = await service.update(sensorId, req.body);
        
        if (updated) {
            res.json(updated);
        } else {
            res.status(404).json({ 
                message: 'Sensor no encontrado',
                id: sensorId
            });
        }
    } catch (error) {
        console.error(`Error en PATCH /sensors/${req.params.id}:`, error);
        
        // Manejar error de duplicado
        if (error.code === 11000 || error.message.includes('duplicate')) {
            return res.status(409).json({
                message: 'Conflicto con datos existentes',
                error: error.message
            });
        }
        
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
 *         description: ID del sensor (ObjectId de MongoDB)
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
 *                 id:
 *                   type: string
 *                   description: ID del sensor eliminado
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Sensor no encontrado
 *       409:
 *         description: No se puede eliminar porque tiene lecturas registradas
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id', async (req, res, next) => {
    try {
        const sensorId = req.params.id;
        
        console.log(`[DELETE /sensors/${sensorId}] Iniciando eliminación`); // Log de depuración
        
        // Validar que el ID tenga un formato válido para MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(sensorId)) {
            console.log(`[DELETE /sensors/${sensorId}] ID inválido: ${sensorId}`);
            return res.status(400).json({ 
                message: 'ID inválido',
                error: `El ID '${sensorId}' no es un ObjectId válido de MongoDB`,
                details: 'Un ObjectId válido debe tener 24 caracteres hexadecimales (ej: 507f1f77bcf86cd799439011)'
            });
        }

        console.log(`[DELETE /sensors/${sensorId}] ID válido, llamando a service.delete()`); // Log de depuración
        
        const deleted = await service.delete(sensorId);
        
        if (deleted) {
            console.log(`[DELETE /sensors/${sensorId}] Eliminación exitosa`); // Log de depuración
            return res.json({ 
                message: 'Sensor eliminado exitosamente',
                id: sensorId 
            });
        } else {
            console.log(`[DELETE /sensors/${sensorId}] Sensor no encontrado`); // Log de depuración
            return res.status(404).json({ 
                message: 'Sensor no encontrado',
                id: sensorId 
            });
        }
    } catch (error) {
        console.error(`[DELETE /sensors/${req.params.id}] Error:`, error); // Log detallado del error
        
        // Manejar error específico de lecturas asociadas
        if (error.message && (
            error.message.includes('lecturas') || 
            error.message.includes('readings') ||
            error.message.includes('asociad') ||
            error.message.includes('dependen')
        )) {
            return res.status(409).json({ 
                message: 'No se puede eliminar el sensor porque tiene lecturas registradas',
                error: error.message,
                id: req.params.id
            });
        }
        
        // Manejar error de CastError (ObjectId inválido)
        if (error.name === 'CastError' || 
            (error.message && error.message.includes('Cast to ObjectId'))) {
            return res.status(400).json({ 
                message: 'ID inválido',
                error: 'Formato de ID incorrecto para MongoDB ObjectId',
                id: req.params.id
            });
        }
        
        // Manejar error de validación
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Error de validación',
                error: error.message,
                details: error.errors
            });
        }
        
        // Error general del servidor
        next(error);
    }
});

module.exports = router;
