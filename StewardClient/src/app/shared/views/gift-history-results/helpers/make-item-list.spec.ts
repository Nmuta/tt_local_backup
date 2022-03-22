import { toDateTime } from '@helpers/luxon';
import { PlayerInventoryItem } from '@models/player-inventory-item';
import BigNumber from 'bignumber.js';
import faker from 'faker';
import { makeItemList } from './make-item-list';

describe('Gift History Results Helper: Apollo', () => {
  describe('Method: makeItemList', () => {
    const title = 'test-title';
    const giftItems = [
      {
        id: new BigNumber(faker.datatype.number()),
        description: faker.random.words(10),
        quantity: faker.datatype.number(),
        itemType: 'creditRewards',
        acquiredUtc: toDateTime(faker.date.past()),
      },
    ] as PlayerInventoryItem[];

    it('should generate a PlayerInventoryItemList', () => {
      const itemList = makeItemList(title, giftItems);

      expect(itemList.title).toEqual(title);
      expect(itemList.description).toEqual('1 Total');
      expect(itemList.items).toEqual(giftItems);
    });
  });
});
