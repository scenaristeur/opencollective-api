import { pick } from 'lodash';
import { DataTypes, Model, Transaction } from 'sequelize';

import { diffDBEntries } from '../lib/data';
import { isValidUploadedImage } from '../lib/images';
import { buildSanitizerOptions, sanitizeHTML } from '../lib/sanitize-html';
import sequelize from '../lib/sequelize';

import models from '.';

// An array like [newItemsData, removedItems, updatedItemsData]
export type ItemsDiff = [Record<string, unknown>[], ExpenseItem[], Record<string, unknown>[]];

/**
 * Sequelize model to represent an ExpenseItem, linked to the `ExpenseItems` table.
 */
export class ExpenseItem extends Model {
  public declare readonly id: number;
  public declare ExpenseId: number;
  public declare CreatedByUserId: number;
  public declare amount: number;
  public declare url: string;
  public declare createdAt: Date;
  public declare updatedAt: Date;
  public declare deletedAt: Date;
  public declare incurredAt: Date;
  public declare description: string;

  private static editableFields = ['amount', 'url', 'description', 'incurredAt'];

  /**
   * Based on `diffDBEntries`, diff two items list to know which ones where
   * added, removed or added.
   * @returns [newEntries, removedEntries, updatedEntries]
   */
  static diffDBEntries = (baseItems: ExpenseItem[], itemsData: Record<string, unknown>[]): ItemsDiff => {
    return diffDBEntries(baseItems, itemsData, ExpenseItem.editableFields);
  };

  /**
   * Simulate a diff on a list of existing items, returns a list of items data as we would expect to find it
   * once recorded in the DB.
   */
  static simulateItemsDiff = (items: ExpenseItem[], diff: ItemsDiff): Record<string, unknown>[] => {
    const [newItems, removedItems, updatedItems] = diff;
    return (
      items
        // Remove items that were removed
        .filter(item => !removedItems.some(removedItem => removedItem.id === item.id))
        // Update (or keep it the same if not in updatedItems)
        .map(item => {
          const existingValues = item['dataValues'];
          const updatedItemData = updatedItems.find(updatedItem => updatedItem.id === item.id);
          return updatedItemData ? { ...existingValues, ...updatedItemData } : existingValues;
        })
        // Add new
        .concat(newItems)
    );
  };

  /**
   * Create an expense item from user-submitted data.
   * @param itemData: The (potentially unsafe) user data. Fields will be whitelisted.
   * @param user: User creating this item
   * @param expense: The linked expense
   */
  static async createFromData(
    itemData: Record<string, unknown>,
    user: typeof models.User,
    expense: typeof models.Expense,
    dbTransaction: Transaction | null = null,
  ): Promise<ExpenseItem> {
    const cleanData = ExpenseItem.cleanData(itemData);
    return ExpenseItem.create(
      { ...cleanData, ExpenseId: expense.id, CreatedByUserId: user.id },
      { transaction: dbTransaction },
    );
  }

  /**
   * Updates an expense item from user-submitted data.
   * @param itemData: The (potentially unsafe) user data. Fields will be whitelisted.
   */
  static async updateFromData(itemData: Record<string, unknown>, dbTransaction: Transaction | null): Promise<void> {
    const id = itemData['id'];
    const cleanData = ExpenseItem.cleanData(itemData);
    await ExpenseItem.update(cleanData, { where: { id }, transaction: dbTransaction });
  }

  /** Filters out all the fields that cannot be edited by user */
  private static cleanData(data: Record<string, unknown>): Record<string, unknown> {
    return pick(data, ExpenseItem.editableFields);
  }
}

const descriptionSanitizerOptions = buildSanitizerOptions({
  titles: true,
  basicTextFormatting: true,
  multilineTextFormatting: true,
  images: true,
  links: true,
});

function setupModel(ExpenseItem) {
  // Link the model to database fields
  ExpenseItem.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
        },
      },
      url: {
        type: DataTypes.STRING,
        allowNull: true,
        set(value: string | null): void {
          // Make sure empty strings are converted to null
          this.setDataValue('url', value || null);
        },
        validate: {
          isUrl: true,
          isValidImage(url: string): void {
            if (url && !isValidUploadedImage(url)) {
              throw new Error('The attached file URL is not valid');
            }
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        set(value) {
          if (value) {
            this.setDataValue('description', sanitizeHTML(value, descriptionSanitizerOptions));
          } else {
            this.setDataValue('description', null);
          }
        },
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
      incurredAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      ExpenseId: {
        type: DataTypes.INTEGER,
        references: { model: 'Expenses', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull: false,
      },
      CreatedByUserId: {
        type: DataTypes.INTEGER,
        references: { key: 'id', model: 'Users' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        allowNull: false,
      },
    },
    {
      sequelize,
      paranoid: true,
      tableName: 'ExpenseItems',
    },
  );
}

// We're using the setupModel function to keep the indentation and have a clearer git history.
// Please consider this if you plan to refactor.
setupModel(ExpenseItem);

export default ExpenseItem;
