import { Query } from '@nestjs-architects/typed-cqrs';
import { QueryHandler, IInferredQueryHandler } from '@nestjs/cqrs';
import { Result, ResultAsync } from 'typescript-functional-extensions';
import { CoffeeBagModel } from '../model/coffee-bag.model';
import { CoffeeBagRepository } from '../../infrastructure/repository/coffee-bag.repository';

export class GetAllCoffeeBagsQuery extends Query<Result<CoffeeBagModel[]>> {
  constructor() {
    super();
  }
}
@QueryHandler(GetAllCoffeeBagsQuery)
export class GetCoffeeBagsQueryHandler
  implements IInferredQueryHandler<GetAllCoffeeBagsQuery>
{
  constructor(private readonly coffeeBagRepository: CoffeeBagRepository) {}

  async execute(): Promise<Result<CoffeeBagModel[]>> {
    return ResultAsync.success()
      .bind(() => this.coffeeBagRepository.find())
      .toPromise();
  }
}
