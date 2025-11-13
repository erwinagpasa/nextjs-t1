import { Module } from '@nestjs/common';
import { ItemsResolver } from './items.resolver';
import { ItemsService } from './items.service';
import { pubSubProvider } from '../pubsub.provider';

@Module({
  providers: [ItemsResolver, ItemsService, pubSubProvider],
  exports: [ItemsService],
})
export class ItemsModule {}
