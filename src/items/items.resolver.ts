import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { Item } from './item.model';
import { ItemsService } from './items.service';
import { Inject } from '@nestjs/common';
import { PUB_SUB } from '../pubsub.provider';

const ITEM_ADDED_EVENT = 'itemAdded';

@Resolver(() => Item)
export class ItemsResolver {
  constructor(
    private readonly itemsService: ItemsService,
    @Inject(PUB_SUB) private readonly pubSub: any,
  ) {}

  @Query(() => [Item], { name: 'items' })
  findAll(): Item[] {
    return this.itemsService.findAll();
  }

  @Query(() => Item, { name: 'item', nullable: true })
  findOne(@Args('id') id: string): Item | undefined {
    return this.itemsService.findOne(id);
  }

  @Mutation(() => Item)
  async addItem(
    @Args('name') name: string,
    @Args('description') description: string,
    @Args('userId') userId: string,
    @Args('price', { nullable: true }) price?: number,
  ): Promise<Item> {
    const newItem = this.itemsService.create(name, description, userId, price);
    await this.pubSub.publish(ITEM_ADDED_EVENT, { itemAdded: newItem });
    return newItem;
  }

  @Subscription(() => Item)
  itemAdded() {
    return this.pubSub.asyncIterator(ITEM_ADDED_EVENT);
  }
}
