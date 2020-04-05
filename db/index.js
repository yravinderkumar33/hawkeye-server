const { Pool } = require('pg')
const { envVariables } = require('../helpers/envHelpers');

const pool = new Pool({
  host: envVariables.DB.HOST,
  database: envVariables.DB.NAME,
  port: envVariables.DB.PORT,
})

module.exports = {
  query: (text, params) => pool.query(text, params)
}