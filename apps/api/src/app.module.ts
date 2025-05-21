import { Module } from '@nestjs/common';
import { ConfigModule, ConfigToken } from '@longucodes/config';
import { configSchema } from './core/config/config.schema';
import { DatabaseModule } from './core/database/database.module';
import { AppConfig } from './core/config/config.type';
import { AuthModule } from './auth/auth.module';
import { InventoryModule } from './inventory/inventory.module';
import { ResultResponseInterceptorModule } from '@startupdevhouse/typescript-functional-extensions-nestjs';
import { handleResult, mapData } from './core/common/results';
import { SmtpModule } from './core/smtp/smtp.module';

@Module({
  imports: [
    ResultResponseInterceptorModule.register({
      handleFn: handleResult,
      mappingFn: mapData,
    }),
    ConfigModule.forRoot({
      global: true,
      loadEnv: false,
      schema: configSchema,
    }),
    DatabaseModule.forRootAsync({
      global: true,
      inject: [ConfigToken],
      useFactory: (config: AppConfig) => config.database,
    }),
    SmtpModule.forRootAsync({
      global: true,
      inject: [ConfigToken],
      useFactory: (config: AppConfig) => config.smtp,
    }),
    AuthModule,
    InventoryModule,
  ],
})
export class AppModule {}
