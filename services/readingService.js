const Reading = require('../models/reading.model');

class ReadingService {
    async create(data) {
        try {
            const reading = new Reading(data);
            return await reading.save();
        } catch (error) {
            throw error;
        }
    }

    async getAll() {
        try {
            return await Reading.find()
                .sort({ time: -1 })
                .populate('sensorId', 'type unit model');
        } catch (error) {
            throw error;
        }
    }

    async getById(id) {
        try {
            return await Reading.findById(id).populate('sensorId', 'type unit model');
        } catch (error) {
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
            throw error;
        }
    }
}

module.exports = new ReadingService();
