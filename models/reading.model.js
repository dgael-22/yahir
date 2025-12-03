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

// Pre-hook para validar que el sensor existe
readingSchema.pre('save', async function(next) {
    try {
        const Sensor = mongoose.model('Sensor');
        const sensor = await Sensor.findById(this.sensorId);

        if (!sensor) {
            return next(new Error('El sensor no existe'));
        }

        // Verificar que el sensor esté activo
        if (!sensor.isActive) {
            return next(new Error('El sensor no está activo'));
        }

        next();
    } catch (error) {
        next(error);
    }
});

// Pre-hook para validar en actualizaciones
readingSchema.pre('findOneAndUpdate', async function(next) {
    try {
        const update = this.getUpdate();
        const sensorId = update.sensorId || this._conditions.sensorId;

        if (sensorId) {
            const Sensor = mongoose.model('Sensor');
            const sensor = await Sensor.findById(sensorId);

            if (!sensor) {
                return next(new Error('El sensor no existe'));
            }

            if (!sensor.isActive) {
                return next(new Error('El sensor no está activo'));
            }
        }

        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Reading', readingSchema);
