// swaggerDef.js
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'SmartCity Lab IoT Platform API',
    description: 'API para gestión de dispositivos IoT, sensores y lecturas',
    version: '1.0.0',
    contact: {
      name: 'Equipo SmartCity',
      email: 'contacto@smartcitylab.com',
    },
  },
  servers: [
    {
      url: 'https://yahir.onrender.com',
      description: 'Servidor de desarrollo',
    },
  ],
  tags: [
    { name: 'Users', description: 'Gestión de usuarios' },
    { name: 'Zones', description: 'Gestión de zonas' },
    { name: 'Devices', description: 'Gestión de dispositivos IoT' },
    { name: 'Sensors', description: 'Gestión de sensores' },
    { name: 'Readings', description: 'Lecturas de sensores' },
    { name: 'Health', description: 'Estado del sistema' },
  ],
  components: {
    schemas: {
      // Esquema Device
      Device: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            example: '60d21b4667d0d8992e610c85'
          },
          name: {
            type: 'string',
            example: 'Sensor de temperatura'
          },
          type: {
            type: 'string',
            enum: ['sensor', 'actuator', 'gateway'],
            example: 'sensor'
          },
          zoneId: {
            type: 'string',
            example: '60d21b4667d0d8992e610c86'
          },
          description: {
            type: 'string',
            example: 'Sensor para medir temperatura ambiente'
          },
          status: {
            type: 'string',
            enum: ['active', 'inactive', 'maintenance'],
            example: 'active'
          },
          lastSeen: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T10:30:00Z'
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      // Esquema Error
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false
          },
          message: {
            type: 'string'
          },
          error: {
            type: 'string'
          },
          timestamp: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      // Esquema Pagination
      Pagination: {
        type: 'object',
        properties: {
          page: {
            type: 'integer',
            example: 1
          },
          limit: {
            type: 'integer',
            example: 10
          },
          total: {
            type: 'integer',
            example: 100
          },
          pages: {
            type: 'integer',
            example: 10
          }
        }
      }
    },
    responses: {
      NotFound: {
        description: 'Recurso no encontrado',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      },
      BadRequest: {
        description: 'Solicitud incorrecta',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      }
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
};

module.exports = swaggerDefinition;
