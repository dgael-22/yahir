const express = require('express');
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
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID del dispositivo
 *                   serialNumber:
 *                     type: string
 *                     description: Número de serie del dispositivo
 *                   model:
 *                     type: string
 *                     description: Modelo del dispositivo
 *                   installedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Fecha de instalación
 *                   status:
 *                     type: string
 *                     enum: [active, inactive, maintenance]
 *                     description: Estado del dispositivo
 *                     example: active
 *                   ownerId:
 *                     type: integer
 *                     description: ID del propietario
 *                   zoneId:
 *                     type: integer
 *                     description: ID de la zona
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Fecha de creación
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Fecha de última actualización
 *                   sensors:
 *                     type: array
 *                     description: Sensores asociados al dispositivo
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         type:
 *                           type: string
 *                         model:
 *                           type: string
 */
router.get('/', async (req, res, next) => {
    try {
        const devices = await service.getAll();
        res.status(200).json(devices);
    } catch (error) {
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
 *         description: ID del dispositivo
 *     responses:
 *       200:
 *         description: Dispositivo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID del dispositivo
 *                 serialNumber:
 *                   type: string
 *                   description: Número de serie del dispositivo
 *                 model:
 *                   type: string
 *                   description: Modelo del dispositivo
 *                 installedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Fecha de instalación
 *                 status:
 *                   type: string
 *                   enum: [active, inactive, maintenance]
 *                   description: Estado del dispositivo
 *                 ownerId:
 *                   type: integer
 *                   description: ID del propietario
 *                 zoneId:
 *                   type: integer
 *                   description: ID de la zona
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Fecha de creación
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Fecha de última actualización
 *                 sensors:
 *                   type: array
 *                   description: Sensores asociados al dispositivo
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       type:
 *                         type: string
 *                       model:
 *                         type: string
 *                       isActive:
 *                         type: boolean
 *       404:
 *         description: Dispositivo no encontrado
 */
router.get('/:id', async (req, res, next) => {
    try {
        const device = await service.getById(req.params.id);
        device
            ? res.json(device)
            : res.status(404).json({ message: 'Dispositivo no encontrado' });
    } catch (error) {
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
 *                 enum: [active, inactive, maintenance]
 *                 description: Estado inicial del dispositivo
 *                 example: active
 *               ownerId:
 *                 type: integer
 *                 description: ID del propietario
 *                 example: 1
 *               zoneId:
 *                 type: integer
 *                 description: ID de la zona donde se instalará
 *                 example: 3
 *     responses:
 *       201:
 *         description: Dispositivo creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID del dispositivo creado
 *                 serialNumber:
 *                   type: string
 *                 model:
 *                   type: string
 *                 installedAt:
 *                   type: string
 *                   format: date-time
 *                 status:
 *                   type: string
 *                 ownerId:
 *                   type: integer
 *                 zoneId:
 *                   type: integer
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Error en los datos enviados
 */
router.post('/', async (req, res, next) => {
    try {
        const newDevice = await service.create(req.body);
        res.status(201).json(newDevice);
    } catch (error) {
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
 *         description: ID del dispositivo
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
 *                 enum: [active, inactive, maintenance]
 *                 description: Estado del dispositivo
 *               ownerId:
 *                 type: integer
 *                 description: ID del propietario
 *               zoneId:
 *                 type: integer
 *                 description: ID de la zona
 *     responses:
 *       200:
 *         description: Dispositivo actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 serialNumber:
 *                   type: string
 *                 model:
 *                   type: string
 *                 installedAt:
 *                   type: string
 *                   format: date-time
 *                 status:
 *                   type: string
 *                 ownerId:
 *                   type: integer
 *                 zoneId:
 *                   type: integer
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Dispositivo no encontrado
 */
router.patch('/:id', async (req, res, next) => {
    try {
        const updated = await service.update(req.params.id, req.body);
        updated
            ? res.json(updated)
            : res.status(404).json({ message: 'Dispositivo no encontrado' });
    } catch (error) {
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
 *         description: ID del dispositivo
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
 *       404:
 *         description: Dispositivo no encontrado
 *       409:
 *         description: No se puede eliminar porque tiene sensores asociados
 */
router.delete('/:id', async (req, res, next) => {
    try {
        const deleted = await service.delete(req.params.id);
        deleted
            ? res.json({ message: 'Dispositivo eliminado' })
            : res.status(404).json({ message: 'Dispositivo no encontrado' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
