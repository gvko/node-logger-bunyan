"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bunyan = require("bunyan");
const bunyanPretty = require('bunyan-pretty');
const LogDnaBunyan = require('logdna-bunyan').BunyanStream;
/**
 * Creates and initializes the logger object.
 *
 * @param serviceName   {string}  The name of the current service, f.e. 'example-service-name'
 * @param logInTestEnv  {boolean} Specify whether the service should log in Test env or not
 * @param logDnaKey     {string}  Ingestion key for LogDNA
 * @return {*}
 */
function default_1(serviceName, logInTestEnv, logDnaKey) {
    const logger = bunyan.createLogger({
        name: process.env.HOSTNAME || serviceName,
        streams: []
    });
    let stream = {
        formatter: 'pretty',
        stream: bunyanPretty()
    };
    let logDestination = 'console';
    /*
     * Cases:
     * (1) If local dev env (NODE_ENV == 'default' or 'development') -> log only to console, from level 'debug'
     *
     * (2) If deployment env (NODE_ENV != 'default' or != 'development' or != 'test') -> log to Log Server (LogDNA)
     ** if logging of debug is enabled (DEBUG_ENABLE == 'true') -> log from 'debug' level, otherwise from 'info'
     */
    if (process.env.NODE_ENV === 'production') {
        if (!logDnaKey) {
            console.log('===> FATAL ERROR: Logging service ingestion key is not provided. Exiting now...');
            process.exit(1);
        }
        const logServerStream = {
            stream: new LogDnaBunyan({
                key: logDnaKey,
                hostname: process.env.NODE_ENV,
                index_meta: true
            }),
            type: 'raw'
        };
        Object.assign(stream, logServerStream);
        logDestination = 'LogDNA service';
    }
    if (process.env.NODE_ENV === 'test' && !logInTestEnv) {
        console.log(`===> TEST env... do not log`);
    }
    else {
        logger.addStream(Object.assign(stream));
        console.log(`===> Logging to ${logDestination}`);
    }
    return logger;
}
exports.default = default_1;
