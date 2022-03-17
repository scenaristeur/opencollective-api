'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Expenses', 'RecurringExpenseId', {
      type: Sequelize.INTEGER,
      references: { key: 'id', model: 'RecurringExpense' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      allowNull: true,
    });

    await queryInterface.addColumn('ExpenseHistories', 'RecurringExpenseId', {
      type: Sequelize.INTEGER,
      references: { key: 'id', model: 'RecurringExpense' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      allowNull: true,
    });
  },

  down: async queryInterface => {
    await queryInterface.removeColumn('Expenses', 'RecurringExpenseId');
    await queryInterface.removeColumn('ExpenseHistories', 'RecurringExpenseId');
  },
};
