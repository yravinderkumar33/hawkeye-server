const reports = require('./reports');
const { envVariables } = require('../helpers/envHelpers');
const bodyParser = require('body-parser')


module.exports = app => {
  app.use(`/${envVariables.BASE_REPORT_URL}`, bodyParser.json({ limit: '1mb' }), reports);
};