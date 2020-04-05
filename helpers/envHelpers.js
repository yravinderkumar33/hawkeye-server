'use strict'
const { get } = require('lodash')
const env = get(process, 'env')
const fs = require('fs')
const packageObj = JSON.parse(fs.readFileSync('package.json', 'utf8'));


const envVariables = {
    DB: {
        HOST: process.env.host || 'localhost',
        NAME: process.env.name || 'new2',
        PASSWORD: process.env.password || '',
        PORT: process.env.port || 5432
    },
    SERVER_PORT: get(env, 'sunbird_port') || get(process, 'env.PORT') || 3000,
    BASE_REPORT_URL: process.sunbird_base_report_url || 'report',
    TABLE_NAME: process.env.table_name || 'report',
    ENV: process.env.env || 'https://dev.sunbirded.org'
}

module.exports = { envVariables, packageObj };