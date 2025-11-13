import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Transaction, TransactionType } from './transaction.entity';
import { TransactionsService } from './transactions.service';

@Resolver(() => Transaction)
export class TransactionsResolver {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Query(() => [Transaction], { name: 'transactions' })
  async findAll(): Promise<Transaction[]> {
    return this.transactionsService.findAll();
  }

  @Query(() => Transaction, { name: 'transaction', nullable: true })
  async findOne(@Args('id') id: string): Promise<Transaction | null> {
    return this.transactionsService.findOne(id);
  }

  @Mutation(() => Transaction)
  async createTransaction(
    @Args('amount') amount: number,
    @Args('type', { type: () => TransactionType }) type: TransactionType,
    @Args('userId') userId: string,
    @Args('description', { nullable: true }) description?: string,
  ): Promise<Transaction> {
    return this.transactionsService.create(amount, type, userId, description);
  }
}
