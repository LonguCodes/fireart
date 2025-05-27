import { Command } from '@nestjs-architects/typed-cqrs';
import { CommandHandler, IInferredCommandHandler } from '@nestjs/cqrs';
import { Result, ResultAsync, Unit } from 'typescript-functional-extensions';
import { CoffeeBagRepository } from '../../infrastructure/repository/coffee-bag.repository';

export class DeleteCoffeeBagCommand extends Command<Result<Unit>> {
  constructor(public readonly id: string) {
    super();
  }
}
@CommandHandler(DeleteCoffeeBagCommand)
export class DeleteCoffeeBagCommandHandler
  implements IInferredCommandHandler<DeleteCoffeeBagCommand>
{
  constructor(private readonly coffeeBagRepository: CoffeeBagRepository) {}

  async execute({ id }: DeleteCoffeeBagCommand): Promise<Result<Unit>> {
    return ResultAsync.success()
      .bind(() => this.coffeeBagRepository.deleteById(id))
      .toPromise();
  }
}
