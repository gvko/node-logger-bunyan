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
export default function (serviceName: string, options?: Options): BunyanLogger;
