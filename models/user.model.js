const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true,
        minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
        maxlength: [100, 'El nombre no puede exceder 100 caracteres']
    },
    email: {
        type: String,
        required: [true, 'El email es requerido'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Por favor ingresa un email válido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
    },
    role: {
        type: String,
        required: true,
        enum: {
            values: ['admin', 'technician', 'viewer'],
            message: '{VALUE} no es un rol válido'
        },
        default: 'viewer'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// ==============================================
// NO HAY MIDDLEWARE PRE-SAVE - ELIMINADO TEMPORALMENTE
// ==============================================

// ==============================================
// MÉTODO toJSON (elimina password)
// ==============================================
userSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.__v;
    return userObject;
};

module.exports = mongoose.model('User', userSchema);
