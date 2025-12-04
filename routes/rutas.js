const userRouter = require('./user.routes');
const zoneRouter = require('./zone.routes');
const deviceRouter = require('./device.routes');
const sensorRouter = require('./sensor.routes');
const readingRouter = require('./reading.routes');


function routerApi(app) {
  app.use('/users', userRouter);
  app.use('/zones', zoneRouter);
  app.use('/devices', deviceRouter);
  app.use('/sensors', sensorRouter);
  app.use('/readings', readingRouter);
}

module.exports = routerApi;
