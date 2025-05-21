import { ModuleConfigFactory } from '../common/module-config-factory';
import { DynamicModule } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

interface SmtpModuleConfig {
  host: string;
  port?: number;
  insecure?: boolean;
  username?: string;
  password?: string;
  sender: string;
}
const SMTP_CONFIG = Symbol('smtp-config');
export const MAILER = Symbol('mailer');

export class SmtpModule {
  static forRootAsync(
    configFactory: ModuleConfigFactory<SmtpModuleConfig>,
  ): DynamicModule {
    return {
      module: SmtpModule,
      global: configFactory.global,
      providers: [
        { provide: SMTP_CONFIG, ...configFactory },
        {
          provide: MAILER,
          inject: [SMTP_CONFIG],
          useFactory: (config: SmtpModuleConfig) =>
            nodemailer.createTransport({
              host: config.host,
              port: config.port,
              from: config.sender,
              secure: !config.insecure,
              auth: {
                user: config.username,
                pass: config.password,
              },
            }),
        },
      ],
      exports: [MAILER],
    };
  }
}
