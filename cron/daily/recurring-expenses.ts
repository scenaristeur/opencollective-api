import '../../server/env';

import config from 'config';
import { pick } from 'lodash';
import { v4 as uuid } from 'uuid';

import activities from '../../server/constants/activities';
import expenseStatus from '../../server/constants/expense_status';
import models from '../../server/models';

const DRY = process.env.DRY !== 'false';
if (DRY) {
  console.info('Running dry, changes are not going to be persisted to the DB.');
}

const draftExpense = expense => {
  const draftKey = process.env.OC_ENV === 'e2e' || process.env.OC_ENV === 'ci' ? 'draft-key' : uuid();
  const expenseFields = [
    'description',
    'longDescription',
    'tags',
    'type',
    'privateMessage',
    'invoiceInfo',
    'CollectiveId',
    'FromCollectiveId',
    'PayoutMethodId',
    'UserId',
    'currency',
  ];
  const incurredAt = new Date();

  const draft = {
    ...pick(expense, expenseFields),
    lastEditedById: expense.UserId,
    incurredAt,
    amount: expense.items?.reduce((total, item) => total + item.amount, 0) || expense.amount || 1,
    data: {
      items: expense.items?.map(item => ({ ...pick(item, ['amount', 'description', 'url']), incurredAt })),
      attachedFiles: expense.attachedFiles?.map(file => pick(file, ['url'])),
      payee: { id: expense.FromCollectiveId },
      invitedByCollectiveId: expense.FromCollectiveId,
      draftKey,
      payeeLocation: expense.payeeLocation,
    },
    status: expenseStatus.DRAFT,
  };

  return draft;
};

const run = async () => {
  const recurringExpenses = await models.Expense.findAll({
    where: { data: { isRecurring: true } },
    include: [
      { model: models.Collective, as: 'collective' },
      { model: models.ExpenseAttachedFile, as: 'attachedFiles' },
      { model: models.ExpenseItem, as: 'items' },
    ],
  });

  console.log(`Found ${recurringExpenses.length} recurring expenses`);
  for (const expense of recurringExpenses) {
    const draft = draftExpense(expense);
    const draftedExpense = await models.Expense.create(draft);

    const inviteUrl = `${config.host.website}/${expense.collective.slug}/expenses/${draftedExpense.id}?key=${draft.data.draftKey}`;
    draftedExpense
      .createActivity(
        activities.COLLECTIVE_EXPENSE_INVITE_DRAFTED,
        { id: expense.UserId },
        { ...draftedExpense.data, inviteUrl },
      )
      .catch(e => console.error('An error happened when creating the COLLECTIVE_EXPENSE_INVITE_DRAFTED activity', e));

    console.info(`Expense Invite Link: ${inviteUrl}`);
  }
};

if (require.main === module) {
  run()
    .catch(e => {
      console.error(e);
      process.exit(1);
    })
    .then(() => {
      process.exit();
    });
}
