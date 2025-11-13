import { Injectable } from '@nestjs/common';
import { Item } from './item.model';

@Injectable()
export class ItemsService {
  private items: Item[] = [
    {
      id: '1',
      name: 'Laptop',
      description: 'MacBook Pro 16-inch',
      userId: '1',
      price: 2499,
    },
    {
      id: '2',
      name: 'Keyboard',
      description: 'Mechanical keyboard',
      userId: '1',
      price: 149,
    },
    {
      id: '3',
      name: 'Mouse',
      description: 'Wireless mouse',
      userId: '2',
      price: 79,
    },
    {
      id: '4',
      name: 'Monitor',
      description: '4K display',
      userId: '2',
      price: 599,
    },
  ];

  findAll(): Item[] {
    return this.items;
  }

  findOne(id: string): Item | undefined {
    return this.items.find((item) => item.id === id);
  }

  findByUserId(userId: string): Item[] {
    return this.items.filter((item) => item.userId === userId);
  }

  create(
    name: string,
    description: string,
    userId: string,
    price?: number,
  ): Item {
    const newItem: Item = {
      id: String(this.items.length + 1),
      name,
      description,
      userId,
      price,
    };
    this.items.push(newItem);
    return newItem;
  }
}
