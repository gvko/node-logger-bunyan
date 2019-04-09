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
 * @param serviceName {string}  The name of the current service, f.e. 'example-service-name'
 * @param opts        {Options} Additional options to consider when initializing the logger object
 * @return {*}
 */
export declare function init(serviceName: string, opts?: Options): BunyanLogger;
