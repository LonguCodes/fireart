import { Query } from '@nestjs-architects/typed-cqrs';
import { QueryHandler, IInferredQueryHandler } from '@nestjs/cqrs';
import { Result, ResultAsync } from 'typescript-functional-extensions';
import { CoffeeBagModel } from '../model/coffee-bag.model';
import { InventoryErrors } from '../errors';
import { CoffeeBagRepository } from '../../infrastructure/repository/coffee-bag.repository';

export class FindCoffeeBagQuery extends Query<Result<CoffeeBagModel>> {
  constructor(public readonly id: string) {
    super();
  }
}
@QueryHandler(FindCoffeeBagQuery)
export class FindCoffeeBagQueryHandler
  implements IInferredQueryHandler<FindCoffeeBagQuery>
{
  constructor(private readonly coffeeBagRepository: CoffeeBagRepository) {}

  async execute({ id }: FindCoffeeBagQuery): Promise<Result<CoffeeBagModel>> {
    return ResultAsync.success()
      .bind(() => this.coffeeBagRepository.findById(id))
      .bind((coffeeBagMaybe) =>
        coffeeBagMaybe.toResult(InventoryErrors.CoffeeBagNotFound),
      )
      .toPromise();
  }
}
