export interface BunyanLogger {
    debug: any;
    info: any;
    error: any;
    warn: any;
    addStream: any;
}
export interface Options {
    logTestEnv: boolean;
    bottomLogLevel: string;
    key: string;
}
/**
 * Creates and initializes the logger object.
 *
 * @param serviceName   {string}  The name of the current service, f.e. 'example-service-name'
 * @param logInTestEnv  {boolean} Specify whether the service should log in Test env or not
 * @param logDnaKey     {string}  Ingestion key for LogDNA
 * @return {*}
 */
export default function (serviceName: string, logInTestEnv: boolean, logDnaKey: string): BunyanLogger;
