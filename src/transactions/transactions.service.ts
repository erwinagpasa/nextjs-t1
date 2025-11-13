import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionType } from './transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) {}

  async findAll(): Promise<Transaction[]> {
    return this.transactionsRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Transaction | null> {
    return this.transactionsRepository.findOne({ where: { id } });
  }

  async findByUserId(userId: string): Promise<Transaction[]> {
    return this.transactionsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async create(
    amount: number,
    type: TransactionType,
    userId: string,
    description?: string,
  ): Promise<Transaction> {
    const transaction = this.transactionsRepository.create({
      amount,
      type,
      userId,
      description,
    });
    return this.transactionsRepository.save(transaction);
  }
}
