const _ = require('lodash');
const { packageObj } = require('./envHelpers');
const { v1 } = require('uuid');

module.exports = {
    sendApiResponse: ({ id = 'api.report', responseCode = 'OK', result = {}, params: { err = null, errmsg = null, status = 'success', msgid = null } }) => {
        return {
            'id': id,
            'ver': _.get(packageObj, 'version') || "1.0",
            'ets': Date.now(),
            'params': {
                'resmsgid': v1(),
                'msgid': msgid,
                'status': status,
                'err': err,
                'errmsg': errmsg
            },
            'responseCode': responseCode,
            'result': result
        }
    }
}




