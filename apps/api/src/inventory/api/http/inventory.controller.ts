import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SearchInventoryQuery } from '../query/search-inventory.query';
import { ResultAsync } from 'typescript-functional-extensions';
import { CoffeeBagRepository } from '../../infrastructure/repository/coffee-bag.repository';
import { InventoryErrors } from '../../domain/errors';
import { CreateCoffeeBagRequest } from '../request/create-coffee-bag.request';
import { DateTime } from 'luxon';
import { UpdateCoffeeBagRequest } from '../request/update-coffee-bag.request';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly coffeeBagRepository: CoffeeBagRepository) {}

  @Get()
  public getAllCoffeeBags() {
    return ResultAsync.success()
      .bind(() => this.coffeeBagRepository.find())
      .toPromise();
  }

  @Get('search')
  public searchCoffeeBags(@Query() { name }: SearchInventoryQuery) {
    return ResultAsync.success()
      .bind(() => this.coffeeBagRepository.search(name))
      .toPromise();
  }

  @Get(':id([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})')
  public findCoffeeBag(@Param('id') id: string) {
    return ResultAsync.success()
      .bind(() => this.coffeeBagRepository.findById(id))
      .bind((coffeeBagMaybe) =>
        coffeeBagMaybe.toResult(InventoryErrors.CoffeeBagNotFound),
      )
      .toPromise();
  }

  @Post()
  public createCoffeeBag(@Body() data: CreateCoffeeBagRequest) {
    return ResultAsync.success()
      .bind(() =>
        this.coffeeBagRepository.create(
          data.name,
          DateTime.fromISO(data.roastedOn).toJSDate(),
        ),
      )
      .toPromise();
  }
  @Patch(':id([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})')
  public updateCoffeeBag(
    @Param('id') id: string,
    @Body() data: UpdateCoffeeBagRequest,
  ) {
    return ResultAsync.success()
      .bind(() => this.coffeeBagRepository.updateNameById(id, data.name))
      .toPromise();
  }

  @Delete(':id([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})')
  public deleteCoffeeBag(@Param('id') id: string) {
    return ResultAsync.success()
      .bind(() => this.coffeeBagRepository.deleteById(id))
      .toPromise();
  }
}
