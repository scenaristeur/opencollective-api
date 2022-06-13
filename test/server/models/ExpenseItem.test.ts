import { expect } from 'chai';
import { times } from 'lodash';

import models from '../../../server/models';
import { randUrl } from '../../stores';
import { fakeExpense, fakeExpenseItem, fakeUser } from '../../test-helpers/fake-data';

describe('test/server/models/ExpenseItem', () => {
  describe('createFromData', () => {
    it('Filters out the bad fields', async () => {
      const expense = await fakeExpense();
      const user = await fakeUser();
      const data = {
        url: randUrl(),
        amount: 1500,
        incurredAt: new Date('2000-01-01T00:00:00'),
        deletedAt: new Date('2000-01-01T00:00:00'),
      };

      const item = await models.ExpenseItem.createFromData(data, user, expense);
      expect(item.url).to.equal(data.url);
      expect(item.amount).to.equal(data.amount);
      expect(item.incurredAt.getTime()).to.equal(data.incurredAt.getTime());
      expect(item.deletedAt).to.be.null;
    });
  });

  describe('diffDBEntries', () => {
    it('summarizes the diffs to apply based on items lists', async () => {
      const baseItems = await Promise.all(times(3, () => fakeExpenseItem()));
      const [newItems, removedItems, updatedItems] = models.ExpenseItem.diffDBEntries(baseItems, [
        // No change to first item
        { id: baseItems[0].id },
        // Second item amount updated
        { id: baseItems[1].id, amount: baseItems[1].amount + 1 },
        // Third item removed by not including it in the list
        // New item added
        { amount: 4242, description: 'New stuff' },
      ]);

      expect(newItems).to.have.length(1);
      expect(newItems[0].amount).to.eq(4242);

      expect(removedItems).to.have.length(1);
      expect(removedItems[0].id).to.eq(baseItems[2].id);

      expect(updatedItems).to.have.length(1);
      expect(updatedItems[0].id).to.eq(baseItems[1].id);
      expect(updatedItems[0].amount).to.eq(baseItems[1].amount + 1);
    });
  });
});
