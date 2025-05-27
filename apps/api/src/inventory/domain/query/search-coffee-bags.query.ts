import { Query } from '@nestjs-architects/typed-cqrs';
import { QueryHandler, IInferredQueryHandler } from '@nestjs/cqrs';
import { CoffeeBagModel } from '../model/coffee-bag.model';
import { Result, ResultAsync } from 'typescript-functional-extensions';
import { CoffeeBagRepository } from '../../infrastructure/repository/coffee-bag.repository';

export class SearchCoffeeBagsQuery extends Query<Result<CoffeeBagModel[]>> {
  constructor(public readonly nameSearch: string) {
    super();
  }
}
@QueryHandler(SearchCoffeeBagsQuery)
export class SearchCoffeeBagsQueryHandler
  implements IInferredQueryHandler<SearchCoffeeBagsQuery>
{
  constructor(private readonly coffeeBagRepository: CoffeeBagRepository) {}

  async execute({
    nameSearch,
  }: SearchCoffeeBagsQuery): Promise<Result<CoffeeBagModel[]>> {
    return ResultAsync.success()
      .bind(() => this.coffeeBagRepository.search(nameSearch))
      .toPromise();
  }
}
