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

    async getAll(filters = {}) {
        try {
            const { sensorId, startDate, endDate, limit = 100, ...otherFilters } = filters;
            const query = { ...otherFilters };

            if (sensorId) query.sensorId = sensorId;
            if (startDate || endDate) {
                query.time = {};
                if (startDate) query.time.$gte = new Date(startDate);
                if (endDate) query.time.$lte = new Date(endDate);
            }

            return await Reading.find(query)
                .sort({ time: -1 })
                .limit(parseInt(limit))
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

    async getBySensorId(sensorId, limit = 50) {
        try {
            return await Reading.find({ sensorId })
                .sort({ time: -1 })
                .limit(limit)
                .populate('sensorId', 'type unit model');
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

    async getLatestBySensor(sensorId) {
        try {
            return await Reading.findOne({ sensorId })
                .sort({ time: -1 })
                .populate('sensorId', 'type unit model');
        } catch (error) {
            throw error;
        }
    }

    async getStatsBySensor(sensorId, startDate, endDate) {
        try {
            const match = { sensorId };
            if (startDate || endDate) {
                match.time = {};
                if (startDate) match.time.$gte = new Date(startDate);
                if (endDate) match.time.$lte = new Date(endDate);
            }

            const stats = await Reading.aggregate([
                { $match: match },
                {
                    $group: {
                        _id: '$sensorId',
                        count: { $sum: 1 },
                        avgValue: { $avg: '$value' },
                        minValue: { $min: '$value' },
                        maxValue: { $max: '$value' },
                        latestTime: { $max: '$time' }
                    }
                }
            ]);

            return stats[0] || null;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ReadingService();
