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
    sensors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sensor'
    }]
}, {
    timestamps: true
});

// Función de validación de referencias
async function validateReferences(doc, next) {
    try {
        // Verificar si los modelos existen
        let User, Zone;
        try {
            User = mongoose.model('User');
            Zone = mongoose.model('Zone');
        } catch (error) {
            // Si los modelos no están registrados, continuar sin validación
            return next();
        }

        if (doc.ownerId) {
            const user = await User.findById(doc.ownerId);
            if (!user) {
                const error = new Error('Owner (User) does not exist.');
                error.statusCode = 400;
                return next(error);
            }
        }

        if (doc.zoneId) {
            const zone = await Zone.findById(doc.zoneId);
            if (!zone) {
                const error = new Error('Zone does not exist.');
                error.statusCode = 400;
                return next(error);
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
    try {
        const update = this.getUpdate();
        
        // Obtener el documento actual si existe
        let currentDoc = null;
        if (this._conditions._id) {
            currentDoc = await this.model.findById(this._conditions._id);
        }
        
        const ownerId = update?.ownerId || (currentDoc?.ownerId);
        const zoneId = update?.zoneId || (currentDoc?.zoneId);

        if (ownerId || zoneId) {
            await validateReferences({ ownerId, zoneId }, next);
        } else {
            next();
        }
    } catch (error) {
        next(error);
    }
});

// Pre-hook para evitar eliminación si tiene sensores
deviceSchema.pre('deleteOne', { document: false, query: true }, async function(next) {
    try {
        const deviceId = this.getFilter()._id;
        const device = await this.model.findById(deviceId);
        
        if (device && device.sensors && device.sensors.length > 0) {
            const error = new Error('No se puede eliminar el dispositivo porque tiene sensores asignados');
            error.statusCode = 409;
            return next(error);
        }
        
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Device', deviceSchema);
