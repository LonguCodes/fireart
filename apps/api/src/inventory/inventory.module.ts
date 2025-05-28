import { Module } from '@nestjs/common';
import { InventoryController } from './api/http/inventory.controller';
import { CoffeeBagRepository } from './infrastructure/repository/coffee-bag.repository';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
  controllers: [InventoryController],
  providers: [CoffeeBagRepository],
})
export class InventoryModule {}
