const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Por favor ingresa un email válido']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'technician', 'viewer'],
        default: 'viewer'
    }
}, {
    timestamps: true
});

// Pre-hook para evitar eliminación si el usuario tiene dispositivos
userSchema.pre('deleteOne', { document: false, query: true }, async function(next) {
    const userId = this.getFilter()._id;
    const Device = mongoose.model('Device');

    const deviceCount = await Device.countDocuments({ ownerId: userId });

    if (deviceCount > 0) {
        return next(new Error('No se puede eliminar el usuario porque tiene dispositivos asignados'));
    }

    next();
});

module.exports = mongoose.model('User', userSchema);
