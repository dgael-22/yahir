router.patch('/:id', async (req, res, next) => {
    try {
        const deviceId = req.params.id;
        console.log(`PATCH /devices/${deviceId} - Iniciando`);
        
        if (!mongoose.Types.ObjectId.isValid(deviceId)) {
            console.log(`ID inválido: ${deviceId}`);
            return res.status(400).json({
                message: 'ID inválido',
                error: 'El ID del dispositivo no es un ObjectId válido',
                id: deviceId
            });
        }
        
        console.log(`Body recibido:`, JSON.stringify(req.body, null, 2));
        
        if (req.body.ownerId && !mongoose.Types.ObjectId.isValid(req.body.ownerId)) {
            console.log(`ownerId inválido: ${req.body.ownerId}`);
            return res.status(400).json({
                message: 'ownerId inválido',
                error: 'Debe ser un ObjectId válido (24 caracteres hexadecimales)',
                value: req.body.ownerId
            });
        }
        
        if (req.body.zoneId && !mongoose.Types.ObjectId.isValid(req.body.zoneId)) {
            console.log(`zoneId inválido: ${req.body.zoneId}`);
            return res.status(400).json({
                message: 'zoneId inválido',
                error: 'Debe ser un ObjectId válido (24 caracteres hexadecimales)',
                value: req.body.zoneId
            });
        }
        
        if (req.body.sensors && Array.isArray(req.body.sensors)) {
            const invalidSensors = req.body.sensors.filter(sensorId => 
                sensorId && sensorId !== "string" && !mongoose.Types.ObjectId.isValid(sensorId)
            );
            
            if (invalidSensors.length > 0) {
                console.log(`Sensores inválidos:`, invalidSensors);
                return res.status(400).json({
                    message: 'IDs de sensores inválidos',
                    error: 'Los IDs de sensores deben ser ObjectIds válidos',
                    invalidSensors: invalidSensors
                });
            }
        }
        
        console.log(`Llamando a service.update("${deviceId}")...`);
        const updated = await service.update(deviceId, req.body);
        
        if (updated) {
            console.log(`Dispositivo actualizado exitosamente: ${deviceId}`);
            res.status(200).json(updated);
        } else {
            console.log(`Dispositivo no encontrado: ${deviceId}`);
            res.status(404).json({ 
                message: 'Dispositivo no encontrado',
                id: deviceId 
            });
        }
        
    } catch (error) {
        console.error(`ERROR EN PATCH /devices/${req.params.id}:`, {
            message: error.message,
            stack: error.stack,
            code: error.code,
            name: error.name,
            body: req.body
        });
        
        if (error.code === 11000) {
            return res.status(409).json({
                message: 'El número de serie ya está registrado',
                field: 'serialNumber',
                value: req.body.serialNumber
            });
        }
        
        if (error.name === 'ValidationError') {
            const errors = {};
            for (let field in error.errors) {
                errors[field] = error.errors[field].message;
            }
            return res.status(400).json({
                message: 'Error de validación',
                errors: errors
            });
        }
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                message: 'Error de tipo de dato',
                error: `El campo '${error.path}' tiene un valor inválido`,
                value: error.value,
                expectedType: 'ObjectId'
            });
        }
        
        next(error);
    }
});
