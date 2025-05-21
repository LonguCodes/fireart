import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { CONNECTION } from '../../../core/database/database.module';
import { DateTime } from 'luxon';
import { Maybe, ResultAsync } from 'typescript-functional-extensions';
import { AuthErrors } from '../../domain/errors';
import { PasswordResetRequestModel } from '../../domain/models/password-reset-request.model';

@Injectable()
export class PasswordResetRequestRepository {
  constructor(@Inject(CONNECTION) private readonly connection: Client) {}

  public create(identityId: string, expireAt: DateTime) {
    return ResultAsync.try(
      () =>
        this.connection.query<PasswordResetRequestModel>(
          `insert into password_reset_request (identity_id, expire_at) values ( $1, $2) returning id , identity_id as "identityId", expire_at as "expireAt"`,
          [identityId, expireAt.toISO()],
        ),
      () => AuthErrors.Internal,
    ).map((result) => result.rows[0]);
  }

  public findById(id: string) {
    return ResultAsync.try(
      () =>
        this.connection.query<PasswordResetRequestModel>(
          `select id, identity_id as "identityId", expire_at as "expireAt" from password_reset_request where id = $1 and expire_at > now() limit 1`,
          [id],
        ),
      () => AuthErrors.Internal,
    ).map((result) => Maybe.tryFirst(result.rows));
  }
}
