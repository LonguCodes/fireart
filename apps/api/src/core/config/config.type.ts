export interface AppConfig {
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    insecure?: boolean;
  };
  signing: {
    authentication: string;
    passwordReset: string;
  };
  smtp: {
    host: string;
    port?: number;
    insecure?: boolean;
    username?: string;
    password?: string;
    sender: string;
  }
}
