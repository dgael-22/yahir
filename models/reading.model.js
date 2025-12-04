const mongoose = require('mongoose');

const readingSchema = new mongoose.Schema({
    sensorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sensor',
        required: true
    },
    time: {
        type: Date,
        default: Date.now,
        required: true
    },
    value: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

// Índice compuesto para búsquedas eficientes
readingSchema.index({ sensorId: 1, time: -1 });

module.exports = mongoose.model('Reading', readingSchema);
