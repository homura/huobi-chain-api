#!/usr/bin/env node
require('@muta-extra/common').loadEnvFile();

import { logger } from '@muta-extra/common';
import {
  DefaultLocalFetcher,
  DefaultSyncEventHandler,
  getKnexInstance,
  Knex,
} from '@muta-extra/knex-mysql';
import {
  DefaultRemoteFetcher,
  Executed,
  IFetchLocalAdapter,
  IFetchRemoteAdapter,
  ISyncEventHandlerAdapter,
  ISynchronizerAdapter,
  PollingSynchronizer,
} from '@muta-extra/synchronizer';
import { ASSET, BALANCE, TRANSFER } from './db-mysql/constants';
import { TransactionResolver } from './sync/TransactionResolver';

const debug = logger.childLogger('sync:debug');

const knex = getKnexInstance();

class HuobiEventHandler extends DefaultSyncEventHandler
  implements ISyncEventHandlerAdapter {
  async saveExecutedBlock(
    trx: Knex.Transaction,
    executed: Executed,
  ): Promise<void> {
    await super.saveExecutedBlock(trx, executed);

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
      await trx
        .insert(asset)
        .into(ASSET)
        // @ts-ignore
        .onDuplicateUpdate('assetId');
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
        // @ts-ignore
        .onDuplicateUpdate('address', 'assetId');
    }

    const accounts = resolver.getRelevantAccount();

    for (let account of accounts) {
      await trx
        .insert(account)
        .into('Account')
        //@ts-ignore
        .onDuplicateUpdate('address');
    }
  }
}

const remoteFetcher: IFetchRemoteAdapter = new DefaultRemoteFetcher();
const localFetcher: IFetchLocalAdapter = new DefaultLocalFetcher();
const eventHandler: ISyncEventHandlerAdapter = new HuobiEventHandler();

const syncAdapter: ISynchronizerAdapter = {
  ...remoteFetcher,
  ...localFetcher,
  ...eventHandler,
};

new PollingSynchronizer(syncAdapter).run();
