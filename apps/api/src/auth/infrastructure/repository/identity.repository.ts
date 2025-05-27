import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { CONNECTION } from '../../../core/database/database.module';
import { IdentityModel } from '../../domain/models/identity.model';
import { Maybe, ResultAsync, Unit } from 'typescript-functional-extensions';
import bcrypt from 'bcryptjs';
import { AuthErrors } from '../../domain/errors';

@Injectable()
export class IdentityRepository {
  constructor(@Inject(CONNECTION) private readonly connection: Client) {}

  public findByEmail(email: string) {
    return ResultAsync.try(
      () =>
        this.connection.query<IdentityModel>(
          `select * from identity where email ilike $1 limit 1`,
          [email],
        ),
      () => AuthErrors.Internal,
    ).map((results) => Maybe.tryFirst(results.rows));
  }

  public create(email: string, password: string) {
    return ResultAsync.try(
      () =>
        this.connection.query(
          `select id from identity where email ilike $1 limit 1`,
          [email],
        ),
      () => AuthErrors.Internal,
    )
      .ensure(
        (result) => result.rows.length === 0,
        AuthErrors.DuplicateUsername,
      )
      .bind(() =>
        ResultAsync.try(
          () => this.generatePasswordHash(password),
          () => AuthErrors.Internal,
        ),
      )
      .map((passwordHash: string) =>
        this.connection.query(
          `insert into identity(email, password) values ($1,$2) returning id`,
          [email, passwordHash],
        ),
      )
      .map((result) =>
        Maybe.tryFirst(result.rows).map((row: IdentityModel) => row.id),
      );
  }

  public setPassword(id: string, password: string) {
    return ResultAsync.try(
      () =>
        this.connection.query(`select id from identity where id = $1 limit 1`, [
          id,
        ]),
      () => AuthErrors.Internal,
    )
      .ensure((result) => result.rows.length === 1, AuthErrors.UserNotFound)
      .bind(() =>
        ResultAsync.try(
          () => this.generatePasswordHash(password),
          () => AuthErrors.Internal,
        ),
      )
      .map((passwordHash: string) =>
        this.connection.query(
          `update identity set password = $1 where id = $2`,
          [passwordHash, id],
        ),
      )
      .map(() => Unit.Instance);
  }

  private generatePasswordHash(password: string) {
    return bcrypt.hash(password, 10);
  }
}
