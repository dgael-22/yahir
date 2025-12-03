// importar los routers
const userRouter = require('./user.routes');
const zoneRouter = require('./zone.routes');
const deviceRouter = require('./device.routes');
const sensorRouter = require('./sensor.routes');
const readingRouter = require('./reading.routes');


function routerApi(app) {
  app.use('/users', userRouter); //monta el router de productRouter en la ruta /products para que sirvan desde la app principal
  app.use('/zones', zoneRouter);
  app.use('/devices', deviceRouter);
  app.use('/sensors', sensorRouter);
  app.use('/readings', readingRouter);
}

// exportar el router
module.exports = routerApi;
