const express = require('express');
const mongoose = require('mongoose'); // Necesario para validar ObjectId
const router = express.Router();
const { deviceService: service } = require('../services');

/**
 * @swagger
 * tags:
 *   name: Devices
 *   description: Endpoints para gestionar dispositivos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Device:
 *       type: object
 *       required:
 *         - serialNumber
 *         - model
 *         - status
 *         - ownerId
 *         - zoneId
 *       properties:
 *         id:
 *           type: string
 *           description: ID auto-generado del dispositivo (ObjectId de MongoDB)
 *         serialNumber:
 *           type: string
 *           description: Número de serie único del dispositivo
 *         model:
 *           type: string
 *           description: Modelo del dispositivo
 *         installedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de instalación
 *         status:
 *           type: string
 *           enum: [active, maintenance, offline]
 *           description: Estado del dispositivo
 *           example: active
 *         ownerId:
 *           type: string
 *           description: ID del propietario (ObjectId de MongoDB)
 *         zoneId:
 *           type: string
 *           description: ID de la zona (ObjectId de MongoDB)
 *         sensors:
 *           type: array
 *           description: Sensores asociados al dispositivo
 *           items:
 *             type: string
 *             description: ID del sensor (ObjectId de MongoDB)
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
 * /api/v1/devices:
 *   get:
 *     summary: Obtiene todos los dispositivos
 *     tags: [Devices]
 *     responses:
 *       200:
 *         description: Lista de dispositivos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Device'
 */
router.get('/', async (req, res, next) => {
    try {
        const devices = await service.getAll();
        res.status(200).json(devices);
    } catch (error) {
        console.error('❌ Error en GET /devices:', error);
        next(error);
    }
});

/**
 * @swagger
 * /api/v1/devices/{id}:
 *   get:
 *     summary: Obtiene un dispositivo por su ID
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del dispositivo (ObjectId de MongoDB)
 *     responses:
 *       200:
 *         description: Dispositivo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Device'
 *       404:
 *         description: Dispositivo no encontrado
 */
router.get('/:id', async (req, res, next) => {
    try {
        const deviceId = req.params.id;
        
        // Validar ObjectId
        if (!mongoose.Types.ObjectId.isValid(deviceId)) {
            return res.status(400).json({
                message: 'ID inválido',
                error: 'El ID no es un ObjectId válido de MongoDB',
                id: deviceId
            });
        }
        
        const device = await service.getById(deviceId);
        
        if (device) {
            res.status(200).json(device);
        } else {
            res.status(404).json({ message: 'Dispositivo no encontrado' });
        }
    } catch (error) {
        console.error(`❌ Error en GET /devices/${req.params.id}:`, error);
        next(error);
    }
});

/**
 * @swagger
 * /api/v1/devices:
 *   post:
 *     summary: Crea un nuevo dispositivo
 *     tags: [Devices]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serialNumber
 *               - model
 *               - status
 *               - ownerId
 *               - zoneId
 *             properties:
 *               serialNumber:
 *                 type: string
 *                 description: Número de serie único del dispositivo
 *                 example: "DEV-2024-001"
 *               model:
 *                 type: string
 *                 description: Modelo del dispositivo
 *                 example: "Gateway Pro X"
 *               installedAt:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de instalación
 *                 example: "2024-01-15T10:30:00Z"
 *               status:
 *                 type: string
 *                 enum: [active, maintenance, offline]
 *                 description: Estado inicial del dispositivo
 *                 example: active
 *               ownerId:
 *                 type: string
 *                 description: ID del propietario (ObjectId de MongoDB)
 *                 example: "507f1f77bcf86cd799439011"
 *               zoneId:
 *                 type: string
 *                 description: ID de la zona donde se instalará (ObjectId de MongoDB)
 *                 example: "507f1f77bcf86cd799439012"
 *               sensors:
 *                 type: array
 *                 description: IDs de sensores a asociar
 *                 items:
 *                   type: string
 *                   example: "507f1f77bcf86cd799439013"
 *     responses:
 *       201:
 *         description: Dispositivo creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Device'
 *       400:
 *         description: Error en los datos enviados
 */
router.post('/', async (req, res, next) => {
    try {
        console.log('📝 POST /devices - Body:', req.body);
        
        const { serialNumber, model, status, ownerId, zoneId } = req.body;
        
        // Validación básica
        if (!serialNumber || !model || !ownerId || !zoneId) {
            return res.status(400).json({
                message: 'Faltan campos requeridos',
                required: ['serialNumber', 'model', 'ownerId', 'zoneId']
            });
        }
        
        // Validar que ownerId y zoneId sean ObjectIds
        if (!mongoose.Types.ObjectId.isValid(ownerId)) {
            return res.status(400).json({
                message: 'ownerId inválido',
                error: 'Debe ser un ObjectId válido de MongoDB (24 caracteres hexadecimales)',
                value: ownerId
            });
        }
        
        if (!mongoose.Types.ObjectId.isValid(zoneId)) {
            return res.status(400).json({
                message: 'zoneId inválido',
                error: 'Debe ser un ObjectId válido de MongoDB (24 caracteres hexadecimales)',
                value: zoneId
            });
        }
        
        console.log('📝 Llamando a service.create()...');
        const newDevice = await service.create(req.body);
        
        console.log('✅ Dispositivo creado:', newDevice._id);
        res.status(201).json(newDevice);
        
    } catch (error) {
        console.error('❌ ERROR EN POST /devices:', {
            message: error.message,
            code: error.code,
            name: error.name,
            stack: error.stack
        });
        
        if (error.code === 11000) {
            return res.status(409).json({
                message: 'El número de serie ya está registrado',
                field: 'serialNumber'
            });
        }
        
        if (error.name === 'ValidationError') {
            const errors = {};
            for (let field in error.errors) {
                errors[field] = error.errors[field].message;
            }
            return res.status(400).json({
                message: 'Error de validación',
                errors: errors
            });
        }
        
        next(error);
    }
});

