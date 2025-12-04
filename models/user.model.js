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

/*
// Middleware para encriptar la contraseña antes de guardar
userSchema.pre('save', async function(next) {
    try {
        console.log(`[PRE-SAVE] Procesando usuario: ${this.email}`);
        
        if (!this.isModified('password')) {
            console.log(`[PRE-SAVE] Contraseña no modificada`);
            return next();
        }
        
        console.log(`[PRE-SAVE] Encriptando contraseña para: ${this.email}`);
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        
        console.log(`[PRE-SAVE] Contraseña encriptada exitosamente`);
        next();
    } catch (error) {
        console.error(`[PRE-SAVE] Error al encriptar contraseña:`, error);
        next(error);
    }
});
*/

// Y pon ESTO en su lugar (sin encriptación temporal):
userSchema.pre('save', function(next) {
    console.log(`[PRE-SAVE] Usuario: ${this.email}, Contraseña: ${this.password}`);
    
    // Solo validar longitud
    if (this.password && this.password.length < 6) {
        const error = new Error('La contraseña debe tener al menos 6 caracteres');
        return next(error);
    }

// Método para obtener información pública del usuario (sin password)
userSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.__v;
    return userObject;
};

// Pre-hook para evitar eliminación si el usuario tiene dispositivos
userSchema.pre('findOneAndDelete', async function(next) {
    try {
        const userId = this.getQuery()._id;
        
        console.log(`[PRE-HOOK] Verificando dispositivos del usuario: ${userId}`);
        
        // Obtener el modelo Device (igual que Sensor hace con Reading)
        const Device = mongoose.model('Device');
        
        // CORRECTO: En Device es ownerId, NO userId
        const deviceCount = await Device.countDocuments({ ownerId: userId });
        
        if (deviceCount > 0) {
            const error = new Error(`No se puede eliminar el usuario porque tiene ${deviceCount} dispositivos asignados`);
            error.statusCode = 409;
            return next(error);
        }
        
        console.log(`[PRE-HOOK] Usuario OK para eliminar`);
        next();
    } catch (error) {
        console.error(`[PRE-HOOK] Error en usuario:`, error);
        next(error);
    }
});

module.exports = mongoose.model('User', userSchema);
