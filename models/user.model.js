const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

// Middleware para encriptar la contraseña antes de guardar
userSchema.pre('save', async function(next) {
    try {
        // Solo encriptar si la contraseña fue modificada
        if (!this.isModified('password')) return next();
        
        // Generar salt y encriptar
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Middleware para encriptar la contraseña en actualizaciones
userSchema.pre('findOneAndUpdate', async function(next) {
    try {
        const update = this.getUpdate();
        
        // Verificar si se está actualizando la contraseña
        if (update.password) {
            // Generar salt y encriptar
            const salt = await bcrypt.genSalt(10);
            update.password = await bcrypt.hash(update.password, salt);
            this.setUpdate(update);
        }
        next();
    } catch (error) {
        next(error);
    }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

// Pre-hook para evitar eliminación si el usuario tiene dispositivos
userSchema.pre(['deleteOne', 'findOneAndDelete'], { document: false, query: true }, async function(next) {
    try {
        const userId = this.getFilter()._id;
        let Device;
        
        try {
            Device = mongoose.model('Device');
        } catch (error) {
            // Si el modelo Device no está registrado, continuar sin validación
            return next();
        }

        const deviceCount = await Device.countDocuments({ ownerId: userId });

        if (deviceCount > 0) {
            const error = new Error('No se puede eliminar el usuario porque tiene dispositivos asignados');
            error.statusCode = 409;
            return next(error);
        }

        next();
    } catch (error) {
        next(error);
    }
});

// Método para obtener información pública del usuario (sin password)
userSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.__v;
    return userObject;
};

module.exports = mongoose.model('User', userSchema);
