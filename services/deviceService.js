const Device = require('../models/device.model');

class DeviceService {
    async create(data) {
        try {
            const device = new Device(data);
            return await device.save();
        } catch (error) {
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
            throw error;
        }
    }

    async update(id, changes) {
        try {
            const { _id, __v, createdAt, ...updateData } = changes;

            const updated = await Device.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            ).populate('ownerId', 'name email role')
             .populate('zoneId', 'name description')
             .populate('sensors', 'type model');

            return updated;
        } catch (error) {
            throw error;
        }
    }

    async delete(id) {
        try {
            const device = await Device.findById(id);
            if (!device) return null;

            await Device.deleteOne({ _id: id });
            return { id: device._id, serialNumber: device.serialNumber };
        } catch (error) {
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
            throw error;
        }
    }
}

module.exports = new DeviceService();
