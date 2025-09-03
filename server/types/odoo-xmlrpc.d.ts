declare module 'odoo-xmlrpc' {
  interface OdooConfig {
    url: string;
    port: number;
    db: string;
    username: string;
    password: string;
  }

  interface OdooInstance {
    uid: number;
    connect(callback: (err: any) => void): void;
    execute_kw(
      model: string,
      method: string,
      params: any[],
      callback: (err: any, result: any) => void
    ): void;
  }

  class Odoo implements OdooInstance {
    constructor(config: OdooConfig);
    uid: number;
    connect(callback: (err: any) => void): void;
    execute_kw(
      model: string,
      method: string,
      params: any[],
      callback: (err: any, result: any) => void
    ): void;
  }

  export = Odoo;
}
