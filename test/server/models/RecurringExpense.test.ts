import models from '../../../server/models';
import { fakeExpense } from '../../test-helpers/fake-data';

describe('server/models/RecurringExpense', () => {
  let expense;

  beforeEach(async () => {
    expense = await fakeExpense({});
  });

  it('creates RecurringExpense from Expense and interval', async () => {
    const recurringExpense = await models.RecurringExpense.createFromExpense(
      expense,
      models.RecurringExpense.RecurringExpenseIntervals.MONTH,
    );
    console.log(recurringExpense);
  });
});
