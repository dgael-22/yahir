const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const Zone = require('../models/zone.model');
const Device = require('../models/device.model');
const Sensor = require('../models/sensor.model');
const Reading = require('../models/reading.model');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://PFinal312_db_user:contraseña312@cluster0.socxspj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const seedData = async () => {
    try {
        console.log('🌱 Starting database seeding...');

        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB for seeding...');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Zone.deleteMany({});
        await Device.deleteMany({});
        await Sensor.deleteMany({});
        await Reading.deleteMany({});
        console.log('✅ Data cleared successfully.');

        // Create Users
        console.log('👤 Creating users...');
        const hashedPassword = await bcrypt.hash('password123', 10);

        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@smartcity.com',
            password: hashedPassword,
            role: 'admin',
        });

        const technician = await User.create({
            name: 'John Technician',
            email: 'tech@smartcity.com',
            password: hashedPassword,
            role: 'technician',
        });

        const viewer = await User.create({
            name: 'Jane Viewer',
            email: 'viewer@smartcity.com',
            password: hashedPassword,
            role: 'viewer',
        });

        const users = [admin, technician, viewer];
        console.log(`✅ Created ${users.length} users`);

        // Create Zones
        console.log('📍 Creating zones...');
        const zones = await Zone.create([
            {
                name: 'Downtown',
                description: 'City center and business district',
                isActive: true
            },
            {
                name: 'Industrial Park',
                description: 'Factory and manufacturing area',
                isActive: true
            },
            {
                name: 'Residential Area',
                description: 'Housing and residential zone',
                isActive: true
            },
            {
                name: 'Green Park',
                description: 'Public park and recreational area',
                isActive: false
            }
        ]);
        console.log(`✅ Created ${zones.length} zones`);

        // Create Sensors
        console.log('📡 Creating sensors...');
        const sensors = await Sensor.create([
            {
                type: 'temperature',
                unit: '°C',
                model: 'TMP-100',
                location: '40.7128,-74.0060',
                isActive: true
            },
            {
                type: 'humidity',
                unit: '%',
                model: 'HUM-200',
                location: '40.7128,-74.0060',
                isActive: true
            },
            {
                type: 'co2',
                unit: 'ppm',
                model: 'AIR-300',
                location: '40.7589,-73.9851',
                isActive: true
            },
            {
                type: 'noise',
                unit: 'dB',
                model: 'MIC-400',
                location: '40.7589,-73.9851',
                isActive: true
            }
        ]);
        console.log(`✅ Created ${sensors.length} sensors`);

        // Create Devices
        console.log('💻 Creating devices...');
        const devices = await Device.create([
            {
                serialNumber: 'DEV-001',
                model: 'SmartLight-X1',
                status: 'active',
                ownerId: admin._id,
                zoneId: zones[0]._id,
                sensors: sensors[0]._id
            },
            {
                serialNumber: 'DEV-002',
                model: 'TrafficCam-Y2',
                status: 'maintenance',
                ownerId: technician._id,
                zoneId: zones[1]._id,
                sensors: sensors[1]._id
            },
            {
                serialNumber: 'DEV-003',
                model: 'AirQuality-Z3',
                status: 'active',
                ownerId: admin._id,
                zoneId: zones[2]._id,
                sensors: sensors[2]._id
            },
            {
                serialNumber: 'DEV-004',
                model: 'NoiseMonitor-W4',
                status: 'offline',
                ownerId: viewer._id,
                zoneId: zones[3]._id,
                sensors: sensors[3]._id
            }
        ]);
        console.log(`✅ Created ${devices.length} devices`);

        // Create Readings
        console.log('📊 Creating readings...');
        const readings = [];
        const now = new Date();

        for (let i = 0; i < 50; i++) {
            const sensor = sensors[Math.floor(Math.random() * sensors.length)];
            const hoursAgo = Math.floor(Math.random() * 24 * 7); // Última semana

            readings.push({
                sensorId: sensor._id,
                time: new Date(now.getTime() - hoursAgo * 60 * 60 * 1000),
                value: getRandomValueByType(sensor.type)
            });
        }

        await Reading.insertMany(readings);
        console.log(`✅ Created ${readings.length} readings`);

        console.log('🎉 Database seeded successfully!');
        console.log('\n📋 Summary:');
        console.log(`   Users: ${users.length}`);
        console.log(`   Zones: ${zones.length}`);
        console.log(`   Sensors: ${sensors.length}`);
        console.log(`   Devices: ${devices.length}`);
        console.log(`   Readings: ${readings.length}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error.message);
        console.error(error);
        process.exit(1);
    }
};

// Helper function to generate realistic values based on sensor type
function getRandomValueByType(type) {
    switch(type) {
        case 'temperature':
            return (Math.random() * 30 + 10).toFixed(1); // 10-40°C
        case 'humidity':
            return (Math.random() * 60 + 20).toFixed(1); // 20-80%
        case 'co2':
            return Math.floor(Math.random() * 1000 + 400); // 400-1400 ppm
        case 'noise':
            return Math.floor(Math.random() * 70 + 30); // 30-100 dB
        default:
            return Math.random() * 100;
    }
}

// Run seed if called directly
if (require.main === module) {
    seedData();
}

module.exports = { seedData };
