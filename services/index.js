// services/index.js - Versión CORRECTA para MongoDB
const userService = require('./userService');
const zoneService = require('./zoneService');
const deviceService = require('./deviceService');
const sensorService = require('./sensorService');
const readingService = require('./readingService');

module.exports = {
  userService,
  zoneService,
  deviceService,
  sensorService,
  readingService
};