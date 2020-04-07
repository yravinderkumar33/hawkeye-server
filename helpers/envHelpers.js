'use strict'
const { get } = require('lodash')
const env = get(process, 'env')
const fs = require('fs')
const packageObj = JSON.parse(fs.readFileSync('package.json', 'utf8'));


const envVariables = {
    DB: {
        HOST: env.DB_HOST || 'localhost',
        NAME: env.DB_NAME || 'new2',
        PASSWORD: env.DB_PASSWORD || '',
        PORT: env.DB_PORT || 5432,
        USER: env.DB_USER
    },
    SERVER_PORT: get(env, 'SUNBIRD_SERVER_PORT') || get(process, 'env.PORT') || 3000,
    BASE_REPORT_URL: process.SUNBIRD_BASE_REPORT_URL || 'report',
    TABLE_NAME: process.env.TABLE_NAME || 'report',
    ENV: process.env.ENV || 'https://dev.sunbirded.org'
}

module.exports = { envVariables, packageObj };