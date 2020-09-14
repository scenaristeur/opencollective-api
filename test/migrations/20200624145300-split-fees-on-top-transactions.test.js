import { expect } from 'chai';

import sequelize from '../../server/lib/sequelize';
import migration from '../../migrations/20200624145300-split-fees-on-top-transactions';

const RESET = ` 
  TRUNCATE "Collectives", "Users", "Orders", "Transactions" CASCADE;

  INSERT INTO "Collectives"
  (id, "name", description, currency, "createdAt", "updatedAt", "deletedAt", "isActive", "longDescription", image, slug, website, "twitterHandle", "backgroundImage", "hostFeePercent", settings, "data", tags, "isSupercollective", "LastEditedByUserId", "CreatedByUserId", "HostCollectiveId", "ParentCollectiveId", "type", "startsAt", "endsAt", "locationName", address, timezone, "maxQuantity", "geoLocationLatLong", company, "expensePolicy", "githubHandle", "countryISO", "deactivatedAt", "isPledged", "isIncognito", "approvedAt", "isHostAccount", plan, "platformFeePercent")
  VALUES(8686, 'Open Collective Inc', 'We are on a mission to create a new generation of association, transparent by design', 'USD', '2016-01-15 16:58:42.969', '2020-05-14 00:24:41.766', NULL, false, NULL, 'https://opencollective-production.s3-us-west-1.amazonaws.com/8aa714c0-79fa-11e7-9a37-35a8ed456d67.png', 'opencollectiveinc', 'https://opencollective.com', 'opencollect', 'https://opencollective-production.s3.us-west-1.amazonaws.com/3a775280-51cf-11ea-98f4-7b0e658061d2.png', 0.0, '{"goals": [{}], "editor": "html", "features": {"transferwise": true, "paypalPayouts": true}, "collectivePage": {"background": {"crop": {"x": 318.31637188177433, "y": 92.74585450409845}, "zoom": 1.3300000000000027}, "primaryColor": "#1F3993"}, "hideCreditCardPostalCode": true, "virtualCardsMaxDailyCount": 500, "virtualCardsMaxDailyAmount": 500000}', '{"W9": {"receivedFromUserIds": [15873, 12155, 12457, 10562, 5133, 86, 30, 488, 3602, 2, 20162, 4829, 25928, 24013, 13511, 10655, 15318, 29687, 36137, 27226, 33061, 15319, 34258], "requestSentToUserIds": [2, 15873, 12155, 12457, 10562, 5133, 86, 86, 30, 86, 488, 488, 488, 488, 488, 488, 3602, 2, 20162, 4829, 25928, 24013, 13511, 10655, 15318, 29687, 36137, 33061, 15319, 27226, 38984, 34258, 46576]}, "plan": {"addedFundsLimit": null}}', NULL, false, NULL, NULL, NULL, NULL, 'ORGANIZATION', NULL, NULL, NULL, '340 S Lemon Ave #3717, Walnut, CA 91789', NULL, NULL, NULL, NULL, '', NULL, 'US', NULL, false, false, NULL, true, 'owned', NULL)
  ON CONFLICT DO NOTHING;

  INSERT INTO "Collectives"
  (id, "name", description, currency, "createdAt", "updatedAt", "deletedAt", "isActive", "longDescription", image, slug, website, "twitterHandle", "backgroundImage", "hostFeePercent", settings, "data", tags, "isSupercollective", "LastEditedByUserId", "CreatedByUserId", "HostCollectiveId", "ParentCollectiveId", "type", "startsAt", "endsAt", "locationName", address, timezone, "maxQuantity", "geoLocationLatLong", company, "expensePolicy", "githubHandle", "countryISO", "deactivatedAt", "isPledged", "isIncognito", "approvedAt", "isHostAccount", plan, "platformFeePercent")
  VALUES(1, 'Open Collective', 'We are building tools in open source to organize the Internet generation', 'USD', '2015-12-12 22:14:54.028', '2020-02-17 11:19:59.251', NULL, true, '', 'https://cldup.com/rdmBCmH20l.png', 'opencollective', 'https://opencollective.com', 'opencollect', NULL, 5.0, '{"goals": [{}], "editor": "html", "features": {"conversations": true}, "githubOrg": "opencollective"}', NULL, NULL, false, NULL, NULL, 8686, NULL, 'COLLECTIVE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, NULL, NULL, false, false, '2016-01-31 22:00:00.000', false, NULL, 5.0)
  ON CONFLICT DO NOTHING;
  -- Make Open Collective Host and RailGirlsAtlanta compatible with feesOnTop
  UPDATE "Collectives" SET "settings" = '{ "apply": true, "feesOnTop": true }' WHERE id = 8674;
  UPDATE "Collectives" SET "platformFeePercent" = 0, "hostFeePercent" = 0 WHERE id = 28;

  INSERT INTO "Collectives" (id, "name", description, currency, "createdAt", "updatedAt", "deletedAt", "isActive", "longDescription", image, slug, website, "twitterHandle", "backgroundImage", "hostFeePercent", settings, "data", tags, "isSupercollective", "LastEditedByUserId", "HostCollectiveId", "ParentCollectiveId", "type", "startsAt", "endsAt", "locationName", address, timezone, "maxQuantity", "geoLocationLatLong", company, "expensePolicy", "githubHandle", "countryISO", "deactivatedAt", "isPledged", "isIncognito", "approvedAt", "isHostAccount", plan, "platformFeePercent")
  VALUES(8674, 'Open Collective Host', NULL, 'USD', '2017-10-03 12:14:43.757', NULL, NULL, false, NULL, NULL, 'opencollective-host', 'https://opencollective.org', 'opencollect', NULL, 0.0, '{"apply": true, "feesOnTop": true}', '{"plan": {}}', '{501c3}', true, NULL, NULL, NULL, 'ORGANIZATION', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, NULL, true, 'owned', NULL)
  ON CONFLICT DO NOTHING;

  INSERT INTO "Collectives" (id, "name", description, currency, "createdAt", "updatedAt", "deletedAt", "isActive", "longDescription", image, slug, website, "twitterHandle", "backgroundImage", "hostFeePercent", settings, "data", tags, "isSupercollective", "LastEditedByUserId", "HostCollectiveId", "ParentCollectiveId", "type", "startsAt", "endsAt", "locationName", address, timezone, "maxQuantity", "geoLocationLatLong", company, "expensePolicy", "githubHandle", "countryISO", "deactivatedAt", "isPledged", "isIncognito", "approvedAt", "isHostAccount", plan, "platformFeePercent")
  VALUES(28, 'Rails Girls Atlanta', 'Rails Girls Atlanta empowers women of all skill levels improving their software development knowledge using Ruby and Rails. ', 'USD', '2016-09-16 15:04:35.879', '2016-09-16 15:04:35.879', NULL, true, '<p>Our aim is to give tools and a community for women to understand technology and to build their ideas. We do this by providing a great experience on building things and by making technology more approachable. We provide mentored collaborative learning opportunities through monthly meetups, silly hack nights, and beginner workshops.</p>
  <p>Learn sketching, prototyping, basic programming and get introduced to the world of technology. Rails Girls was born in Finland, but is nowadays a global, non-profit volunteer community.</p>
  <p>Donations are used to host community learning events. The cost of food for Monthly meetups is about $9-10 per person for 18-25 people. Workshops require venue and furniture rental, catering, and parking passes. Catering and prizes are provided for attendees who participate in hack nights as well. To promote our group, we make custom stickers to share with attendees, and provide thank you gifts for our speakers. During the holidays, we host a community dinner. Extra funds may go towards purchase hardware hacking kits, and additional events! </p>', 'https://cl.ly/083w0L461x1x/railsgirlsatl-logo.png', 'railsgirlsatl', 'http://meetup.com/rails-girls-atlanta', 'railsgirlsatl', NULL, 0.0, '{"lang": "railsgirlsatl", "twitter": {"thankDonation": "🎉 $backer thanks for backing us on opencollective.com/railsgirlsatl 💟💟💟", "monthlyThankDonationsPlural": "Thanks to our $backerCount backers and sponsors $backerList for supporting our collective 😻", "monthlyThankDonationsEnabled": true, "monthlyThankDonationsSingular": "Thank you $backer for supporting our collective on opencollective.com/railsgirlsatl 💟💟💟"}}', NULL, '{meetup,diversity in tech}', false, NULL, 8674, NULL, 'COLLECTIVE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, '2019-08-05 21:00:00.000', false, NULL, 0.0)
  ON CONFLICT DO NOTHING;

  INSERT INTO "Collectives" ("id", "name",description,currency,"createdAt","updatedAt","deletedAt","isActive","longDescription",image,slug,website,"twitterHandle","backgroundImage","hostFeePercent",settings,"data",tags,"isSupercollective","LastEditedByUserId","CreatedByUserId","HostCollectiveId","ParentCollectiveId","type","startsAt","endsAt","locationName",address,timezone,"maxQuantity","geoLocationLatLong",company,"expensePolicy","githubHandle","countryISO","deactivatedAt","isPledged","isIncognito","approvedAt","isHostAccount",plan,"platformFeePercent") VALUES 
  (10881, 'Test User Admin','For automated testing','USD','2018-01-02 06:00:00.000','2018-01-02 06:00:00.000',NULL,false,NULL,NULL,'testuseradmin',NULL,NULL,NULL,NULL,NULL,NULL,NULL,false,NULL,NULL,NULL,NULL,'USER',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,false,false,NULL,false,NULL,NULL)
  ON CONFLICT DO NOTHING;
  
  INSERT INTO "Orders" (id, "CollectiveId", currency, "totalAmount", description, "SubscriptionId", "createdAt", "updatedAt", "deletedAt", "PaymentMethodId", "processedAt", "privateMessage", "TierId", "FromCollectiveId", "publicMessage", quantity, status, "data", "taxAmount", "interval") VALUES(6338, 28, 'USD', 1150, 'Financial contribution to Rails Girls Atlanta', NULL, '2020-06-24 14:49:57.428', '2020-06-24 14:50:02.404', NULL, NULL, '2020-06-24 14:50:02.404', NULL, NULL, 10881, NULL, 1, 'PAID', '{"tax": null, "reqIp": "::1", "platformFee": 150, "savePaymentMethod": true}', NULL, NULL)
  ON CONFLICT DO NOTHING;

  INSERT INTO "Users" (id, email, "createdAt", "updatedAt", "deletedAt", "firstName", "lastName", "CollectiveId", "newsletterOptIn", "emailWaitingForValidation", "emailConfirmationToken", "lastLoginAt", "data") VALUES(9474, 'testuser+admin@opencollective.com', '2018-01-02 06:00:00.000', '2018-01-02 06:00:00.000', NULL, 'Test', 'User', 10881, true, NULL, NULL, NULL, NULL);

  INSERT INTO "Transactions" (id, "type", description, amount, currency, "createdAt", "updatedAt", "CollectiveId", "CreatedByUserId", "PaymentMethodId", "deletedAt", "data", "OrderId", "platformFeeInHostCurrency", "hostFeeInHostCurrency", "paymentProcessorFeeInHostCurrency", "hostCurrency", "hostCurrencyFxRate", "amountInHostCurrency", "netAmountInCollectiveCurrency", "ExpenseId", uuid, "FromCollectiveId", "HostCollectiveId", "TransactionGroup", "RefundTransactionId", "UsingVirtualCardFromCollectiveId", "taxAmount") VALUES(52866, 'CREDIT', 'Financial contribution to Rails Girls Atlanta', 1150, 'USD', '2020-06-24 14:50:02.373', '2020-06-24 14:50:02.373', 28, 9474, NULL, NULL, '{"charge": {"id": "ch_1GxcjULzdXg9xKNSTdmq8tI2", "paid": true, "order": null, "amount": 1150, "object": "charge", "review": null, "source": null, "status": "succeeded", "created": 1593021000, "dispute": null, "invoice": null, "outcome": {"type": "authorized", "reason": null, "risk_level": "normal", "risk_score": 59, "network_status": "approved_by_network", "seller_message": "Payment complete."}, "refunds": {"url": "/v1/charges/ch_1GxcjULzdXg9xKNSTdmq8tI2/refunds", "data": [], "object": "list", "has_more": false, "total_count": 0}, "captured": true, "currency": "usd", "customer": "cus_HWg5iKUryNRigX", "disputed": false, "livemode": false, "metadata": {"to": "http://localhost:3000/railsgirlsatl", "from": "http://localhost:3000/testuseradmin"}, "refunded": false, "shipping": null, "application": "ca_68FQcZXEcV66Kjg7egLnR1Ce87cqwoue", "description": "Financial contribution to Rails Girls Atlanta", "destination": null, "receipt_url": "https://pay.stripe.com/receipts/acct_18KWlTLzdXg9xKNS/ch_1GxcjULzdXg9xKNSTdmq8tI2/rcpt_HWg55wBeVEzj5iUApY6NVKNQRFYx00u", "failure_code": null, "on_behalf_of": null, "fraud_details": {}, "receipt_email": null, "transfer_data": null, "payment_intent": "pi_1GxcjULzdXg9xKNSSqFfg6wH", "payment_method": "card_1GxcjSLzdXg9xKNSdnm9tt1N", "receipt_number": null, "transfer_group": null, "amount_refunded": 0, "application_fee": "fee_1GxcjVLzdXg9xKNSfAxlF1wn", "billing_details": {"name": null, "email": null, "phone": null, "address": {"city": null, "line1": null, "line2": null, "state": null, "country": null, "postal_code": "42424"}}, "failure_message": null, "source_transfer": null, "balance_transaction": "txn_1GxcjVLzdXg9xKNSq6BqXNVa", "statement_descriptor": null, "application_fee_amount": 150, "payment_method_details": {"card": {"brand": "visa", "last4": "4242", "checks": {"cvc_check": "pass", "address_line1_check": null, "address_postal_code_check": "pass"}, "wallet": null, "country": "US", "funding": "credit", "network": "visa", "exp_year": 2024, "exp_month": 4, "fingerprint": "ftgJeBXvQSZ4HMCg", "installments": null, "three_d_secure": null}, "type": "card"}, "statement_descriptor_suffix": null, "calculated_statement_descriptor": "OPENCOLLECTIVE, INC."}, "balanceTransaction": {"id": "txn_1GxcjVLzdXg9xKNSq6BqXNVa", "fee": 213, "net": 937, "type": "charge", "amount": 1150, "object": "balance_transaction", "source": "ch_1GxcjULzdXg9xKNSTdmq8tI2", "status": "pending", "created": 1593021000, "currency": "usd", "description": "Financial contribution to Rails Girls Atlanta", "fee_details": [{"type": "application_fee", "amount": 150, "currency": "usd", "application": "ca_68FQcZXEcV66Kjg7egLnR1Ce87cqwoue", "description": "OpenCollective application fee"}, {"type": "stripe_fee", "amount": 63, "currency": "usd", "application": null, "description": "Stripe processing fees"}], "available_on": 1593129600, "exchange_rate": null, "sourced_transfers": {"url": "/v1/transfers?source_transaction=ch_1GxcjULzdXg9xKNSTdmq8tI2", "data": [], "object": "list", "has_more": false, "total_count": 0}, "reporting_category": "charge"}}', 6338, -150, 0, -63, 'USD', 1.0, 1150, 937, NULL, 'bc88075c-5990-4f8a-99e7-8a02a12d9d87', 10881, 8674, 'dbf751dc-4508-4b58-962b-bfa776c3f5e0', NULL, NULL, NULL);
  INSERT INTO "Transactions" (id, "type", description, amount, currency, "createdAt", "updatedAt", "CollectiveId", "CreatedByUserId", "PaymentMethodId", "deletedAt", "data", "OrderId", "platformFeeInHostCurrency", "hostFeeInHostCurrency", "paymentProcessorFeeInHostCurrency", "hostCurrency", "hostCurrencyFxRate", "amountInHostCurrency", "netAmountInCollectiveCurrency", "ExpenseId", uuid, "FromCollectiveId", "HostCollectiveId", "TransactionGroup", "RefundTransactionId", "UsingVirtualCardFromCollectiveId", "taxAmount") VALUES(52865, 'DEBIT', 'Financial contribution to Rails Girls Atlanta', -937, 'USD', '2020-06-24 14:50:02.365', '2020-06-24 14:50:02.365', 10881, 9474, NULL, NULL, '{"charge": {"id": "ch_1GxcjULzdXg9xKNSTdmq8tI2", "paid": true, "order": null, "amount": 1150, "object": "charge", "review": null, "source": null, "status": "succeeded", "created": 1593021000, "dispute": null, "invoice": null, "outcome": {"type": "authorized", "reason": null, "risk_level": "normal", "risk_score": 59, "network_status": "approved_by_network", "seller_message": "Payment complete."}, "refunds": {"url": "/v1/charges/ch_1GxcjULzdXg9xKNSTdmq8tI2/refunds", "data": [], "object": "list", "has_more": false, "total_count": 0}, "captured": true, "currency": "usd", "customer": "cus_HWg5iKUryNRigX", "disputed": false, "livemode": false, "metadata": {"to": "http://localhost:3000/railsgirlsatl", "from": "http://localhost:3000/testuseradmin"}, "refunded": false, "shipping": null, "application": "ca_68FQcZXEcV66Kjg7egLnR1Ce87cqwoue", "description": "Financial contribution to Rails Girls Atlanta", "destination": null, "receipt_url": "https://pay.stripe.com/receipts/acct_18KWlTLzdXg9xKNS/ch_1GxcjULzdXg9xKNSTdmq8tI2/rcpt_HWg55wBeVEzj5iUApY6NVKNQRFYx00u", "failure_code": null, "on_behalf_of": null, "fraud_details": {}, "receipt_email": null, "transfer_data": null, "payment_intent": "pi_1GxcjULzdXg9xKNSSqFfg6wH", "payment_method": "card_1GxcjSLzdXg9xKNSdnm9tt1N", "receipt_number": null, "transfer_group": null, "amount_refunded": 0, "application_fee": "fee_1GxcjVLzdXg9xKNSfAxlF1wn", "billing_details": {"name": null, "email": null, "phone": null, "address": {"city": null, "line1": null, "line2": null, "state": null, "country": null, "postal_code": "42424"}}, "failure_message": null, "source_transfer": null, "balance_transaction": "txn_1GxcjVLzdXg9xKNSq6BqXNVa", "statement_descriptor": null, "application_fee_amount": 150, "payment_method_details": {"card": {"brand": "visa", "last4": "4242", "checks": {"cvc_check": "pass", "address_line1_check": null, "address_postal_code_check": "pass"}, "wallet": null, "country": "US", "funding": "credit", "network": "visa", "exp_year": 2024, "exp_month": 4, "fingerprint": "ftgJeBXvQSZ4HMCg", "installments": null, "three_d_secure": null}, "type": "card"}, "statement_descriptor_suffix": null, "calculated_statement_descriptor": "OPENCOLLECTIVE, INC."}, "balanceTransaction": {"id": "txn_1GxcjVLzdXg9xKNSq6BqXNVa", "fee": 213, "net": 937, "type": "charge", "amount": 1150, "object": "balance_transaction", "source": "ch_1GxcjULzdXg9xKNSTdmq8tI2", "status": "pending", "created": 1593021000, "currency": "usd", "description": "Financial contribution to Rails Girls Atlanta", "fee_details": [{"type": "application_fee", "amount": 150, "currency": "usd", "application": "ca_68FQcZXEcV66Kjg7egLnR1Ce87cqwoue", "description": "OpenCollective application fee"}, {"type": "stripe_fee", "amount": 63, "currency": "usd", "application": null, "description": "Stripe processing fees"}], "available_on": 1593129600, "exchange_rate": null, "sourced_transfers": {"url": "/v1/transfers?source_transaction=ch_1GxcjULzdXg9xKNSTdmq8tI2", "data": [], "object": "list", "has_more": false, "total_count": 0}, "reporting_category": "charge"}}', 6338, -150, 0, -63, 'USD', 1.0, -937, -1150, NULL, 'f1a4e8e8-f733-48f6-a4a9-7d300e2d0ecd', 28, NULL, 'dbf751dc-4508-4b58-962b-bfa776c3f5e0', NULL, NULL, NULL);

`;

