/*
 * Constant strings used in the activity model
 */

enum ActivityTypes {
  ACTIVITY_ALL = 'all',
  CONNECTED_ACCOUNT_CREATED = 'connected_account.created',
  COLLECTIVE_CREATED_GITHUB = 'collective.created.github',
  COLLECTIVE_APPLY = 'collective.apply',
  COLLECTIVE_APPROVED = 'collective.approved',
  COLLECTIVE_REJECTED = 'collective.rejected',
  COLLECTIVE_CREATED = 'collective.created',
  COLLECTIVE_COMMENT_CREATED = 'collective.comment.created',
  COLLECTIVE_CONVERSATION_CREATED = 'collective.conversation.created',
  COLLECTIVE_EXPENSE_CREATED = 'collective.expense.created',
  COLLECTIVE_EXPENSE_DELETED = 'collective.expense.deleted',
  COLLECTIVE_EXPENSE_UPDATED = 'collective.expense.updated',
  COLLECTIVE_EXPENSE_REJECTED = 'collective.expense.rejected',
  COLLECTIVE_EXPENSE_APPROVED = 'collective.expense.approved',
  COLLECTIVE_EXPENSE_UNAPPROVED = 'collective.expense.unapproved',
  COLLECTIVE_EXPENSE_PAID = 'collective.expense.paid',
  COLLECTIVE_EXPENSE_MARKED_AS_UNPAID = 'collective.expense.unpaid',
  COLLECTIVE_EXPENSE_MARKED_AS_SPAM = 'collective.expense.spam',
  COLLECTIVE_EXPENSE_MARKED_AS_INCOMPLETE = 'collective.expense.incomplete',
  COLLECTIVE_EXPENSE_PROCESSING = 'collective.expense.processing',
  COLLECTIVE_EXPENSE_SCHEDULED_FOR_PAYMENT = 'collective.expense.scheduledForPayment',
  COLLECTIVE_EXPENSE_ERROR = 'collective.expense.error',
  COLLECTIVE_EXPENSE_INVITE_DRAFTED = 'collective.expense.invite.drafted',
  COLLECTIVE_EXPENSE_RECURRING_DRAFTED = 'collective.expense.recurring.drafted',
  COLLECTIVE_EXPENSE_MISSING_RECEIPT = 'collective.expense.missing.receipt',
  COLLECTIVE_VIRTUAL_CARD_MISSING_RECEIPTS = 'collective.virtualcard.missing.receipts',
  COLLECTIVE_VIRTUAL_CARD_SUSPENDED = 'collective.virtualcard.suspended',
  COLLECTIVE_FROZEN = 'collective.frozen',
  COLLECTIVE_UNFROZEN = 'collective.unfrozen',
  COLLECTIVE_MEMBER_INVITED = 'collective.member.invited',
  COLLECTIVE_MEMBER_CREATED = 'collective.member.created',
  COLLECTIVE_MONTHLY_REPORT = 'collective.monthlyreport',
  COLLECTIVE_CORE_MEMBER_ADDED = 'collective.core.member.added',
  COLLECTIVE_CORE_MEMBER_INVITED = 'collective.core.member.invited',
  COLLECTIVE_CORE_MEMBER_INVITATION_DECLINED = 'collective.core.member.invitation.declined',
  COLLECTIVE_CORE_MEMBER_REMOVED = 'collective.core.member.removed',
  COLLECTIVE_CORE_MEMBER_EDITED = 'collective.core.member.edited',
  COLLECTIVE_TRANSACTION_CREATED = 'collective.transaction.created',
  COLLECTIVE_UPDATE_CREATED = 'collective.update.created',
  COLLECTIVE_UPDATE_PUBLISHED = 'collective.update.published',
  COLLECTIVE_CONTACT = 'collective.contact',
  COLLECTIVE_VIRTUAL_CARD_ADDED = 'collective.virtualcard.added',
  CONTRIBUTION_REJECTED = 'contribution.rejected',
  ORGANIZATION_COLLECTIVE_CREATED = 'organization.collective.created',
  SUBSCRIPTION_ACTIVATED = 'subscription.activated',
  SUBSCRIPTION_CONFIRMED = 'subscription.confirmed',
  SUBSCRIPTION_CANCELED = 'subscription.canceled',
  TICKET_CONFIRMED = 'ticket.confirmed',
  USER_CREATED = 'user.created',
  USER_NEW_TOKEN = 'user.new.token',
  USER_CHANGE_EMAIL = 'user.changeEmail',
  USER_PAYMENT_METHOD_CREATED = 'user.paymentMethod.created',
  USER_CARD_CLAIMED = 'user.card.claimed',
  USER_CARD_INVITED = 'user.card.invited',
  WEBHOOK_STRIPE_RECEIVED = 'webhook.stripe.received',
  WEBHOOK_PAYPAL_RECEIVED = 'webhook.paypal.received',
  COLLECTIVE_MONTHLY = 'collective.monthly',
  ORDER_CANCELED_ARCHIVED_COLLECTIVE = 'order.canceled.archived.collective',
  ORDER_PROCESSING = 'order.processing',
  ORDER_PROCESSING_CRYPTO = 'order.processing.crypto',
  ORDER_PENDING_CONTRIBUTION_NEW = 'order.new.pendingFinancialContribution',
  ORDER_PENDING_CONTRIBUTION_REMINDER = 'order.reminder.pendingFinancialContribution',
  ORDER_THANKYOU = 'order.thankyou',
  ORDERS_SUSPICIOUS = 'orders.suspicious',
  BACKYOURSTACK_DISPATCH_CONFIRMED = 'backyourstack.dispatch.confirmed',
  ACTIVATED_COLLECTIVE_AS_HOST = 'activated.collective.as.host',
  ACTIVATED_COLLECTIVE_AS_INDEPENDENT = 'activated.collective.as.independent',
  DEACTIVATED_COLLECTIVE_AS_HOST = 'deactivated.collective.as.host',
  VIRTUAL_CARD_REQUESTED = 'virtual_card.requested',
  VIRTUAL_CARD_CHARGE_DECLINED = 'virtualcard.charge.declined',
  PAYMENT_FAILED = 'payment.failed',
  PAYMENT_CREDITCARD_CONFIRMATION = 'payment.creditcard.confirmation',
  PAYMENT_CREDITCARD_EXPIRING = 'payment.creditcard.expiring',
  TAXFORM_REQUEST = 'taxform.request',
  CONVERSATION_COMMENT_CREATED = 'conversation.comment.created',
  UPDATE_COMMENT_CREATED = 'update.comment.created',
  EXPENSE_COMMENT_CREATED = 'expense.comment.created',
  HOST_APPLICATION_CONTACT = 'host.application.contact',

