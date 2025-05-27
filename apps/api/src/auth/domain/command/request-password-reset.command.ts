import { CommandHandler, IInferredCommandHandler } from '@nestjs/cqrs';
import { Command } from '@nestjs-architects/typed-cqrs';
import { Result, Unit } from 'typescript-functional-extensions';
import { AuthErrors } from '../errors';
import { DateTime } from 'luxon';
import { Inject } from '@nestjs/common';
import { IdentityRepository } from '../../infrastructure/repository/identity.repository';
import { PasswordResetRequestRepository } from '../../infrastructure/repository/password-reset-request.repository';
import { TokenService } from '../service/token.service';
import { MAILER } from '../../../core/smtp/smtp.module';
import type { Transporter } from 'nodemailer';

export class RequestPasswordResetCommand extends Command<Result<Unit>> {
  constructor(public readonly email: string) {
    super();
  }
}

@CommandHandler(RequestPasswordResetCommand)
export class RequestPasswordResetCommandHandler
  implements IInferredCommandHandler<RequestPasswordResetCommand>
{
  constructor(
    @Inject() private readonly identityRepository: IdentityRepository,
    @Inject()
    private readonly passwordResetRepository: PasswordResetRequestRepository,
    @Inject()
    private readonly tokenService: TokenService,
    @Inject(MAILER)
    public readonly mailer: Transporter,
  ) {}

  async execute({ email }: RequestPasswordResetCommand): Promise<Result<Unit>> {
    return Result.success()
      .bindAsync(() => this.identityRepository.findByEmail(email))
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
      .tap(async (token) =>
        this.mailer.sendMail({
          to: email,
          subject: 'Reset your password',
          text: `To reset your password, go to https://example.com?token=${token}`,
        }),
      )
      .map(() => Unit.Instance)
      .toPromise();
  }
}
