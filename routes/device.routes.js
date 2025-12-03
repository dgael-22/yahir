const express = require('express');
const { deviceService: service } = require('../services');
const router = express.Router();

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
 *     summary: Obtiene todas las dispositivos
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
 *                   model:
 *                     type: string
 *                   installedAt:
 *                     type: string
 *                   status:
 *                     type: string
 *                   ownerId:
 *                     type: integer
 *                   zoneId:
 *                     type: integer
 *                   sensors:
 *                     type: array
 *                     items:
 *                       type: object
 */
router.get('/', async (req, res) => {
    const devices = await service.getAll();
    res.status(200).json(devices);
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
 *           type: integer
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
 *                 serialNumber:
 *                   type: string
 *                 model:
 *                   type: string
 *                 installedAt:
 *                   type: string
 *                 status:
 *                   type: string
 *                 ownerId:
 *                   type: integer
 *                 zoneId:
 *                   type: integer
 *                 sensors:
 *                   type: array
 *       404:
 *         description: Dispositivo no encontrado
 */
router.get('/:id', async (req, res, next) => {
    await service.getById(req.params.id)
        .then(device => {
            device
                ? res.json(device)
                : res.status(404).json({ message: 'Dispositivo no encontrado' });
        })
        .catch(error => next(error));
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
 *             properties:
 *               serialNumber:
 *                 type: string
 *               model:
 *                 type: string
 *               installedAt:
 *                 type: string
 *               status:
 *                 type: string
 *               ownerId:
 *                 type: integer
 *               zoneId:
 *                 type: integer
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
 *                 serialNumber:
 *                   type: string
 *                 model:
 *                   type: string
 *                 installedAt:
 *                   type: string
 *                 status:
 *                   type: string
 *                 ownerId:
 *                   type: integer
 *                 zoneId:
 *                   type: integer
 *       400:
 *         description: Error en los datos enviados
 */
router.post('/', async (req, res) => {
    const newDevice = await service.create(req.body);
    res.status(201).json(newDevice);
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
 *           type: integer
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
 *               model:
 *                 type: string
 *               installedAt:
 *                 type: string
 *               status:
 *                 type: string
 *               ownerId:
 *                 type: integer
 *               zoneId:
 *                 type: integer
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
 *                 status:
 *                   type: string
 *                 ownerId:
 *                   type: integer
 *                 zoneId:
 *                   type: integer
 *       404:
 *         description: Dispositivo no encontrado
 */
router.patch('/:id', async (req, res) => {
    const updated = await service.update(req.params.id, req.body);
    updated
        ? res.json(updated)
        : res.status(404).json({ message: 'Dispositivo no encontrado' });
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
 *           type: integer
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
 */
router.delete('/:id', async (req, res, next) => {
    const deleted = await service.delete(req.params.id);
    deleted
        ? res.json({ message: 'Dispositivo eliminado' })
        : res.status(404).json({ message: 'Dispositivo no encontrado' });
});

module.exports = router;