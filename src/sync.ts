#!/usr/bin/env node
require('@muta-extra/hermit-purple').loadEnvFile();

import { createSynchronizer, logger } from '@muta-extra/hermit-purple';

import { ASSET, BALANCE, TRANSFER } from './db-mysql/constants';
import { TransactionResolver } from './sync/TransactionResolver';

const debug = logger.childLogger('sync:debug');

createSynchronizer({
  async onExecutedSave(executed, ctx) {
    const trx = ctx.trx;
    const transactions = executed.getTransactions();
    const receipts = executed.getReceipts();

    const resolver = new TransactionResolver({
      transactions,
      receipts,
      height: executed.height(),
      timestamp: executed.getBlock().timestamp,
    });
    await resolver.resolve();

    debug(`transaction resolved to exact operation`);

    const createdAssets = resolver.getCreatedAssets();

    for (let asset of createdAssets) {
      await trx.insert(asset).into(ASSET).onDuplicateUpdate('asset_id');
    }

    const transfers = resolver.getTransfers();
    if (transfers.length) {
      await trx.batchInsert(TRANSFER, transfers).transacting(trx);
    }
    debug(`${transfers.length} transfers prepared`);

    const balances = resolver.getBalances();
    for (let balance of balances) {
      await trx
        .insert(balance)
        .into(BALANCE)
        .onDuplicateUpdate('address', 'asset_id');
    }

    const accounts = resolver.getRelevantAccount();

    for (let account of accounts) {
      await trx.insert(account).into('account').onDuplicateUpdate('address');
    }
  },
}).run();
