declare module NodeJS  {
  interface Global {
    log: any;
  }
}

declare interface ObjectConstructor {
  assign(...objects: Object[]): Object;
}
