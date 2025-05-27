import { Command } from '@nestjs-architects/typed-cqrs';
import { CommandHandler, IInferredCommandHandler } from '@nestjs/cqrs';
import { Result, ResultAsync, Unit } from 'typescript-functional-extensions';
import { CoffeeBagRepository } from '../../infrastructure/repository/coffee-bag.repository';

export class UpdateCoffeeBagCommand extends Command<Result<Unit>> {
  constructor(
    public readonly id: string,
    public readonly name: string,
  ) {
    super();
  }
}
@CommandHandler(UpdateCoffeeBagCommand)
export class UpdateCoffeeBagCommandHandler
  implements IInferredCommandHandler<UpdateCoffeeBagCommand>
{
  constructor(private readonly coffeeBagRepository: CoffeeBagRepository) {}

  async execute({ id, name }: UpdateCoffeeBagCommand): Promise<Result<Unit>> {
    return ResultAsync.success()
      .bind(() => this.coffeeBagRepository.updateNameById(id, name))
      .toPromise();
  }
}
