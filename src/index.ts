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

export interface Options {
  logInTestEnv: boolean;
  logDnaKey?: string;
}

/**
 * Creates and initializes the logger object.
 *
 * @param serviceName {string}  The name of the current service, f.e. 'example-service-name'
 * @param options     {Options} Additional options. Important one is `logInTestEnv` which specifies whether the logger
 * should log when the running env is TEST
 * @return {*}
 */
export default function (serviceName: string, options?: Options): BunyanLogger {
  const opts: Options = options ? options : {} as Options;

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
    if (!opts.logDnaKey) {
      console.log('===> FATAL ERROR: Logging service ingestion key is not provided. Exiting now...');
      process.exit(1);
    }

    const logServerStream: any = {
      stream: new LogDnaBunyan({
        key: opts.logDnaKey,
        hostname: process.env.NODE_ENV,
        index_meta: true
      }),
      type: 'raw'
    };

    Object.assign(stream, logServerStream);
    logDestination = 'LogDNA service';
  }

  if (process.env.NODE_ENV === 'test' && !opts.logInTestEnv) {
    console.log(`===> TEST env... do not log`);
  } else {
    logger.addStream(Object.assign(stream));
    console.log(`===> Logging to ${logDestination}`);
  }

  return logger;
}
