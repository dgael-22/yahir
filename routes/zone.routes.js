const express = require('express');
const mongoose = require('mongoose'); // Necesario para validar ObjectId
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
 * /api/v1/zones:
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
        console.error('❌ Error en GET /zones:', error);
        next(error);
    }
});

/**
 * @swagger
 * /api/v1/zones/{id}:
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
        if (zone) {
            res.status(200).json(zone);
        } else {
            res.status(404).json({ message: 'Zona no encontrada' });
        }
    } catch (error) {
        console.error(`❌ Error en GET /zones/${req.params.id}:`, error);
        next(error);
    }
});

/**
 * @swagger
 * /api/v1/zones:
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
        console.log('📝 POST /zones - Body:', req.body);
        const newZone = await service.create(req.body);
        res.status(201).json(newZone);
    } catch (error) {
        console.error('❌ Error en POST /zones:', error);
        next(error);
    }
});

/**
 * @swagger
 * /api/v1/zones/{id}:
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
 *         description: Zona no encontrado
 */
router.patch('/:id', async (req, res, next) => {
    try {
        console.log(`📝 PATCH /zones/${req.params.id} - Datos:`, req.body);
        
        const updated = await service.update(req.params.id, req.body);
        
        if (updated) {
            res.status(200).json(updated);
        } else {
            res.status(404).json({ message: 'Zona no encontrada' });
        }
    } catch (error) {
        console.error(`❌ Error en PATCH /zones/${req.params.id}:`, error);
        next(error);
    }
});

/**
 * @swagger
 * /api/v1/zones/{id}:
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
        const zoneId = req.params.id;
        console.log(`🗑️ DELETE /zones/${zoneId} - Iniciando`);
        
        // Validar ObjectId
        if (!mongoose.Types.ObjectId.isValid(zoneId)) {
            return res.status(400).json({
                message: 'ID inválido',
                error: 'El ID no es un ObjectId válido de MongoDB',
                id: zoneId
            });
        }
        
        console.log(`🗑️ Llamando a service.delete("${zoneId}")`);
        const result = await service.delete(zoneId);
        
        if (!result) {
            console.log(`❌ Zona no encontrada: ${zoneId}`);
            return res.status(404).json({
                message: 'Zona no encontrada',
                id: zoneId
            });
        }
        
        console.log(`✅ Zona eliminada: ${zoneId} - ${result.name}`);
        return res.status(200).json({
            message: 'Zona eliminada exitosamente',
            deletedZone: result
        });
        
    } catch (error) {
        console.error(`❌ ERROR EN DELETE /zones/${req.params.id}:`, {
            message: error.message,
            stack: error.stack,
            code: error.code,
            name: error.name
        });
        
        // Manejar error de dispositivos asociados
        if (error.message && error.message.includes('dispositivos asignados')) {
            return res.status(409).json({
                message: error.message,
                id: req.params.id
            });
        }
        
        next(error);
    }
});

module.exports = router;