/**
 * @swagger
 * /api/v1/devices/{id}:
 *   patch:
 *     summary: Actualiza un dispositivo por su ID
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del dispositivo (ObjectId de MongoDB)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               serialNumber:
 *                 type: string
 *                 description: Número de serie único del dispositivo
 *               model:
 *                 type: string
 *                 description: Modelo del dispositivo
 *               installedAt:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de instalación
 *               status:
 *                 type: string
 *                 enum: [active, maintenance, offline]
 *                 description: Estado del dispositivo
 *               ownerId:
 *                 type: string
 *                 description: ID del propietario (ObjectId de MongoDB)
 *               zoneId:
 *                 type: string
 *                 description: ID de la zona (ObjectId de MongoDB)
 *               sensors:
 *                 type: array
 *                 description: IDs de sensores a asociar
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Dispositivo actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Device'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Dispositivo no encontrado
 */
router.patch('/:id', async (req, res, next) => {
    try {
        const deviceId = req.params.id;
        console.log(`📝 PATCH /devices/${deviceId} - Datos:`, req.body);
        
        // Validar ObjectId
        if (!mongoose.Types.ObjectId.isValid(deviceId)) {
            return res.status(400).json({
                message: 'ID inválido',
                error: 'El ID del dispositivo no es un ObjectId válido',
                id: deviceId
            });
        }
        
        // Validar ObjectIds en el body si se envían
        if (req.body.ownerId && !mongoose.Types.ObjectId.isValid(req.body.ownerId)) {
            return res.status(400).json({
                message: 'ownerId inválido',
                error: 'Debe ser un ObjectId válido',
                value: req.body.ownerId
            });
        }
        
        if (req.body.zoneId && !mongoose.Types.ObjectId.isValid(req.body.zoneId)) {
            return res.status(400).json({
                message: 'zoneId inválido',
                error: 'Debe ser un ObjectId válido',
                value: req.body.zoneId
            });
        }
        
        const updated = await service.update(deviceId, req.body);
        
        if (updated) {
            res.status(200).json(updated);
        } else {
            res.status(404).json({ message: 'Dispositivo no encontrado' });
        }
    } catch (error) {
        console.error(`❌ ERROR EN PATCH /devices/${req.params.id}:`, {
            message: error.message,
            stack: error.stack,
            code: error.code,
            name: error.name
        });
        
        if (error.code === 11000) {
            return res.status(409).json({
                message: 'El número de serie ya está registrado',
                field: 'serialNumber'
            });
        }
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Error de validación',
                error: error.message
            });
        }
        
        next(error);
    }
});

/**
 * @swagger
 * /api/v1/devices/{id}:
 *   delete:
 *     summary: Elimina un dispositivo por su ID
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del dispositivo (ObjectId de MongoDB)
 *     responses:
 *       200:
 *         description: Dispositivo eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Dispositivo eliminado"
 *                 deletedDevice:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     serialNumber:
 *                       type: string
 *       404:
 *         description: Dispositivo no encontrado
 *       409:
 *         description: No se puede eliminar porque tiene sensores asociados
 */
router.delete('/:id', async (req, res, next) => {
    try {
        const deviceId = req.params.id;
        console.log(`🗑️ DELETE /devices/${deviceId} - Iniciando`);
        
        // Validar ObjectId
        if (!mongoose.Types.ObjectId.isValid(deviceId)) {
            return res.status(400).json({
                message: 'ID inválido',
                error: 'El ID no es un ObjectId válido de MongoDB',
                id: deviceId
            });
        }
        
        console.log(`🗑️ Llamando a service.delete("${deviceId}")`);
        const result = await service.delete(deviceId);
        
        if (!result) {
            console.log(`❌ Dispositivo no encontrado: ${deviceId}`);
            return res.status(404).json({
                message: 'Dispositivo no encontrado',
                id: deviceId
            });
        }
        
        console.log(`✅ Dispositivo eliminado: ${deviceId} - ${result.serialNumber}`);
        return res.status(200).json({
            message: 'Dispositivo eliminado exitosamente',
            deletedDevice: result
        });
        
    } catch (error) {
        console.error(`❌ ERROR EN DELETE /devices/${req.params.id}:`, {
            message: error.message,
            stack: error.stack,
            code: error.code,
            name: error.name
        });
        
        if (error.message && error.message.includes('sensores asignados')) {
            return res.status(409).json({
                message: error.message,
                id: req.params.id
            });
        }
        
        next(error);
    }
});

module.exports = router;
