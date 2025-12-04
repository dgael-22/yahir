const Reading = require('../models/reading.model');

class ReadingService {
    async create(data) {
        try {
            console.log('ReadingService.create - Datos:', data);
            
            const reading = new Reading({
                sensorId: data.sensorId,
                value: data.value,
                time: data.time || new Date()
            });
            
            const savedReading = await reading.save();
            console.log('Reading creado:', savedReading._id);
            
            const populated = await Reading.findById(savedReading._id)
                .populate('sensorId', 'type unit model');
            
            return populated;
            
        } catch (error) {
            console.error('ERROR EN ReadingService.create:', error.message);
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
            const deleted = await Reading.findByIdAndDelete(id);
            
            if (!deleted) return null;
            
            return { 
                id: deleted._id, 
                sensorId: deleted.sensorId, 
                time: deleted.time 
            };
        } catch (error) {
            console.error('ERROR EN ReadingService.delete:', error);
            throw error;
        }
    }
}

module.exports = new ReadingService();
