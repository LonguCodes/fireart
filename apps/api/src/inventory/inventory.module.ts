import { Module } from '@nestjs/common';
import { InventoryController } from './api/http/inventory.controller';
import { CoffeeBagRepository } from './infrastructure/repository/coffee-bag.repository';

@Module({
  controllers: [InventoryController],
  providers: [CoffeeBagRepository],
})
export class InventoryModule {}
