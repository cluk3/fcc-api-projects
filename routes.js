module.exports = function (app) {
  var api = require('./api');
  app.use('/', api);
};