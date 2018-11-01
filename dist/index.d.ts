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
 * @param serviceName {string}  The name of the current service, f.e. 'service-foodwaste'
 * @param key         {string}  The access key for the LaaS
 * @return {*}
 */
export declare function init(serviceName: string, key?: string): BunyanLogger;
