import { knex } from 'hermit-purple-server/lib/db-mysql';
import {
  ACCOUNT,
  BLOCK,
  BLOCK_VALIDATOR,
  EVENT,
  RECEIPT,
  TRANSACTION,
} from 'hermit-purple-server/lib/db-mysql/constants';
import {
  BlockSynchronizer,
  Synchronizer,
} from 'hermit-purple-server/lib/hermit-sync';
import { hexAddress } from 'hermit-purple-server/lib/hermit-sync/clean/hex';
import { debug } from 'hermit-purple-server/lib/hermit-sync/log';
import { Block } from 'hermit-purple-server/lib/hermit-types/model';
import { attachOnDuplicateUpdate } from 'knex-on-duplicate-update';
import { ASSET, BALANCE, TRANSFER } from './db-mysql/constants';
import { Asset, Balance } from './generated/types';
import { receiptAssetToDBAsset } from './helpers/AssetHelper';
import { readonlyAssetService } from './muta';
import { TransactionResolver } from './sync/TransactionResolver';

attachOnDuplicateUpdate();

const syncAdapter: Synchronizer = {
  async getLocalBlockHeight(): Promise<number> {
    const block = await knex<Block>(BLOCK)
      .select('height')
      .orderBy('height', 'desc')
      .limit(1);

    return block[0]?.height ?? 0;
  },

  async getLocalBlockExecHeight(): Promise<number> {
    const block = await knex<Block>(BLOCK)
      .select('execHeight')
      .orderBy('height', 'desc')
      .limit(1);

    return block[0].execHeight ?? 0;
  },

  async onGenesis() {
    const receipt = await readonlyAssetService.get_native_asset();

    const asset = receiptAssetToDBAsset(
      receipt.succeedData,
      // There is no txHash in the genesis block, this is a virtual txHash
      '0000000000000000000000000000000000000000000000000000000000000000',
    );
    await knex<Asset>(ASSET).insert(asset);
    await knex<Balance>(BALANCE).insert({
      address: hexAddress(receipt.succeedData.issuer),
      balance: asset.supply,
      assetId: asset.assetId,
      id: 1,
    });
  },

  async onBlockPacked(): Promise<void> {},

  async onBlockExecuted(executed): Promise<void> {
    await knex.transaction(async trx => {
      await trx<Block>(BLOCK).insert(executed.getBlock());
      const transactions = executed.getTransactions();
      const receipts = executed.getReceipts();

      await knex.batchInsert(TRANSACTION, transactions).transacting(trx);
      debug(`${transactions.length} transactions prepared`);

      await knex.batchInsert(RECEIPT, receipts).transacting(trx);
      debug(`${receipts.length} receipts prepared`);

      const events = executed.getEvents();
      await knex.batchInsert(EVENT, events).transacting(trx);
      debug(`${events.length} events prepared`);

      for (let validator of executed.getValidators()) {
        await knex
          .insert(validator)
          .into(BLOCK_VALIDATOR)
          //@ts-ignore
          .onDuplicateUpdate('address', 'version')
          .transacting(trx);
      }

      if (transactions.length === 0) return;

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
        await knex
          .insert(asset)
          .into(ASSET)
          // @ts-ignore
          .onDuplicateUpdate('assetId')
          .transacting(trx);
      }

      const transfers = resolver.getTransfers();
      if (transfers.length) {
        await knex.batchInsert(TRANSFER, transfers).transacting(trx);
      }
      debug(`${transfers.length} transfers prepared`);

      const balances = resolver.getBalances();
      for (let balance of balances) {
        await knex
          .insert(balance)
          .into(BALANCE)
          //@ts-ignore
          .onDuplicateUpdate('address', 'assetId')
          .transacting(trx);
      }

      const accounts = resolver.getRelevantAccount();

      for (let account of accounts) {
        await knex
          .insert(account)
          .into(ACCOUNT)
          //@ts-ignore
          .onDuplicateUpdate('address')
          .transacting(trx);
      }
    });
  },
};

new BlockSynchronizer(syncAdapter).run();
