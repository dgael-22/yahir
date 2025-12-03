const Sensor = require('../models/sensor.model');

class SensorService {
    async create(data) {
        try {
            const sensor = new Sensor(data);
            return await sensor.save();
        } catch (error) {
            throw error;
        }
    }

    async getAll() {
        try {
            return await Sensor.find();
        } catch (error) {
            throw error;
        }
    }

    async getById(id) {
        try {
            return await Sensor.findById(id);
        } catch (error) {
            throw error;
        }
    }

    async update(id, changes) {
        try {
            const { _id, __v, createdAt, ...updateData } = changes;

            const updated = await Sensor.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );

            return updated;
        } catch (error) {
            throw error;
        }
    }

    async delete(id) {
        try {
            const deleted = await Sensor.findByIdAndDelete(id);
            return deleted;
        } catch (error) {
            throw error;
        }
    }

    async getByType(type) {
        try {
            return await Sensor.find({ type, isActive: true });
        } catch (error) {
            throw error;
        }
    }

    async getActiveSensors() {
        try {
            return await Sensor.find({ isActive: true });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new SensorService();
