const Zone = require('../models/zone.model');

class ZoneService {
    async create(data) {
        try {
            const zone = new Zone(data);
            return await zone.save();
        } catch (error) {
            console.error('🔥 ERROR EN ZoneService.create:', error);
            throw error;
        }
    }

    async getAll() {
        try {
            return await Zone.find();
        } catch (error) {
            console.error('🔥 ERROR EN ZoneService.getAll:', error);
            throw error;
        }
    }

    async getById(id) {
        try {
            return await Zone.findById(id);
        } catch (error) {
            console.error('🔥 ERROR EN ZoneService.getById:', error);
            throw error;
        }
    }

    async update(id, changes) {
        try {
            const { _id, __v, createdAt, ...updateData } = changes;

            const updated = await Zone.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );

            return updated;
        } catch (error) {
            console.error('🔥 ERROR EN ZoneService.update:', error);
            throw error;
        }
    }

    async delete(id) {
        try {
            console.log(`🔧 ZoneService.delete - Eliminando zona: ${id}`);
            
            // IMPORTANTE: Usar findByIdAndDelete (no deleteOne)
            const deleted = await Zone.findByIdAndDelete(id);
            
            if (!deleted) {
                console.log(`🔧 Zona no encontrada: ${id}`);
                return null;
            }
            
            console.log(`🔧 Zona eliminada: ${id} - ${deleted.name}`);
            return { 
                id: deleted._id, 
                name: deleted.name,
                description: deleted.description 
            };
        } catch (error) {
            console.error('🔥 ERROR EN ZoneService.delete:', error);
            throw error;
        }
    }

    async getActiveZones() {
        try {
            return await Zone.find({ isActive: true });
        } catch (error) {
            console.error('🔥 ERROR EN ZoneService.getActiveZones:', error);
            throw error;
        }
    }
}

module.exports = new ZoneService();
