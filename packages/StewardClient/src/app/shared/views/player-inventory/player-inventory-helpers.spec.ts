import { GameTitle } from '@models/enums';
import { addWarnings, makeItemList } from './player-inventory-helpers';
import { MasterInventoryItem } from '@models/master-inventory-item';
import faker from '@faker-js/faker';
import BigNumber from 'bignumber.js';
import { PlayerInventoryItemList } from '@models/master-inventory-item-list';

describe('PlayerInventoryHelpers', () => {
  describe('Method: makeItemList', () => {
    const title = GameTitle.FH5;
    const items: MasterInventoryItem[] = [
      {
        id: new BigNumber(faker.datatype.number()),
        description: faker.datatype.string(),
        quantity: faker.datatype.number(),
        itemType: faker.datatype.string(),
        error: null,
      },
    ];

    it('should create correct item list object', () => {
      const itemList = makeItemList(title, items);

      expect(itemList.title).toEqual(title);
      expect(itemList.description).toEqual(`${items.length} Total`);
      expect(itemList.items).toEqual(items);
    });
  });

  describe('Method: addWarnings', () => {
    const warningId = new BigNumber(faker.datatype.number());
    const itemList: PlayerInventoryItemList = {
      title: faker.datatype.string(),
      description: faker.datatype.string(),
      items: [
        {
          id: warningId,
          description: faker.datatype.string(),
          quantity: faker.datatype.number(),
          itemType: faker.datatype.string(),
          error: null,
        },
        {
          id: new BigNumber(faker.datatype.number()),
          description: faker.datatype.string(),
          quantity: faker.datatype.number(),
          itemType: faker.datatype.string(),
          error: null,
        },
      ],
    };

    const warningIds = new Set<string>([warningId.toString()]);
    const icon = 'icon';
    const warn = 'warn';
    const text = 'text';

    it('should create correct item list object', () => {
      const updatedItemList = addWarnings(itemList, warningIds, icon, warn, text);

      expect(updatedItemList.items.length).toEqual(2);
      expect(updatedItemList.items[0].warnings?.length).toEqual(1);
      expect(updatedItemList.items[1].warnings).not.toBeDefined();
    });
  });
});
