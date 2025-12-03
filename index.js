const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDefinition = require('./swaggerDef');
const path = require('path');
const mongoose = require('mongoose'); 

const connectDB = require('./config/db');
const { logErrors, errorHandler } = require('./middlewares/errorHandler');

// Import routes
const userRoutes = require('./routes/user.routes');
const zoneRoutes = require('./routes/zone.routes');
const deviceRoutes = require('./routes/device.routes');
const sensorRoutes = require('./routes/sensor.routes');
const readingRoutes = require('./routes/reading.routes');

const app = express();
const port = process.env.PORT || 3000;

// Connect to Database
connectDB();

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logging
app.use(morgan('dev'));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files if needed
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const swaggerOptions = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Aquí irá la documentación de las rutas
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
console.log('📚 Swagger documentation available at /api-docs');
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// API Root
app.get('/', (req, res) => {
    res.json({
        message: '🌆 SmartCity Lab IoT Platform API',
        version: '1.0.0',
        endpoints: {
            users: '/api/v1/users',
            zones: '/api/v1/zones',
            devices: '/api/v1/devices',
            sensors: '/api/v1/sensors',
            readings: '/api/v1/readings',
            documentation: '/api-docs'
        }
    });
});

// API Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/zones', zoneRoutes);
app.use('/api/v1/devices', deviceRoutes);
app.use('/api/v1/sensors', sensorRoutes);
app.use('/api/v1/readings', readingRoutes);

// 404 Handler
app.use((req, res, next) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Cannot ${req.method} ${req.url}`,
        timestamp: new Date().toISOString()
    });
});

// Error Handling Middlewares

app.use(errorHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});

// Start server
const server = app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 API Base URL: http://localhost:${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});

module.exports = app;
