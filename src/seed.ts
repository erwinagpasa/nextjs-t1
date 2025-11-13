import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Item } from './items/item.entity';
import {
  Transaction,
  TransactionType,
} from './transactions/transaction.entity';
import { Repository } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userRepository = app.get<Repository<User>>(getRepositoryToken(User));
  const itemRepository = app.get<Repository<Item>>(getRepositoryToken(Item));
  const transactionRepository = app.get<Repository<Transaction>>(
    getRepositoryToken(Transaction),
  );

  console.log('Seeding database...');

  // Clear existing data - delete in proper order due to foreign key constraints
  const existingTransactions = await transactionRepository.find();
  if (existingTransactions.length > 0) {
    await transactionRepository.remove(existingTransactions);
  }

  const existingItems = await itemRepository.find();
  if (existingItems.length > 0) {
    await itemRepository.remove(existingItems);
  }

  const existingUsers = await userRepository.find();
  if (existingUsers.length > 0) {
    await userRepository.remove(existingUsers);
  }
  console.log('Cleared existing data');

  // Create users with specific UUIDs
  const user1 = userRepository.create({
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'Software developer',
  });

  const user2 = userRepository.create({
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Jane Smith',
    email: 'jane@example.com',
    bio: 'Product manager',
  });

  await userRepository.save([user1, user2]);
  console.log('Created 2 users');

  // Create items
  const items = itemRepository.create([
    {
      id: '660e8400-e29b-41d4-a716-446655440001',
      name: 'Laptop',
      description: 'MacBook Pro 16-inch',
      userId: user1.id,
      price: 2499,
    },
    {
      id: '660e8400-e29b-41d4-a716-446655440002',
      name: 'Keyboard',
      description: 'Mechanical keyboard',
      userId: user1.id,
      price: 149,
    },
    {
      id: '660e8400-e29b-41d4-a716-446655440003',
      name: 'Mouse',
      description: 'Wireless mouse',
      userId: user2.id,
      price: 79,
    },
    {
      id: '660e8400-e29b-41d4-a716-446655440004',
      name: 'Monitor',
      description: '4K display',
      userId: user2.id,
      price: 599,
    },
  ]);

  await itemRepository.save(items);
  console.log('Created 4 items');

  // Create transactions
  const transactions = transactionRepository.create([
    {
      id: '770e8400-e29b-41d4-a716-446655440001',
      amount: 1000,
      type: TransactionType.DEPOSIT,
      description: 'Initial deposit',
      userId: user1.id,
    },
    {
      id: '770e8400-e29b-41d4-a716-446655440002',
      amount: 2499,
      type: TransactionType.PAYMENT,
      description: 'Payment for Laptop',
      userId: user1.id,
    },
    {
      id: '770e8400-e29b-41d4-a716-446655440003',
      amount: 500,
      type: TransactionType.WITHDRAWAL,
      description: 'ATM withdrawal',
      userId: user1.id,
    },
    {
      id: '770e8400-e29b-41d4-a716-446655440004',
      amount: 2000,
      type: TransactionType.DEPOSIT,
      description: 'Salary deposit',
      userId: user2.id,
    },
    {
      id: '770e8400-e29b-41d4-a716-446655440005',
      amount: 678,
      type: TransactionType.PAYMENT,
      description: 'Payment for Mouse and Monitor',
      userId: user2.id,
    },
  ]);

  await transactionRepository.save(transactions);
  console.log('Created 5 transactions');

  console.log('Database seeding completed!');
  await app.close();
}

bootstrap();
