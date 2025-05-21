import {
  DynamicModule,
  Inject,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ModuleConfigFactory } from '../common/module-config-factory';
import { Client } from 'pg';
import * as migrations from './migrations';
import { Maybe, ResultAsync } from 'typescript-functional-extensions';

interface DatabaseModuleConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  insecure?: boolean;
  database: string;
}
const DATABASE_MODULE_CONFIG_TOKEN = Symbol('database-module-config');
export const CONNECTION = Symbol('database-client');

export class DatabaseModule implements OnApplicationBootstrap {
  public static forRootAsync(
    configFactory: ModuleConfigFactory<DatabaseModuleConfig>,
  ): DynamicModule {
    return {
      module: DatabaseModule,
      global: configFactory.global ?? false,
      providers: [
        {
          ...configFactory,
          provide: DATABASE_MODULE_CONFIG_TOKEN,
        },
        {
          provide: CONNECTION,
          inject: [DATABASE_MODULE_CONFIG_TOKEN],
          useFactory: async (config: DatabaseModuleConfig) => {
            try {
              const client = new Client({
                host: config.host,
                port: config.port,
                user: config.username,
                password: config.password,
                database: config.database,
                ssl: !config.insecure,
              });

              await client.connect();

              Logger.verbose(
                `Connected to database ${config.database} at ${config.host}:${config.port}`,
              );
              return client;
            } catch (e) {
              Logger.error(`Failed to connect to database ${config.database}`);
              throw e;
            }
          },
        },
      ],
      exports: [CONNECTION],
    };
  }

  constructor(@Inject(CONNECTION) private readonly connection: Client) {}

  async onApplicationBootstrap() {
    return ResultAsync.try(
      () =>
        this.connection.query(
          `create table if not exists migrations(id serial primary key, timestamp timestamp default now(), name text)`,
        ),
      () => 'Unable to initialize database',
    )
      .tapFailure(() => Logger.error('Failed to initialize database'))
      .map(() => this.connection.query('select name from migrations'))
      .map((result) => result.rows.map((row) => row.name))
      .bind((existingMigrations) =>
        ResultAsync.combineInOrder(
          Maybe.from(migrations)
            .map(Object.entries)
            .map((migrationEntries) =>
              migrationEntries.filter(
                ([name]) => !existingMigrations.includes(name),
              ),
            )
            .map((migrationEntries) =>
              migrationEntries.map(([name, migration]) => [
                name,
                ResultAsync.from(this.connection.query('begin;'))

                  .tap(() => migration(this.connection))
                  .tap(() =>
                    this.connection.query(
                      // Direct injection as a workaround of a non-compliant psql
                      `insert into migrations (name) values ( '${name}' );`,
                    ),
                  )
                  .tap(() => this.connection.query('commit;'))
                  .tapFailure((e) => {
                    Logger.error(`Migration ${name} failed: ${e}`);
                    return this.connection.query('rollback');
                  }),
              ]),
            )
            .map(Object.fromEntries)
            .getValueOrDefault({}),
        ),
      )

      .toPromise();
  }
}