  // Not used anymore, leaving for historical reference
  ADDED_FUND_TO_ORG = 'added.fund.to.org',
  COLLECTIVE_TRANSACTION_PAID = 'collective.transaction.paid', // replaced with COLLECTIVE_EXPENSE_PAID
  COLLECTIVE_USER_ADDED = 'collective.user.added',
  COLLECTIVE_VIRTUAL_CARD_ASSIGNED = 'collective.virtualcard.assigned', // replaced with COLLECTIVE_VIRTUAL_CARD_ADDED
  COLLECTIVE_VIRTUAL_CARD_CREATED = 'collective.virtualcard.created', // replaced with COLLECTIVE_VIRTUAL_CARD_ADDED
}

/** This array defines the type of activities that are transactional and can not be unsubscribed by the user. */
export const TransactionalActivities = [
  ActivityTypes.USER_NEW_TOKEN,
  ActivityTypes.USER_CHANGE_EMAIL,
  ActivityTypes.ORDER_PROCESSING,
  ActivityTypes.ORDER_PROCESSING_CRYPTO,
  ActivityTypes.ORDER_THANKYOU,
  ActivityTypes.PAYMENT_CREDITCARD_EXPIRING,
  ActivityTypes.PAYMENT_CREDITCARD_CONFIRMATION,
  ActivityTypes.PAYMENT_FAILED,
  ActivityTypes.TAXFORM_REQUEST,
  ActivityTypes.COLLECTIVE_EXPENSE_MARKED_AS_INCOMPLETE,
  ActivityTypes.COLLECTIVE_EXPENSE_INVITE_DRAFTED,
  ActivityTypes.COLLECTIVE_EXPENSE_RECURRING_DRAFTED,
  ActivityTypes.HOST_APPLICATION_CONTACT,
];

export enum ActivityClasses {
  COLLECTIVE = 'collectives',
  EXPENSES = 'expenses',
  CONTRIBUTIONS = 'contributions',
  ACTIVITIES_UPDATES = 'activitiesUpdates',
  VIRTUAL_CARDS = 'virtualCards',
  FUND_EVENTS = 'fundsEvents',
  REPORTS = 'reports',
}

