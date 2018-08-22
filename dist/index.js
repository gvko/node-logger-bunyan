'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const bunyan = require('bunyan');
const bunyanPretty = require('bunyan-pretty');
const LogDnaBunyan = require('logdna-bunyan').BunyanStream;
/**
 * Initializes the logger object and sets it as a global log object.
 *
 * @param serviceName {string}  The name of the current service, f.e. 'service-foodwaste'
 * @return {*}
 */
function init(serviceName) {
    /* We only declare DEBUG and INFO because they are the lowest levels that we need. Any other levels are higher:
     *  fatal  (60)
     *  error  (50)
     *  warn   (40)
     *  info   (30)
     *  debug  (20)
     *
     * By declaring DEBUG stream to be the console and INFO stream to be our logging server we say that anything from
     * DEBUG and above will be logged in console and anything from INFO and above will be logged in the server.
     * This way we get INFO and above to be in both console and server.
     */
    const logger = bunyan.createLogger({
        name: process.env.HOSTNAME || serviceName,
        streams: []
    });
    let stream = {
        formatter: 'pretty',
        stream: bunyanPretty()
    };
    let logDestination = 'console';
    let logLevel = 'debug';
    /*
     * Cases:
     * (1) If local dev env (NODE_ENV == 'default') -> log only to console, from level 'debug'
     *
     * (2) If deployment env (NODE_ENV != 'default' or != 'test') -> log to Log Server (LogDNA)
     ** if logging of debug is enabled (DEBUG_ENABLE == 'true') -> log from 'debug' level, otherwise from 'info'
     */
    if (!['default', 'test'].includes(process.env.NODE_ENV)) {
        // it's not local dev env -> case 2
        const logDnaKey = process.env.LOG_DNA_KEY;
        if (!logDnaKey) {
            console.log('*** FATAL ERROR: LogDNA ingestion key is not set as environment variable. Exiting now...');
            process.exit(1);
        }
        const logServerStream = {
            stream: new LogDnaBunyan({
                key: logDnaKey,
                hostname: process.env.ENVIRONMENT || `temp-wrong-env_${process.env.NODE_ENV}`,
                index_meta: true
            }),
            type: 'raw' // has to be used for LogDNA LaaS
        };
        Object.assign(stream, logServerStream);
        logDestination = 'the Log Server';
        // default is to log from 'debug' onward. But if it's not enabled, switch to log from 'info' onward
        if (process.env.DEBUG_ENABLE !== 'true') {
            logLevel = 'info';
        }
    }
    if (process.env.NODE_ENV !== 'test') {
        logger.addStream(Object.assign(stream, { level: logLevel }));
        console.log(`*** LOGGING TO ${logDestination} FROM LEVEL ${logLevel}`);
    }
    else {
        console.log(`*** TEST env... do not log`);
    }
    /*
     * Set the logger as global log object
     */
    global.log = logger;
}
exports.init = init;
