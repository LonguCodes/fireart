import { Command } from '@nestjs-architects/typed-cqrs';
import { CommandHandler, IInferredCommandHandler } from '@nestjs/cqrs';
import { Maybe, Result } from 'typescript-functional-extensions';
import { TokenValueObject } from '../value-objects/token.value-object';
import { AuthErrors } from '../errors';
import bcrypt from 'bcryptjs';
import { Inject } from '@nestjs/common';
import { IdentityRepository } from '../../infrastructure/repository/identity.repository';
import { TokenService } from '../service/token.service';

export class SignInCommand extends Command<Result<TokenValueObject>> {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {
    super();
  }
}
@CommandHandler(SignInCommand)
export class SignInCommandHandler
  implements IInferredCommandHandler<SignInCommand>
{
  constructor(
    @Inject() private readonly identityRepository: IdentityRepository,
    @Inject()
    private readonly tokenService: TokenService,
  ) {}

  async execute({
    email,
    password,
  }: SignInCommand): Promise<Result<TokenValueObject>> {
    return Result.success()
      .bindAsync(() => this.identityRepository.findByEmail(email))
      .bind((identity) =>
        identity.toResult(AuthErrors.UsernameOrPasswordInvalid),
      )
      .ensure(
        (identity) => bcrypt.compareSync(password, identity.password),
        () => AuthErrors.UsernameOrPasswordInvalid,
      )
      .bind((identity) =>
        Maybe.some(identity.id)
          .bind((id) => this.tokenService.generateAccessToken(id))
          .toResult(AuthErrors.TokenGenerationFailed),
      )
      .map((token) => new TokenValueObject(token))
      .toPromise();
  }
}
