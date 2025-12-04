const User = require('../models/user.model');

class UserService {
    async create(data) {
        try {
            console.log('🔧 UserService.create - Datos recibidos:', {
                name: data.name,
                email: data.email,
                role: data.role
            });
            
            const user = new User(data);
            const savedUser = await user.save();
            
            console.log('🔧 Usuario guardado en DB:', savedUser._id);
            
            // El modelo YA elimina password con toJSON()
            return savedUser;
            
        } catch (error) {
            console.error('🔥 ERROR EN UserService.create:', error);
            throw error;
        }
    }

    async getAll() {
        try {
            return await User.find().select('-password');
        } catch (error) {
            console.error('🔥 ERROR EN UserService.getAll:', error);
            throw error;
        }
    }

    async getById(id) {
        try {
            return await User.findById(id).select('-password');
        } catch (error) {
            console.error('🔥 ERROR EN UserService.getById:', error);
            throw error;
        }
    }

    async update(id, changes) {
        try {
            const { _id, __v, createdAt, ...updateData } = changes;

            // NO validar password aquí - el middleware lo hace
            
            const updated = await User.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            ).select('-password');

            return updated;
        } catch (error) {
            console.error('🔥 ERROR EN UserService.update:', error);
            throw error;
        }
    }

    async delete(id) {
        try {
            // Usa findByIdAndDelete para que se ejecuten los middlewares
            const deleted = await User.findByIdAndDelete(id);
            
            if (!deleted) return null;
            
            return { 
                id: deleted._id, 
                email: deleted.email,
                name: deleted.name 
            };
        } catch (error) {
            console.error('🔥 ERROR EN UserService.delete:', error);
            throw error;
        }
    }

    async findByEmail(email) {
        try {
            return await User.findOne({ email });
        } catch (error) {
            console.error('🔥 ERROR EN UserService.findByEmail:', error);
            throw error;
        }
    }
}

module.exports = new UserService();
