Here are the step-by-step instructions to create another subscription:

Steps to Create a New Subscription

1. Define the Event Name

In your resolver file (e.g., src/items/items.resolver.ts), add a constant
for your event:
const ITEM_UPDATED_EVENT = 'itemUpdated';

2. Create a Mutation (that triggers the subscription)

Add a mutation that will publish the event:
@Mutation(() => Item)
async updateItem(
@Args('id') id: string,
@Args('name') name: string,
): Promise<Item> {
const updatedItem = this.itemsService.update(id, name);
await this.pubSub.publish(ITEM_UPDATED_EVENT, { itemUpdated: updatedItem
});
return updatedItem;
}

3. Add the Service Method (if needed)

In your service file (e.g., src/items/items.service.ts), add the logic:
update(id: string, name: string): Item {
const item = this.findOne(id);
if (item) {
item.name = name;
}
return item;
}

4. Create the Subscription

Add the subscription resolver:
@Subscription(() => Item)
itemUpdated() {
return this.pubSub.asyncIterator(ITEM_UPDATED_EVENT);
}

5. Test in GraphQL Playground/Studio

- Subscribe in one tab:
  subscription {
  itemUpdated {
  id
  name
  description
  }
  }
- Trigger in another tab:
  mutation {
  updateItem(id: "1", name: "Updated Name") {
  id
  name
  }
  }

That's it! The subscription will receive updates whenever the mutation is
called.