describe('20200624145300-split-fees-on-top-transactions', () => {
  before(async () => {
    await sequelize.query(RESET);
    await sequelize.sync();
    await migration.up(sequelize.getQueryInterface());
  });

  it('should add metadata information to the order', async () => {
    const [[order]] = await sequelize.query('SELECT * FROM "Orders" WHERE id = 6338');
    expect(order).to.have.nested.property('data.isFeesOnTop').equal(true);
  });

  it('should deduct the platform fee from existing transactions', async () => {
    const [[credit]] = await sequelize.query('SELECT * FROM "Transactions" WHERE id = 52866');
    expect(credit).to.have.property('amount').equal(1000);
    expect(credit).to.have.property('platformFeeInHostCurrency').equal(0);
    expect(credit).to.have.property('netAmountInCollectiveCurrency').equal(937);
    expect(credit).to.have.property('amountInHostCurrency').equal(1000);

    const [[debit]] = await sequelize.query('SELECT * FROM "Transactions" WHERE id = 52865');
    expect(debit).to.have.property('amount').equal(-937);
    expect(debit).to.have.property('platformFeeInHostCurrency').equal(0);
    expect(debit).to.have.property('netAmountInCollectiveCurrency').equal(-1000);
    expect(debit).to.have.property('amountInHostCurrency').equal(-937);
  });

  it('should create transactions for the platform donation', async () => {
    const [transactions] = await sequelize.query(
      'SELECT * FROM "Transactions" WHERE "OrderId" = 6338 AND ("CollectiveId" = 1 OR "FromCollectiveId" = 1) ORDER BY type',
    );
    expect(transactions.length).to.equal(2);

    const [credit, debit] = transactions;
    expect(credit).to.have.property('amount').equal(150);
    expect(credit).to.have.property('platformFeeInHostCurrency').equal(0);
    expect(credit).to.have.property('netAmountInCollectiveCurrency').equal(150);
    expect(credit).to.have.property('amountInHostCurrency').equal(150);

    expect(debit).to.have.property('amount').equal(-150);
    expect(debit).to.have.property('platformFeeInHostCurrency').equal(0);
    expect(debit).to.have.property('netAmountInCollectiveCurrency').equal(-150);
    expect(debit).to.have.property('amountInHostCurrency').equal(-150);
  });
});
