const mongoose = require('mongoose');

const zoneSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// ==============================================
// MIDDLEWARE DE ELIMINACIÓN - COMENTADO TEMPORALMENTE
// ==============================================
/*
zoneSchema.pre(['deleteOne', 'findOneAndDelete'], { document: false, query: true }, async function(next) {
    const zoneId = this.getFilter()._id;
    const Device = mongoose.model('Device');

    const deviceCount = await Device.countDocuments({ zoneId: zoneId });

    if (deviceCount > 0) {
        return next(new Error('No se puede eliminar la zona porque tiene dispositivos asignados'));
    }

    next();
});
*/

module.exports = mongoose.model('Zone', zoneSchema);
