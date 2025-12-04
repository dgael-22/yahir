const Reading = require('../models/reading.model');

class ReadingService {
    async create(data) {
        try {
            console.log('ReadingService.create - Datos:', data);
            
            // Validar que sensorId sea ObjectId válido
            if (!data.sensorId || !data.sensorId.match(/^[0-9a-fA-F]{24}$/)) {
                throw new Error('sensorId debe ser un ObjectId válido');
            }
            
            const reading = new Reading({
                sensorId: data.sensorId,
                value: data.value,
                time: data.time || new Date()
            });
            
            console.log('ReadingService.create - Guardando...');
            const savedReading = await reading.save();
            
            console.log('ReadingService.create - Éxito:', savedReading._id);
            return savedReading;
            
        } catch (error) {
            console.error('ERROR EN ReadingService.create:', error.message, error.stack);
            throw error;
        }
    }

    async getAll() {
        try {
            return await Reading.find()
                .sort({ time: -1 })
                .populate('sensorId', 'type unit model');
        } catch (error) {
            console.error('ERROR EN ReadingService.getAll:', error);
            throw error;
        }
    }

    async getById(id) {
        try {
            return await Reading.findById(id).populate('sensorId', 'type unit model');
        } catch (error) {
            console.error('ERROR EN ReadingService.getById:', error);
            throw error;
        }
    }

    async update(id, changes) {
        try {
            const { _id, __v, createdAt, ...updateData } = changes;

            const updated = await Reading.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            ).populate('sensorId', 'type unit model');

            return updated;
        } catch (error) {
            console.error('ERROR EN ReadingService.update:', error);
            throw error;
        }
    }

    async delete(id) {
        try {
            const reading = await Reading.findById(id);
            if (!reading) return null;

            await Reading.deleteOne({ _id: id });
            return { id: reading._id, sensorId: reading.sensorId, time: reading.time };
        } catch (error) {
            console.error('ERROR EN ReadingService.delete:', error);
            throw error;
        }
    }
}

module.exports = new ReadingService();
