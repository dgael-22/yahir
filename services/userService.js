const User = require('../models/user.model');

class UserService {
    async create(data) {
        try {
            console.log('UserService.create - Datos recibidos:', {
                name: data.name,
                email: data.email,
                role: data.role,
                passwordLength: data.password ? data.password.length : 0
            });
            
            if (!data.password || data.password.length < 6) {
                throw new Error('La contraseña debe tener al menos 6 caracteres');
            }
            
            const user = new User({
                name: data.name,
                email: data.email,
                password: data.password, 
                role: data.role || 'viewer',
                isActive: data.isActive !== undefined ? data.isActive : true
            });
            
            console.log('🔧 Guardando usuario en MongoDB...');
            const savedUser = await user.save();
            
            console.log('Usuario guardado exitosamente:', savedUser._id);
            return savedUser;
            
        } catch (error) {
            console.error('ERROR EN UserService.create:', {
                message: error.message,
                code: error.code,
                name: error.name,
                errors: error.errors
            });
            throw error;
        }
    }

    async getAll() {
        try {
            return await User.find().select('-password');
        } catch (error) {
            console.error('ERROR EN UserService.getAll:', error);
            throw error;
        }
    }

    async getById(id) {
        try {
            return await User.findById(id).select('-password');
        } catch (error) {
            console.error('ERROR EN UserService.getById:', error);
            throw error;
        }
    }

    async update(id, changes) {
        try {
            const { _id, __v, createdAt, ...updateData } = changes;

            const updated = await User.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            ).select('-password');

            return updated;
        } catch (error) {
            console.error('ERROR EN UserService.update:', error);
            throw error;
        }
    }

    async delete(id) {
        try {
            console.log(`UserService.delete - Eliminando usuario: ${id}`);
            
            const deleted = await User.findByIdAndDelete(id);
            
            if (!deleted) {
                console.log(`Usuario no encontrado: ${id}`);
                return null;
            }
            
            console.log(`Usuario eliminado: ${id}`);
            return { 
                id: deleted._id, 
                email: deleted.email,
                name: deleted.name 
            };
        } catch (error) {
            console.error('ERROR EN UserService.delete:', error);
            throw error;
        }
    }

    async findByEmail(email) {
        try {
            return await User.findOne({ email });
        } catch (error) {
            console.error('ERROR EN UserService.findByEmail:', error);
            throw error;
        }
    }
}

module.exports = new UserService();
