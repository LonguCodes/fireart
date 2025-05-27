import { Command } from '@nestjs-architects/typed-cqrs';
import { CommandHandler, IInferredCommandHandler } from '@nestjs/cqrs';
import { Result, Unit } from 'typescript-functional-extensions';
import { AuthErrors } from '../errors';
import { Inject } from '@nestjs/common';
import { IdentityRepository } from '../../infrastructure/repository/identity.repository';
import { PasswordResetRequestRepository } from '../../infrastructure/repository/password-reset-request.repository';
import { TokenService } from '../service/token.service';

export class ConfirmPasswordResetCommand extends Command<Unit> {
  constructor(
    public readonly token: string,
    public readonly newPassword: string,
  ) {
    super();
  }
}
@CommandHandler(ConfirmPasswordResetCommand)
export class ConfirmPasswordResetCommandHandler
  implements IInferredCommandHandler<ConfirmPasswordResetCommand>
{
  constructor(
    @Inject() private readonly identityRepository: IdentityRepository,
    @Inject()
    private readonly passwordResetRepository: PasswordResetRequestRepository,
    @Inject()
    private readonly tokenService: TokenService,
  ) {}

  async execute({
    token,
    newPassword,
  }: ConfirmPasswordResetCommand): Promise<Unit> {
    return Result.success(Unit.Instance)
      .bind(() =>
        this.tokenService
          .validatePasswordResetToken(token)
          .toResult(AuthErrors.InvalidToken),
      )
      .bindAsync((payload) =>
        this.passwordResetRepository.findById(payload.sub as string),
      )
      .bind((request) => request.toResult(AuthErrors.InvalidToken))
      .bind((request) =>
        this.identityRepository.setPassword(request.identityId, newPassword),
      )
      .toPromise();
  }
}
