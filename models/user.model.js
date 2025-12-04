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

// ==============================================
// MIDDLEWARE DE SAVE - VERSIÓN SIMPLIFICADA
// ==============================================
userSchema.pre('save', function(next) {
    try {
        console.log(`[PRE-SAVE] Procesando usuario: ${this.email}`);
        
        // Solo validar longitud mínima por ahora
        if (this.password && this.password.length < 6) {
            const error = new Error('La contraseña debe tener al menos 6 caracteres');
            return next(error);
        }
        
        // TEMPORAL: No encriptar por ahora
        // this.password = 'plain_' + this.password;
        
        console.log(`[PRE-SAVE] Usuario ${this.email} listo para guardar`);
        next();
    } catch (error) {
        console.error(`[PRE-SAVE] Error:`, error);
        next(error);
    }
});

// ==============================================
// MÉTODO toJSON (elimina password)
// ==============================================
userSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.__v;
    return userObject;
};

// ==============================================
// MIDDLEWARE DE ELIMINACIÓN - COMENTADO TEMPORALMENTE
// ==============================================
/*
userSchema.pre('findOneAndDelete', { document: false, query: true }, async function(next) {
    try {
        console.log('[PRE-HOOK] Middleware de eliminación de usuario');
        
        // Verificar si 'next' es una función
        if (typeof next !== 'function') {
            console.error('[PRE-HOOK] Error: next no es una función');
            return;
        }
        
        const userId = this.getFilter ? this.getFilter()._id : this.getQuery()._id;
        
        if (!userId) {
            console.log('[PRE-HOOK] No se encontró userId, continuando');
            return next();
        }
        
        console.log(`[PRE-HOOK] Verificando dispositivos para usuario: ${userId}`);
        
        // Verificar si Device está disponible
        let DeviceModel;
        try {
            DeviceModel = mongoose.model('Device');
        } catch (err) {
            console.log('[PRE-HOOK] Modelo Device no disponible, saltando validación');
            return next();
        }
        
        // Validar ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.log(`[PRE-HOOK] userId no es válido: ${userId}`);
            return next();
        }
        
        const objectId = new mongoose.Types.ObjectId(userId);
        const deviceCount = await DeviceModel.countDocuments({ ownerId: objectId });
        
        console.log(`[PRE-HOOK] Usuario ${userId} tiene ${deviceCount} dispositivos`);
        
        if (deviceCount > 0) {
            const error = new Error(`No se puede eliminar el usuario porque tiene ${deviceCount} dispositivos asignados`);
            error.statusCode = 409;
            return next(error);
        }
        
        console.log(`[PRE-HOOK] Usuario ${userId} OK para eliminar`);
        next();
        
    } catch (error) {
        console.error('[PRE-HOOK] Error en middleware:', error);
        
        if (typeof next === 'function') {
            return next(error);
        }
        
        console.error('[PRE-HOOK] next no disponible, continuando sin error');
    }
});
*/

module.exports = mongoose.model('User', userSchema);
