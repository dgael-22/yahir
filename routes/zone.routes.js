const express = require('express');
const router = express.Router();
const { zoneService: service } = require('../services');

/**
 * @swagger
 * tags:
 *   name: Zones
 *   description: Endpoints para gestionar zonas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Zone:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: ID auto-generado de la zona
 *         name:
 *           type: string
 *           description: Nombre único de la zona
 *         description:
 *           type: string
 *           description: Descripción de la zona
 *         isActive:
 *           type: boolean
 *           description: Estado de la zona
 *           default: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /zones:
 *   get:
 *     summary: Obtiene todas las zonas
 *     tags: [Zones]
 *     responses:
 *       200:
 *         description: Lista de zonas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Zone'
 */
router.get('/', async (req, res, next) => {
    try {
        const zones = await service.getAll();
        res.status(200).json(zones);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /zones/{id}:
 *   get:
 *     summary: Obtiene una zona por su ID
 *     tags: [Zones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la zona
 *     responses:
 *       200:
 *         description: Zona encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Zone'
 *       404:
 *         description: Zona no encontrada
 */
router.get('/:id', async (req, res, next) => {
    try {
        const zone = await service.getById(req.params.id);
        zone
            ? res.json(zone)
            : res.status(404).json({ message: 'Zona no encontrada' });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /zones:
 *   post:
 *     summary: Crea una nueva zona
 *     tags: [Zones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Zona creada exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/', async (req, res, next) => {
    try {
        const newZone = await service.create(req.body);
        res.status(201).json(newZone);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /zones/{id}:
 *   patch:
 *     summary: Actualiza una zona por su ID
 *     tags: [Zones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la zona
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Zona actualizada exitosamente
 *       404:
 *         description: Zona no encontrada
 */
router.patch('/:id', async (req, res, next) => {
    try {
        const updated = await service.update(req.params.id, req.body);
        updated
            ? res.json(updated)
            : res.status(404).json({ message: 'Zona no encontrada' });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /zones/{id}:
 *   delete:
 *     summary: Elimina una zona por su ID
 *     tags: [Zones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la zona
 *     responses:
 *       200:
 *         description: Zona eliminada exitosamente
 *       404:
 *         description: Zona no encontrada
 *       409:
 *         description: No se puede eliminar porque tiene dispositivos asignados
 */
router.delete('/:id', async (req, res, next) => {
    try {
        const deleted = await service.delete(req.params.id);
        deleted
            ? res.json({ message: 'Zona eliminada' })
            : res.status(404).json({ message: 'Zona no encontrada' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
