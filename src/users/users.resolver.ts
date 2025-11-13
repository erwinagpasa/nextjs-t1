import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { ItemsService } from '../items/items.service';
import { TransactionsService } from '../transactions/transactions.service';
import { User } from './user.entity';
import { Item } from '../items/item.entity';
import { Transaction } from '../transactions/transaction.entity';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
    private readonly transactionsService: TransactionsService,
  ) {}

  @Query(() => [User], { name: 'users' })
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user', nullable: true })
  async findOne(@Args('id') id: string): Promise<User | null> {
    return this.usersService.findOne(id);
  }

  @ResolveField(() => [Item])
  async items(@Parent() user: User): Promise<Item[]> {
    return this.itemsService.findByUserId(user.id);
  }

  @ResolveField(() => [Transaction])
  async transactions(@Parent() user: User): Promise<Transaction[]> {
    return this.transactionsService.findByUserId(user.id);
  }
}
