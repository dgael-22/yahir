const Zone = require('../models/zone.model');

class ZoneService {
    async create(data) {
        try {
            const zone = new Zone(data);
            return await zone.save();
        } catch (error) {
            throw error;
        }
    }

    async getAll() {
        try {
            return await Zone.find();
        } catch (error) {
            throw error;
        }
    }

    async getById(id) {
        try {
            return await Zone.findById(id);
        } catch (error) {
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
            throw error;
        }
    }

    async delete(id) {
        try {
            const zone = await Zone.findById(id);
            if (!zone) return null;

            await Zone.deleteOne({ _id: id });
            return { id: zone._id, name: zone.name };
        } catch (error) {
            throw error;
        }
    }

    async getActiveZones() {
        try {
            return await Zone.find({ isActive: true });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ZoneService();
