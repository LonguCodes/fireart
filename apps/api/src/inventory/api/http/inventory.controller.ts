import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SearchInventoryRequestQuery } from '../query/search-inventory.request-query';
import { ResultAsync, Unit } from 'typescript-functional-extensions';
import { CreateCoffeeBagRequest } from '../request/create-coffee-bag.request';
import { UpdateCoffeeBagRequest } from '../request/update-coffee-bag.request';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetAllCoffeeBagsQuery } from '../../domain/query/get-all-coffee-bags.query';
import { CoffeeBagResponse } from '../response/coffee-bag.response';
import { SearchCoffeeBagsQuery } from '../../domain/query/search-coffee-bags.query';
import { FindCoffeeBagQuery } from '../../domain/query/find-coffee-bag.query';
import { CreateCoffeeBagCommand } from '../../domain/command/create-coffee-bag.command';
import { IdResponse } from '../../../core/common/responses';
import { DeleteCoffeeBagCommand } from '../../domain/command/delete-coffee-bag.command';
import { UpdateCoffeeBagCommand } from '../../domain/command/update-coffee-bag.command';
import {
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

@Controller('inventory')
export class InventoryController {
  constructor(
    @Inject() private readonly commandBus: CommandBus,
    @Inject() private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({
    description: 'Fetches all coffee bags',
  })
  @ApiOkResponse({
    type: CoffeeBagResponse,
    isArray: true,
  })
  public getAllCoffeeBags() {
    return ResultAsync.from(this.queryBus.execute(new GetAllCoffeeBagsQuery()))
      .map((results) =>
        results.map(
          (model) =>
            new CoffeeBagResponse(model.id, model.name, model.roastedOn),
        ),
      )
      .toPromise();
  }

  @Get('search')
  @ApiOperation({
    description: 'Fetches all coffee bags with matching name',
  })
  @ApiOkResponse({
    type: CoffeeBagResponse,
    isArray: true,
  })
  public searchCoffeeBags(@Query() { name }: SearchInventoryRequestQuery) {
    return ResultAsync.from(
      this.queryBus.execute(new SearchCoffeeBagsQuery(name)),
    )
      .map((results) =>
        results.map(
          (model) =>
            new CoffeeBagResponse(model.id, model.name, model.roastedOn),
        ),
      )
      .toPromise();
  }

  @Get(':id([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})')
  @ApiOperation({
    description: 'Fetches coffee bag by id',
  })
  @ApiOkResponse({
    type: CoffeeBagResponse,
  })
  @ApiNotFoundResponse({
    description: 'Coffee with given id does not exist',
  })
  public findCoffeeBag(@Param('id') id: string) {
    return ResultAsync.from(this.queryBus.execute(new FindCoffeeBagQuery(id)))
      .map(
        (model) => new CoffeeBagResponse(model.id, model.name, model.roastedOn),
      )
      .toPromise();
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({
    description: 'Creates coffee bag',
  })
  @ApiOkResponse({
    type: IdResponse,
  })
  public createCoffeeBag(@Body() data: CreateCoffeeBagRequest) {
    return ResultAsync.from(
      this.commandBus.execute(
        new CreateCoffeeBagCommand(data.name, data.roastedOn),
      ),
    )
      .map((result) => new IdResponse(result.id))
      .toPromise();
  }
  @Patch(':id([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})')
  @HttpCode(204)
  @ApiOperation({
    description: 'Updates coffee bag',
  })
  @ApiOkResponse({})
  @ApiNotFoundResponse({
    description: 'Coffee bag not found',
  })
  public updateCoffeeBag(
    @Param('id') id: string,
    @Body() data: UpdateCoffeeBagRequest,
  ) {
    return ResultAsync.from(
      this.commandBus.execute(new UpdateCoffeeBagCommand(id, data.name)),
    )
      .map(() => Unit.Instance)
      .toPromise();
  }

  @Delete(':id([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})')
  @HttpCode(204)
  @ApiOperation({
    description: 'Deletes coffee bag',
  })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({
    description: 'Coffee bag not found',
  })
  public deleteCoffeeBag(@Param('id') id: string) {
    return ResultAsync.from(
      this.commandBus.execute(new DeleteCoffeeBagCommand(id)),
    )
      .map(() => Unit.Instance)
      .toPromise();
  }
}
