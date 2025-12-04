const Device = require('../models/device.model');

class DeviceService {
    async create(data) {
        try {
            console.log('🔧 DeviceService.create - Datos recibidos:', data);
            
            // Validar que ownerId y zoneId sean ObjectIds válidos
            const { ownerId, zoneId } = data;
            
            if (!ownerId || !zoneId) {
                throw new Error('ownerId y zoneId son requeridos');
            }
            
            const device = new Device({
                serialNumber: data.serialNumber,
                model: data.model,
                status: data.status || 'active',
                installedAt: data.installedAt || new Date(),
                ownerId: ownerId,
                zoneId: zoneId,
                sensors: data.sensors || []
            });
            
            const savedDevice = await device.save();
            
            // Populate después de guardar
            const populatedDevice = await Device.findById(savedDevice._id)
                .populate('ownerId', 'name email')
                .populate('zoneId', 'name')
                .populate('sensors', 'type model');
            
            console.log('✅ Dispositivo creado:', savedDevice._id);
            return populatedDevice;
            
        } catch (error) {
            console.error('🔥 ERROR EN DeviceService.create:', error);
            throw error;
        }
    }

    async getAll() {
        try {
            return await Device.find()
                .populate('ownerId', 'name email role')
                .populate('zoneId', 'name description')
                .populate('sensors', 'type model');
        } catch (error) {
            console.error('🔥 ERROR EN DeviceService.getAll:', error);
            throw error;
        }
    }

    async getById(id) {
        try {
            return await Device.findById(id)
                .populate('ownerId', 'name email role')
                .populate('zoneId', 'name description')
                .populate('sensors', 'type model');
        } catch (error) {
            console.error('🔥 ERROR EN DeviceService.getById:', error);
            throw error;
        }
    }

    async update(id, changes) {
        try {
            console.log(`🔧 DeviceService.update - ID: ${id}, Cambios:`, changes);
            
            const { _id, __v, createdAt, ...updateData } = changes;
            
            // Validar que los ObjectIds sean válidos si se envían
            if (updateData.ownerId && !updateData.ownerId.match(/^[0-9a-fA-F]{24}$/)) {
                throw new Error('ownerId no es un ObjectId válido');
            }
            if (updateData.zoneId && !updateData.zoneId.match(/^[0-9a-fA-F]{24}$/)) {
                throw new Error('zoneId no es un ObjectId válido');
            }
            
            const updated = await Device.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            ).populate('ownerId', 'name email role')
             .populate('zoneId', 'name description')
             .populate('sensors', 'type model');

            return updated;
        } catch (error) {
            console.error('🔥 ERROR EN DeviceService.update:', error);
            throw error;
        }
    }

    async delete(id) {
        try {
            console.log(`🔧 DeviceService.delete - Eliminando dispositivo: ${id}`);
            
            // Usar findByIdAndDelete (no deleteOne)
            const deleted = await Device.findByIdAndDelete(id);
            
            if (!deleted) {
                console.log(`🔧 Dispositivo no encontrado: ${id}`);
                return null;
            }
            
            console.log(`🔧 Dispositivo eliminado: ${id} - ${deleted.serialNumber}`);
            return { 
                id: deleted._id, 
                serialNumber: deleted.serialNumber,
                model: deleted.model 
            };
        } catch (error) {
            console.error('🔥 ERROR EN DeviceService.delete:', error);
            throw error;
        }
    }

    async getByStatus(status) {
        try {
            return await Device.find({ status })
                .populate('ownerId', 'name email role')
                .populate('zoneId', 'name description')
                .populate('sensors', 'type model');
        } catch (error) {
            console.error('🔥 ERROR EN DeviceService.getByStatus:', error);
            throw error;
        }
    }

    async getByZone(zoneId) {
        try {
            return await Device.find({ zoneId })
                .populate('ownerId', 'name email role')
                .populate('zoneId', 'name description')
                .populate('sensors', 'type model');
        } catch (error) {
            console.error('🔥 ERROR EN DeviceService.getByZone:', error);
            throw error;
        }
    }
}

module.exports = new DeviceService();
