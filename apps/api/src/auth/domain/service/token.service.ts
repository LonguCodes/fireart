import { Inject, Injectable } from '@nestjs/common';
import { type AppConfig } from '../../../core/config/config.type';
import { ConfigToken } from '@longucodes/config';
import { Maybe, Result, Unit } from 'typescript-functional-extensions';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { DateTime } from 'luxon';
import { PasswordResetRequestModel } from '../models/password-reset-request.model';
import { AuthErrors } from '../errors';

@Injectable()
export class TokenService {
  constructor(@Inject(ConfigToken) private readonly config: AppConfig) {}

  public generateAccessToken(identityId: string) {
    return Maybe.some(identityId).map(() =>
      jwt.sign(
        {
          iat: DateTime.now().toUnixInteger(),
          sub: identityId,
        },
        this.config.signing.authentication.secret,
        {
          expiresIn: this.config.signing.authentication.lifespan,
          notBefore: 0,
          issuer: this.config.signing.issuer,
        },
      ),
    );
  }

  public validateAccessToken(token: string): Result<JwtPayload> {
    return Result.try(
      () =>
        jwt.verify(
          token,
          this.config.signing.authentication.secret,
        ) as JwtPayload,
      () => AuthErrors.InvalidToken,
    );
  }

  public generatePasswordResetToken(
    passwordResetRequest: PasswordResetRequestModel,
  ) {
    return Maybe.some(passwordResetRequest).map(() =>
      jwt.sign(
        {
          iat: DateTime.now().toUnixInteger(),
          sub: passwordResetRequest.id,
          exp: DateTime.fromJSDate(
            passwordResetRequest.expireAt,
          ).toUnixInteger(),
        },
        this.config.signing.passwordReset.secret,
        {
          issuer: this.config.signing.issuer,
        },
      ),
    );
  }

  public validatePasswordResetToken(token: string): Maybe<JwtPayload> {
    return Maybe.from(
      Result.try(
        () => jwt.verify(token, this.config.signing.passwordReset.secret),
        () => AuthErrors.InvalidToken,
      ).match({
        success: (payload) => payload as JwtPayload,
        failure: () => Unit.Instance,
      }),
    );
  }
}
