import { Command } from '@nestjs-architects/typed-cqrs';
import { CommandHandler, IInferredCommandHandler } from '@nestjs/cqrs';
import { Result, ResultAsync } from 'typescript-functional-extensions';
import { DateTime } from 'luxon';
import { CoffeeBagRepository } from '../../infrastructure/repository/coffee-bag.repository';
import { CoffeeBagModel } from '../model/coffee-bag.model';

export class CreateCoffeeBagCommand extends Command<Result<CoffeeBagModel>> {
  constructor(
    public readonly name: string,
    public readonly roastedOn: string,
  ) {
    super();
  }
}
@CommandHandler(CreateCoffeeBagCommand)
export class CreateCoffeeBagCommandHandler
  implements IInferredCommandHandler<CreateCoffeeBagCommand>
{
  constructor(private readonly coffeeBagRepository: CoffeeBagRepository) {}

  async execute({
    name,
    roastedOn,
  }: CreateCoffeeBagCommand): Promise<Result<CoffeeBagModel>> {
    return ResultAsync.success()
      .bind(() =>
        this.coffeeBagRepository.create(
          name,
          DateTime.fromISO(roastedOn).toJSDate(),
        ),
      )
      .toPromise();
  }
}
