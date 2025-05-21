import { Body, Controller, Inject, Post } from '@nestjs/common';
import { IsPublic } from '../decorators/is-public';
import { CredentialsRequest } from '../request/credentials.request';
import { Maybe, Result, Unit } from 'typescript-functional-extensions';
import { IdentityRepository } from '../../infrastructure/repository/identity.repository';
import { PasswordResetRequestRepository } from '../../infrastructure/repository/password-reset-request.repository';
import { TokenService } from '../../domain/service/token.service';
import { AuthErrors } from '../../domain/errors';
import bcrypt from 'bcryptjs';
import { PasswordResetRequest } from '../request/password-reset.request';
import { DateTime } from 'luxon';
import { PasswordResetConfirmationRequest } from '../request/password-reset-confirmation.request';
import { MAILER } from '../../../core/smtp/smtp.module';
import { type Transporter } from 'nodemailer';

@Controller('auth')
@IsPublic()
export class AuthController {
  constructor(
    @Inject() private readonly identityRepository: IdentityRepository,
    @Inject()
    private readonly passwordResetRepository: PasswordResetRequestRepository,
    @Inject()
    private readonly tokenService: TokenService,
    @Inject(MAILER)
    public readonly mailer: Transporter,
  ) {}

  @Post('sign-up')
  public signUp(@Body() body: CredentialsRequest) {
    return Result.success()
      .bindAsync(() =>
        this.identityRepository.create(body.email, body.password),
      )
      .bind((maybeId) =>
        maybeId
          .bind((id) => this.tokenService.generateAccessToken(id))
          .toResult(AuthErrors.TokenGenerationFailed),
      )
      .map((token) => ({
        token,
      }))
      .toPromise();
  }

  @Post('sign-in')
  public signIn(@Body() body: CredentialsRequest) {
    return Result.success()
      .bindAsync(() => this.identityRepository.findByUsername(body.email))
      .bind((identity) =>
        identity.toResult(AuthErrors.UsernameOrPasswordInvalid),
      )
      .ensure(
        (identity) => bcrypt.compareSync(body.password, identity.password),
        () => AuthErrors.UsernameOrPasswordInvalid,
      )
      .bind((identity) =>
        Maybe.some(identity.id)
          .bind((id) => this.tokenService.generateAccessToken(id))
          .toResult(AuthErrors.TokenGenerationFailed),
      )
      .map((token) => ({
        token,
      }))
      .toPromise();
  }

  @Post('reset-password')
  public resetPassword(@Body() body: PasswordResetRequest) {
    return Result.success()
      .bindAsync(() => this.identityRepository.findByUsername(body.email))
      .ensure(
        (maybeIdentity) => maybeIdentity.hasValue,
        () => AuthErrors.UserNotFound,
      )
      .map((identity) => identity.getValueOrThrow())
      .bind((identity) =>
        this.passwordResetRepository.create(
          identity.id,
          DateTime.now().plus({ hour: 6 }),
        ),
      )
      .bind((request) =>
        this.tokenService
          .generatePasswordResetToken(request)
          .toResult(AuthErrors.TokenGenerationFailed),
      )
      .tap((token) =>
        this.mailer.sendMail({
          to: body.email,
          text: `To reset your password, go to https://example.com?token=${token}`,
        }),
      )
      .map(() => Unit.Instance)
      .toPromise();
  }

  @Post('reset-password/confirm')
  public confirmPasswordReset(@Body() body: PasswordResetConfirmationRequest) {
    return Result.success()
      .bind(() =>
        this.tokenService
          .validatePasswordResetToken(body.token)
          .toResult(AuthErrors.InvalidToken),
      )
      .bindAsync((payload) =>
        this.passwordResetRepository.findById(payload.sub as string),
      )
      .bind((request) => request.toResult(AuthErrors.InvalidToken))
      .bind((request) =>
        this.identityRepository.setPassword(request.identityId, body.password),
      )
      .map(() => Unit.Instance)
      .toPromise();
  }
}
