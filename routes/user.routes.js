const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { userService: service } = require('../services');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints para gestionar usuarios
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - role
 *       properties:
 *         id:
 *           type: string
 *           description: ID auto-generado del usuario
 *         name:
 *           type: string
 *           description: Nombre del usuario
 *         email:
 *           type: string
 *           description: Email único del usuario
 *         password:
 *           type: string
 *           description: Contraseña encriptada
 *         role:
 *           type: string
 *           enum: [admin, technician, viewer]
 *           description: Rol del usuario
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
 * /api/v1/users:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/', async (req, res, next) => {
    try {
        const users = await service.getAll();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error en GET /users:', error);
        next(error);
    }
});


/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Obtiene un usuario por su ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/:id', async (req, res, next) => {
    try {
        const user = await service.getById(req.params.id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error(`Error en GET /users/${req.params.id}:`, error);
        next(error);
    }
});

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del usuario
 *                 example: "Juan Pérez"
 *               email:
 *                 type: string
 *                 description: Email único del usuario
 *                 example: "juan.perez@example.com"
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *                 example: "miContraseña123"
 *               role:
 *                 type: string
 *                 enum: [admin, technician, viewer]
 *                 description: Rol del usuario
 *                 example: "technician"
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: El email ya está registrado
 */
router.post('/', async (req, res, next) => {
    try {
        console.log('POST /users - Body recibido:', req.body);
        
        // Validación básica
        const { name, email, password, role } = req.body;
        
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                message: 'Faltan campos requeridos',
                required: ['name', 'email', 'password', 'role']
            });
        }
        
        if (password.length < 6) {
            return res.status(400).json({
                message: 'La contraseña debe tener al menos 6 caracteres',
                field: 'password'
            });
        }
        
        console.log('Llamando a service.create()...');
        const newUser = await service.create(req.body);
        
        console.log('Usuario creado exitosamente:', newUser._id);
        res.status(201).json(newUser);
        
    } catch (error) {
        console.error('ERROR EN POST /users:', {
            message: error.message,
            code: error.code,
            name: error.name,
            stack: error.stack
        });
        
        if (error.code === 11000 || error.name === 'MongoServerError') {
            return res.status(409).json({
                message: 'El email ya está registrado',
                field: 'email'
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
 * /api/v1/users/{id}:
 *   patch:
 *     summary: Actualiza un usuario por su ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del usuario
 *               email:
 *                 type: string
 *                 description: Email único del usuario
 *               password:
 *                 type: string
 *                 description: Nueva contraseña del usuario
 *               role:
 *                 type: string
 *                 enum: [admin, technician, viewer]
 *                 description: Rol del usuario
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Usuario no encontrado
 *       409:
 *         description: El email ya está registrado por otro usuario
 */
router.patch('/:id', async (req, res, next) => {
    try {
        console.log(`PATCH /users/${req.params.id} - Datos:`, req.body);
        
        const updated = await service.update(req.params.id, req.body);
        
        if (updated) {
            res.status(200).json(updated);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error(`ERROR EN PATCH /users/${req.params.id}:`, error);
        
        if (error.code === 11000 || error.name === 'MongoServerError') {
            return res.status(409).json({
                message: 'El email ya está registrado por otro usuario',
                error: error.message
            });
        }
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Error de validación',
                error: error.message,
                details: error.errors
            });
        }
        
        next(error);
    }
});


/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Elimina un usuario por su ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario eliminado"
 *       404:
 *         description: Usuario no encontrado
 *       409:
 *         description: No se puede eliminar porque tiene dispositivos asignados
 */
router.delete('/:id', async (req, res, next) => {
    try {
        const userId = req.params.id;
        console.log(`DELETE /users/${userId} - Iniciando`);
        
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: 'ID inválido',
                error: 'El ID no es un ObjectId válido de MongoDB',
                id: userId
            });
        }
        
        console.log(`Llamando a service.delete("${userId}")`);
        const result = await service.delete(userId);
        
        if (!result) {
            console.log(`Usuario no encontrado: ${userId}`);
            return res.status(404).json({
                message: 'Usuario no encontrado',
                id: userId
            });
        }
        
        console.log(`Usuario eliminado: ${userId}`);
        return res.status(200).json({
            message: 'Usuario eliminado exitosamente',
            deletedUser: result
        });
        
    } catch (error) {
        console.error(`ERROR EN DELETE /users/${req.params.id}:`, {
            message: error.message,
            stack: error.stack,
            code: error.code,
            name: error.name
        });
        
        if (error.message && error.message.includes('dispositivos asignados')) {
            return res.status(409).json({
                message: error.message,
                id: req.params.id
            });
        }
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                message: 'ID inválido',
                error: 'Formato de ID incorrecto',
                id: req.params.id
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

module.exports = router;
