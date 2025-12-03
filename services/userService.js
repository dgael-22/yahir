const User = require('../models/user.model');

class UserService {
    async create(data) {
        try {
            const user = new User(data);
            return await user.save();
        } catch (error) {
            throw error;
        }
    }

    async getAll() {
        try {
            return await User.find().select('-password');
        } catch (error) {
            throw error;
        }
    }

    async getById(id) {
        try {
            return await User.findById(id).select('-password');
        } catch (error) {
            throw error;
        }
    }

    async update(id, changes) {
        try {
            // Excluir campos que no deben actualizarse directamente
            const { _id, __v, createdAt, ...updateData } = changes;

            if (updateData.password && updateData.password.length < 6) {
                throw new Error('La contraseña debe tener al menos 6 caracteres');
            }

            const updated = await User.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            ).select('-password');

            return updated;
        } catch (error) {
            throw error;
        }
    }

    async delete(id) {
        try {
            const deleted = await User.findByIdAndDelete(id);
            return deleted; // Returns the deleted document or null if not found
        } catch (error) {
            throw error;
        }
    }

    async findByEmail(email) {
        try {
            return await User.findOne({ email });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new UserService();
