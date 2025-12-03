const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['temperature', 'humidity', 'co2', 'noise'],
        trim: true
    },
    unit: {
        type: String,
        required: true,
        trim: true
    },
    model: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Pre-hook para evitar eliminación si el sensor tiene lecturas
sensorSchema.pre('deleteOne', { document: false, query: true }, async function(next) {
    const sensorId = this.getFilter()._id;
    const Reading = mongoose.model('Reading');

    const readingCount = await Reading.countDocuments({ sensorId: sensorId });

    if (readingCount > 0) {
        return next(new Error('No se puede eliminar el sensor porque tiene lecturas registradas'));
    }

    next();
});

module.exports = mongoose.model('Sensor', sensorSchema);
