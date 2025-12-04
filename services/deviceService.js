async update(id, changes) {
    try {
        console.log(`DeviceService.update - ID: ${id}`);
        console.log(`Cambios recibidos:`, JSON.stringify(changes, null, 2));
        
        const existingDevice = await Device.findById(id);
        if (!existingDevice) {
            console.log(`Dispositivo no encontrado: ${id}`);
            return null;
        }
        
        console.log(`Dispositivo encontrado: ${existingDevice.serialNumber}`);
        
        const { _id, __v, createdAt, ...updateData } = changes;
        
        console.log(`Datos a actualizar:`, updateData);
        
        if (updateData.sensors && Array.isArray(updateData.sensors)) {
            const validSensors = updateData.sensors.filter(sensorId => 
                sensorId && mongoose.Types.ObjectId.isValid(sensorId) && sensorId !== "string"
            );
            
            if (validSensors.length !== updateData.sensors.length) {
                console.log(`Filtrados ${updateData.sensors.length - validSensors.length} sensores inválidos`);
            }
            
            updateData.sensors = validSensors;
            console.log(`Sensores válidos:`, validSensors);
        }
        
        if (Object.keys(updateData).length === 0) {
            console.log(`Sin cambios para aplicar, devolviendo dispositivo actual`);
            return await Device.findById(id)
                .populate('ownerId', 'name email role')
                .populate('zoneId', 'name description')
                .populate('sensors', 'type model');
        }
        
        console.log(`Ejecutando findByIdAndUpdate...`);
        const updated = await Device.findByIdAndUpdate(
            id,
            updateData,
            { 
                new: true, 
                runValidators: true,
                context: 'query' 
            }
        )
        .populate('ownerId', 'name email role')
        .populate('zoneId', 'name description')
        .populate('sensors', 'type model');
        
        if (!updated) {
            console.log(`Error: findByIdAndUpdate devolvió null`);
            return null;
        }
        
        console.log(`Dispositivo actualizado: ${updated.serialNumber}`);
        return updated;
        
    } catch (error) {
        console.error('ERROR EN DeviceService.update:', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            name: error.name,
            errors: error.errors
        });
        throw error;
    }
}
