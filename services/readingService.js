const Reading = require('../models/reading.model');

class ReadingService {
    async create(data) {
        try {
            const reading = new Reading(data);
            return await reading.save();
        } catch (error) {
            console.error('Error en ReadingService.create:', error);
            throw error;
        }
    }

    async getAll() {
        try {
            return await Reading.find()
                .sort({ time: -1 })
                .populate('sensorId', 'type unit model location isActive');
        } catch (error) {
            console.error('Error en ReadingService.getAll:', error);
            throw error;
        }
    }

    async getById(id) {
        try {
            return await Reading.findById(id).populate('sensorId', 'type unit model location isActive');
        } catch (error) {
            console.error('Error en ReadingService.getById:', error);
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
            ).populate('sensorId', 'type unit model location isActive');

            return updated;
        } catch (error) {
            console.error('Error en ReadingService.update:', error);
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
            console.error('Error en ReadingService.delete:', error);
            throw error;
        }
    }
}

module.exports = new ReadingService();
