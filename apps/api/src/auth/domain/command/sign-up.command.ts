import { Command } from '@nestjs-architects/typed-cqrs';
import { CommandHandler, IInferredCommandHandler } from '@nestjs/cqrs';
import { Result, Unit } from 'typescript-functional-extensions';
import { Inject } from '@nestjs/common';
import { IdentityRepository } from '../../infrastructure/repository/identity.repository';

export class SignUpCommand extends Command<Result<Unit>> {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {
    super();
  }
}
@CommandHandler(SignUpCommand)
export class SignUpCommandHandler
  implements IInferredCommandHandler<SignUpCommand>
{
  constructor(
    @Inject() private readonly identityRepository: IdentityRepository,
  ) {}

  async execute({ email, password }: SignUpCommand): Promise<Result<Unit>> {
    return Result.success()
      .bindAsync(() => this.identityRepository.create(email, password))
      .map(() => Unit.Instance)
      .toPromise();
  }
}
