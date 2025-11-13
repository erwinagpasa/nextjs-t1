import { EventEmitter } from 'events';

export const PUB_SUB = 'PUB_SUB';

// Simple PubSub implementation using EventEmitter
class SimplePubSub {
  private ee: EventEmitter;

  constructor() {
    this.ee = new EventEmitter();
  }

  async publish(triggerName: string, payload: any): Promise<void> {
    this.ee.emit(triggerName, payload);
  }

  asyncIterator<T>(triggers: string | string[]): AsyncIterable<T> {
    const triggerArray = Array.isArray(triggers) ? triggers : [triggers];
    const pullQueue: Array<(value: IteratorResult<T>) => void> = [];
    const pushQueue: Array<T> = [];
    let listening = true;

    const pushValue = (event: T) => {
      if (pullQueue.length !== 0) {
        pullQueue.shift()!({ value: event, done: false });
      } else {
        pushQueue.push(event);
      }
    };

    const pullValue = (): Promise<IteratorResult<T>> => {
      return new Promise((resolve) => {
        if (pushQueue.length !== 0) {
          resolve({ value: pushQueue.shift()!, done: false });
        } else {
          pullQueue.push(resolve);
        }
      });
    };

    const emptyQueue = () => {
      if (listening) {
        listening = false;
        triggerArray.forEach((trigger) => this.ee.removeListener(trigger, pushValue));
        pullQueue.forEach((resolve) => resolve({ value: undefined, done: true } as any));
        pullQueue.length = 0;
        pushQueue.length = 0;
      }
    };

    triggerArray.forEach((trigger) => this.ee.addListener(trigger, pushValue));

    return {
      [Symbol.asyncIterator]() {
        return {
          next(): Promise<IteratorResult<T>> {
            return listening ? pullValue() : this.return!();
          },
          return(): Promise<IteratorResult<T>> {
            emptyQueue();
            return Promise.resolve({ value: undefined, done: true } as any);
          },
          throw(error: any): Promise<IteratorResult<T>> {
            emptyQueue();
            return Promise.reject(error);
          },
        };
      },
    };
  }
}

export const pubSubProvider = {
  provide: PUB_SUB,
  useValue: new SimplePubSub(),
};
