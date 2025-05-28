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
    authentication: {
      secret: string;
      lifespan: number;
    };
    passwordReset: {
      secret: string;
    };
    issuer: string;
  };
  smtp: {
    host: string;
    port?: number;
    insecure?: boolean;
    username?: string;
    password?: string;
    sender: string;
  };
  passwordReset: {
    linkLifespan: number;
  };
}
