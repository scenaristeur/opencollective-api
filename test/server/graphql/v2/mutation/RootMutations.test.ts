import { expect } from 'chai';
import gqlV2 from 'fake-tag';

import roles from '../../../../../server/constants/roles';
import models from '../../../../../server/models';
import { fakeCollective, fakeExpense, fakeMember, fakeUser } from '../../../../test-helpers/fake-data';
import { graphqlQueryV2, resetTestDB } from '../../../../utils';

const MOVE_EXPENSES_MUTATION = gqlV2/* GraphQL */ `
  mutation MoveExpensesMutation($destinationAccount: AccountReferenceInput!, $expenses: [ExpenseReferenceInput!]!) {
    moveExpenses(destinationAccount: $destinationAccount, expenses: $expenses) {
      id
      account {
        id
      }
    }
  }
`;

describe('server/graphql/v2/mutation/RootMutations', () => {
  let rootUser;

  before(resetTestDB);
  before(async () => {
    rootUser = await fakeUser();
    await fakeMember({ CollectiveId: rootUser.id, MemberCollectiveId: 1, role: roles.ADMIN });
  });

  describe('moveExpensesMutation', () => {
    it('validates if request user is root', async () => {
      const result = await graphqlQueryV2(MOVE_EXPENSES_MUTATION, { expenses: [], destinationAccount: {} });
      expect(result.errors).to.exist;
      expect(result.errors[0].message).to.equal('You need to be logged in.');
    });

    it('validates if destinationAccount argument is present', async () => {
      const result = await graphqlQueryV2(MOVE_EXPENSES_MUTATION, { expenses: [] }, rootUser);
      expect(result.errors).to.exist;
      expect(result.errors[0].message).to.equal(
        'Variable "$destinationAccount" of required type "AccountReferenceInput!" was not provided.',
      );
    });

    it('validates if destinationAccount references an existing account', async () => {
      const result = await graphqlQueryV2(
        MOVE_EXPENSES_MUTATION,
        { destinationAccount: { legacyId: -1 }, expenses: [{ legacyId: -1 }] },
        rootUser,
      );
      expect(result.errors).to.exist;
      expect(result.errors[0].message).to.equal('Account Not Found');
    });

    it('validates if destinationAccount references a non USER account', async () => {
      const testUser = await fakeUser();
      const result = await graphqlQueryV2(
        MOVE_EXPENSES_MUTATION,
        { destinationAccount: { legacyId: testUser.id }, expenses: [{ legacyId: -1 }] },
        rootUser,
      );
      expect(result.errors).to.exist;
      expect(result.errors[0].message).to.equal('The "destinationAccount" must not be an USER account');
    });

    it('moves no expenses when no expenses are given', async () => {
      const testCollective = await fakeCollective();

      const result = await graphqlQueryV2(
        MOVE_EXPENSES_MUTATION,
        { destinationAccount: { legacyId: testCollective.id }, expenses: [] },
        rootUser,
      );
      expect(result.errors).to.not.exist;
      expect(result.data.moveExpenses.length).to.equal(0);

      const testCollectiveExpenses = await models.Expense.findAll({
        where: {
          CollectiveId: testCollective.id,
        },
      });

      expect(testCollectiveExpenses.length).to.equal(0);
    });

    it('moves expenses', async () => {
      const testCollective = await fakeCollective();
      const testExpense = await fakeExpense();

      const result = await graphqlQueryV2(
        MOVE_EXPENSES_MUTATION,
        { destinationAccount: { legacyId: testCollective.id }, expenses: [{ legacyId: testExpense.id }] },
        rootUser,
      );
      expect(result.errors).to.not.exist;
      expect(result.data.moveExpenses.length).to.equal(1);

      const testCollectiveExpenses = await models.Expense.findAll({
        where: {
          CollectiveId: testCollective.id,
        },
      });

      expect(testCollectiveExpenses.length).to.equal(1);
    });
  });
});
