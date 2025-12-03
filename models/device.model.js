const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    serialNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    model: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'maintenance', 'offline'],
        default: 'active'
    },
    installedAt: {
        type: Date,
        default: Date.now
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    zoneId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Zone',
        required: true
    },
    sensors: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sensor'
    }
}, {
    timestamps: true // Opcional: agrega createdAt y updatedAt
});

// Función de validación de referencias
async function validateReferences(doc, next) {
    try {
        const User = mongoose.model('User');
        const Zone = mongoose.model('Zone');

        if (doc.ownerId) {
            const user = await User.findById(doc.ownerId);
            if (!user) {
                return next(new Error('Owner (User) does not exist.'));
            }
        }

        if (doc.zoneId) {
            const zone = await Zone.findById(doc.zoneId);
            if (!zone) {
                return next(new Error('Zone does not exist.'));
            }
        }

        next();
    } catch (error) {
        next(error);
    }
}

// Middleware para save
deviceSchema.pre('save', async function (next) {
    await validateReferences(this, next);
});

// Middleware para update
deviceSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();
    const ownerId = update?.ownerId || this._conditions.ownerId;
    const zoneId = update?.zoneId || this._conditions.zoneId;

    if (ownerId || zoneId) {
        await validateReferences({ ownerId, zoneId }, next);
    } else {
        next();
    }
});

module.exports = mongoose.model('Device', deviceSchema);
