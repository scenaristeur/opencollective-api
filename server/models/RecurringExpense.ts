import { pick } from 'lodash';
import { DataTypes, Model } from 'sequelize';

import restoreSequelizeAttributesOnClass from '../lib/restore-sequelize-attributes-on-class';
import sequelize from '../lib/sequelize';

import models from '.';

enum RecurringExpenseIntervals {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  QUARTER = 'QUARTER',
  YEAR = 'YEAR',
}

interface RecurringExpenseAttributes {
  id: number;
  interval: RecurringExpenseIntervals;
  CollectiveId: number;
  FromCollectiveId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

type RecurringExpenseCreateAttributes = Required<
  Pick<RecurringExpenseAttributes, 'interval' | 'CollectiveId' | 'FromCollectiveId'>
>;

export class RecurringExpense extends Model<RecurringExpenseAttributes, RecurringExpenseCreateAttributes> {
  public readonly id!: number;
  public interval: string;
  public CollectiveId!: number;
  public FromCollectiveId!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt: Date;

  public static RecurringExpenseIntervals = RecurringExpenseIntervals;

  constructor(...args) {
    super(...args);
    restoreSequelizeAttributesOnClass(new.target, this);
  }

  async getLastExpense() {
    return models.Expense.findOne({ where: { RecurringExpenseId: this.id }, order: [['íd', 'DESC']] });
  }

  static async createFromExpense(expense: typeof models.Expense, interval: RecurringExpenseIntervals) {
    return this.create({
      ...pick(expense, ['CollectiveId', 'FromCollectiveId']),
      interval,
    });
  }
}

RecurringExpense.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
    CollectiveId: {
      type: DataTypes.INTEGER,
      references: { key: 'id', model: 'Collective' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      allowNull: false,
    },
    FromCollectiveId: {
      type: DataTypes.INTEGER,
      references: { key: 'id', model: 'Collective' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      allowNull: false,
    },
    interval: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        isIn: {
          args: [Object.values(RecurringExpenseIntervals)],
          msg: `Must be one of: ${Object.values(RecurringExpenseIntervals)}`,
        },
      },
    },
  },
  {
    sequelize,
    paranoid: true,
    tableName: 'RecurringExpenses',
  },
);

export default RecurringExpense;