export const ActivitiesPerClass: Record<ActivityClasses, ActivityTypes[]> = {
  [ActivityClasses.COLLECTIVE]: [
    ActivityTypes.COLLECTIVE_APPLY,
    ActivityTypes.COLLECTIVE_APPROVED,
    ActivityTypes.COLLECTIVE_CORE_MEMBER_INVITED,
    ActivityTypes.COLLECTIVE_CREATED_GITHUB,
    ActivityTypes.COLLECTIVE_CREATED,
    ActivityTypes.COLLECTIVE_FROZEN,
    ActivityTypes.COLLECTIVE_MEMBER_CREATED,
    ActivityTypes.COLLECTIVE_REJECTED,
    ActivityTypes.COLLECTIVE_UNFROZEN,
    ActivityTypes.DEACTIVATED_COLLECTIVE_AS_HOST,
  ],
  [ActivityClasses.EXPENSES]: [
    ActivityTypes.COLLECTIVE_EXPENSE_APPROVED,
    ActivityTypes.COLLECTIVE_EXPENSE_CREATED,
    ActivityTypes.COLLECTIVE_EXPENSE_DELETED,
    ActivityTypes.COLLECTIVE_EXPENSE_ERROR,
    ActivityTypes.COLLECTIVE_EXPENSE_INVITE_DRAFTED,
    ActivityTypes.COLLECTIVE_EXPENSE_MARKED_AS_INCOMPLETE,
    ActivityTypes.COLLECTIVE_EXPENSE_MARKED_AS_SPAM,
    ActivityTypes.COLLECTIVE_EXPENSE_MARKED_AS_UNPAID,
    ActivityTypes.COLLECTIVE_EXPENSE_MISSING_RECEIPT,
    ActivityTypes.COLLECTIVE_EXPENSE_PAID,
    ActivityTypes.COLLECTIVE_EXPENSE_PROCESSING,
    ActivityTypes.COLLECTIVE_EXPENSE_RECURRING_DRAFTED,
    ActivityTypes.COLLECTIVE_EXPENSE_REJECTED,
    ActivityTypes.COLLECTIVE_EXPENSE_SCHEDULED_FOR_PAYMENT,
    ActivityTypes.COLLECTIVE_EXPENSE_UNAPPROVED,
    ActivityTypes.COLLECTIVE_EXPENSE_UPDATED,
    ActivityTypes.EXPENSE_COMMENT_CREATED,
    ActivityTypes.TAXFORM_REQUEST,
  ],
  [ActivityClasses.CONTRIBUTIONS]: [
    ActivityTypes.CONTRIBUTION_REJECTED,
    ActivityTypes.ORDER_PENDING_CONTRIBUTION_NEW,
    ActivityTypes.ORDER_PENDING_CONTRIBUTION_REMINDER,
    ActivityTypes.ORDER_PROCESSING_CRYPTO,
    ActivityTypes.ORDER_PROCESSING,
    ActivityTypes.ORDER_THANKYOU,
    ActivityTypes.ORDERS_SUSPICIOUS,
    ActivityTypes.PAYMENT_CREDITCARD_CONFIRMATION,
    ActivityTypes.PAYMENT_CREDITCARD_EXPIRING,
    ActivityTypes.PAYMENT_FAILED,
    ActivityTypes.SUBSCRIPTION_ACTIVATED,
    ActivityTypes.SUBSCRIPTION_CANCELED,
    ActivityTypes.SUBSCRIPTION_CONFIRMED,
  ],
  [ActivityClasses.ACTIVITIES_UPDATES]: [
    ActivityTypes.HOST_APPLICATION_CONTACT,
    ActivityTypes.COLLECTIVE_COMMENT_CREATED,
    ActivityTypes.COLLECTIVE_CONVERSATION_CREATED,
    ActivityTypes.COLLECTIVE_UPDATE_PUBLISHED,
    ActivityTypes.COLLECTIVE_UPDATE_CREATED,
    ActivityTypes.ACTIVATED_COLLECTIVE_AS_HOST,
    ActivityTypes.ACTIVATED_COLLECTIVE_AS_INDEPENDENT,
    ActivityTypes.CONVERSATION_COMMENT_CREATED,
    ActivityTypes.UPDATE_COMMENT_CREATED,
    ActivityTypes.ORGANIZATION_COLLECTIVE_CREATED,
    ActivityTypes.COLLECTIVE_MEMBER_INVITED,
    ActivityTypes.USER_CARD_INVITED,
    ActivityTypes.USER_CARD_CLAIMED,
  ],
  [ActivityClasses.FUND_EVENTS]: [ActivityTypes.TICKET_CONFIRMED],
  [ActivityClasses.VIRTUAL_CARDS]: [
    ActivityTypes.COLLECTIVE_VIRTUAL_CARD_ADDED,
    ActivityTypes.COLLECTIVE_VIRTUAL_CARD_ASSIGNED,
    ActivityTypes.COLLECTIVE_VIRTUAL_CARD_CREATED,
    ActivityTypes.COLLECTIVE_VIRTUAL_CARD_MISSING_RECEIPTS,
    ActivityTypes.COLLECTIVE_VIRTUAL_CARD_SUSPENDED,
    ActivityTypes.VIRTUAL_CARD_CHARGE_DECLINED,
    ActivityTypes.VIRTUAL_CARD_REQUESTED,
  ],
  [ActivityClasses.REPORTS]: [ActivityTypes.COLLECTIVE_MONTHLY],
};

export default ActivityTypes;
