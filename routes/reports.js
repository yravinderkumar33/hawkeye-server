const Router = require('express-promise-router');
const db = require('../db');
const router = new Router();
const _ = require('lodash');
const { envVariables } = require('../helpers/envHelpers');
const { sendApiResponse } = require('../helpers/apiResponse');
const { v4 } = require('uuid');

const REPORT_TABLE_NAME = _.get(envVariables, 'TABLE_NAME');
const SUCCESS_RESPONSE_CODE = 'OK';
const FAILED_RESPONSE_CODE = 'SERVER_ERROR';

const { validateCreateReportAPI, validateReadReportAPI, validateDeleteReportAPI, validateListReportAPI, validateUpdateReportAPI } = require('../middlewares/validators/validateReport');

module.exports = router;

router.get('/get/:reportId', validateReadReportAPI, async (req, res) => {
    const { reportId } = _.get(req, 'params');
    const id = _.get(req, 'id') || "api.report.get";
    try {
        const { rows, rowCount } = await db.query(`SELECT * FROM ${REPORT_TABLE_NAME} WHERE reportId = $1`, [reportId]);
        if (rowCount > 0) {
            const result = {
                reports: rows,
                count: rowCount
            }
            res.status(200).send(sendApiResponse({ id, responseCode: SUCCESS_RESPONSE_CODE, result, params: {} }));
        } else {
            res.status(404).send(sendApiResponse({ id, responseCode: FAILED_RESPONSE_CODE, params: { status: 'failed', errmsg: 'no report found' } }));
        }
    } catch (err) {
        res.status(500).send(sendApiResponse({ id, params: { err: JSON.stringify(err), status: 'failed', errmsg: _.get(err, 'message') }, responseCode: FAILED_RESPONSE_CODE }))
    }
});


router.post('/create', validateCreateReportAPI, async (req, res) => {
    const reqBody = _.get(req, 'body.request.report');
    const id = _.get(req, 'id') || "api.report.create";
    try {
        const reportid = _.get(reqBody, 'reportid') || v4();
        const reportaccessurl = _.get(reqBody, 'reportaccessurl') || `${envVariables.ENV}/dashBoard/reports/${reportid}`;
        const body = { reportid, reportaccessurl, ...reqBody };
        const query = `INSERT INTO ${REPORT_TABLE_NAME} (${_.join(_.keys(body), ',')}) SELECT ${_.join(_.keys(body), ',')} FROM jsonb_populate_record(NULL::${REPORT_TABLE_NAME}, '${JSON.stringify(body)}')`;
        const { rows, rowCount } = await db.query(query);
        const result = {
            reportId: reportid
        }
        res.status(200).send(sendApiResponse({ id, responseCode: SUCCESS_RESPONSE_CODE, result, params: {} }));
    } catch (err) {
        res.status(500).send(sendApiResponse({ id, params: { err: JSON.stringify(err), status: 'failed', errmsg: _.get(err, 'message') }, responseCode: FAILED_RESPONSE_CODE }));
    }
});


router.delete('/delete/:reportId', validateDeleteReportAPI, async (req, res) => {
    const id = _.get(req, 'id') || "api.report.delete";
    const { reportId } = _.get(req, 'params');
    try {
        const { rows, rowCount } = await db.query(`DELETE FROM ${REPORT_TABLE_NAME} WHERE reportId = $1`, [reportId]);
        console.log(rows, rowCount);
        if (rowCount > 0) {
            const result = {
                reportId
            }
            res.status(200).send(sendApiResponse({ id, responseCode: SUCCESS_RESPONSE_CODE, result, params: {} }));
        } else {
            res.status(404).send(sendApiResponse({ id, responseCode: FAILED_RESPONSE_CODE, params: { status: 'failed', errmsg: 'no report found' } }));
        }
    } catch (err) {
        res.status(500).send(sendApiResponse({ id, params: { err: JSON.stringify(err), status: 'failed', errmsg: _.get(err, 'message') }, responseCode: FAILED_RESPONSE_CODE }))
    }
});


router.patch('/update/:reportId', validateUpdateReportAPI, async (req, res) => {
    const id = _.get(req, 'id') || "api.report.update";
    const { reportId } = _.get(req, 'params');
    try {
        const query = `UPDATE ${REPORT_TABLE_NAME} SET title = 'hey new title' WHERE reportid = $1`
        const { rows, rowCount } = await db.query(query, [reportId]);

        res.send({
            reportId,
            rowCount,
            rows
        })

    } catch (err) {
        console.log(err);
        res.send({ err });
    }
});


router.post('/list', validateListReportAPI, async (req, res) => {
    const id = _.get(req, 'id') || "api.report.list";
    const filters = _.get(req, 'body.request.filters') || {};
    const whereClause = _.keys(filters).length ? `WHERE ${_.join(_.map(filters, (value, key) => `${key} IN (${_.join(_.map(value, val => `'${val}'`), ', ')})`), ' AND ')}` : '';
    try {
        const query = `SELECT * FROM ${REPORT_TABLE_NAME} ${whereClause}`;
        console.log(query);
        const { rows, rowCount } = await db.query(query);
        const result = {
            reports: rows,
            count: rowCount
        };
        res.status(200).send(sendApiResponse({ id, responseCode: SUCCESS_RESPONSE_CODE, result, params: {} }));
    } catch (err) {
        res.status(500).send(sendApiResponse({ id, params: { err: JSON.stringify(err), status: 'failed', errmsg: _.get(err, 'message') }, responseCode: FAILED_RESPONSE_CODE }))
    }
});

