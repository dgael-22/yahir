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

sensorSchema.pre('findOneAndDelete', async function(next) {const sensorId = this.getQuery()._id;const Reading = mongoose.model('Reading');        console.log(`[PRE-HOOK] Verificando lecturas para sensor: ${sensorId}`);try {const readingCount = await Reading.countDocuments({ sensorId: sensorId });if (readingCount > 0) {            console.log(`[PRE-HOOK] Sensor tiene ${readingCount} lecturas, bloqueando eliminación`);return next(new Error(`No se puede eliminar el sensor porque tiene ${readingCount} lecturas registradas`));}                console.log(`[PRE-HOOK] Sensor OK para eliminar`);next();} catch (error) {        console.error(`[PRE-HOOK] Error:`, error);next(error);}});
 
module.exports = mongoose.model('Sensor', sensorSchema);
