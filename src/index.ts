import * as bunyan from 'bunyan';

const bunyanPretty: any = require('bunyan-pretty');
const LogDnaBunyan: any = require('logdna-bunyan').BunyanStream;

export interface BunyanLogger {
  debug: any;
  info: any;
  error: any;
  warn: any;
  addStream: any;
}

/**
 * Creates and initializes the logger object.
 *
 * @param serviceName   {string}  The name of the current service, f.e. 'example-service-name'
 * @param logInTestEnv  {boolean} Specify whether the service should log in Test env or not
 * @param logDnaKey     {string}  Ingestion key for LogDNA
 * @return {*}
 */
export default function (serviceName: string, logInTestEnv: boolean, logDnaKey?: string): BunyanLogger {
  const logger: BunyanLogger = bunyan.createLogger({
    name: process.env.HOSTNAME || serviceName,
    streams: []
  });

  let stream: any = {
    formatter: 'pretty',
    stream: bunyanPretty()
  };

  let logDestination: string = 'console';

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

    const logServerStream: any = {
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
  } else {
    logger.addStream(Object.assign(stream));
    console.log(`===> Logging to ${logDestination}`);
  }

  return logger;
}
