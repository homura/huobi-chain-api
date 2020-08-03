import { ReceiptModel, TransactionModel } from '@muta-extra/hermit-purple';
import { utils } from '@mutadev/muta-sdk';
import { Uint64 } from '@mutadev/types';
import BigNumber from 'bignumber.js';
import { helper } from '../helpers/AssetHelper';
import { Account, Asset, Balance, Transfer } from '../types';

type TransactionWithoutOrder = Omit<TransactionModel, 'order'>;

interface TransactionResolverOptions {
  height: number;
  timestamp: Uint64;
  transactions: TransactionWithoutOrder[];
  receipts: ReceiptModel[];
}

export class TransactionResolver {
  private readonly txs: TransactionWithoutOrder[];

  private readonly receipts: ReceiptModel[];

  private readonly transfers: Transfer[];

  private readonly assets: Asset[];

  private readonly balances: Balance[];

  private readonly accounts: Set<string>;

  /**
   * This set is used to ensure that the balance
   * will not be updated repeatedly
   */
  private readonly balanceTask: Set<string>; // address + assetId
  private readonly height: number;
  private readonly timestamp: string;

  constructor(options: TransactionResolverOptions) {
    const { transactions, receipts, height, timestamp } = options;
    this.height = height;
    this.timestamp = timestamp;
    this.txs = transactions;
    this.receipts = receipts;

    this.transfers = [];
    this.assets = [];
    this.balances = [];
    this.balanceTask = new Set();
    this.accounts = new Set();
  }

  async resolve() {
    await this.walk();
  }

  getRelevantAccount(): Account[] {
    return Array.from(this.accounts).map((address) => ({ address }));
  }

  getCreatedAssets(): Asset[] {
    return this.assets;
  }

  getTransfers(): Transfer[] {
    return this.transfers;
  }

  getBalances(): Balance[] {
    return this.balances;
  }

  private enqueueTransfer(transfer: Transfer) {
    this.transfers.push(transfer);
  }

  private enqueueAsset(asset: Asset) {
    helper.cacheAsset(asset);
    this.assets.push(asset);
  }

  private async enqueueBalance(address: string, assetId: string) {
    this.accounts.add(address);
    if (this.balanceTask.has(address + assetId)) {
      return;
    }
    this.balanceTask.add(address + assetId);

    this.balances.push({
      address,
      assetId,
      // Since the balance will be affected by complex calculations such as fees,
      // the balance will be directly obtained on the chain
      balance: '0x0',
    });
  }

  private async walk() {
    const { txs, receipts } = this;

    const len = txs.length;

    for (let i = 0; i < len; i++) {
      const tx = txs[i];
      const receipt = receipts[i];

      const txHash = tx.txHash;
      const from: string = tx.sender;

      const { serviceName, method, payload: payloadStr } = tx;
      if (receipt.isError || serviceName !== 'asset') return;

      if (method === 'transfer') {
        const payload = utils.safeParseJSON(
          payloadStr /*{
          asset_id: SourceDataType.Hash,
          to: SourceDataType.Address,
          value: SourceDataType.u64,
        }*/,
        );

        this.enqueueTransfer({
          asset: utils.toHex(payload.asset_id),
          from,
          to: payload.to,
          txHash,
          value: utils.toHex(payload.value),
          block: this.height,
          timestamp: this.timestamp,
          amount: await helper.amountByAssetIdAndValue(
            payload.asset_id,
            payload.value,
          ),
        });

        this.enqueueBalance(from, payload.asset_id);
        this.enqueueBalance(payload.to, payload.asset_id);
      }

      if (method === 'transfer_from') {
        const payload = utils.safeParseJSON(payloadStr);

        this.enqueueTransfer({
          asset: utils.toHex(payload.asset_id),
          from,
          to: payload.recipient,
          txHash,
          value: utils.toHex(payload.value),
          block: this.height,
          timestamp: this.timestamp,
          amount: await helper.amountByAssetIdAndValue(
            payload.asset_id,
            payload.value,
          ),
        });

        this.enqueueBalance(from, payload.asset_id);
        this.enqueueBalance(payload.recipient, payload.asset_id);
        this.enqueueBalance(payload.sender, payload.asset_id);
      }

      if (method === 'create_asset') {
        const payload = utils.safeParseJSON(receipt.ret);

        const precision = new BigNumber(payload.precision, 16).toNumber();
        const supply = utils.toHex(new BigNumber(payload.supply).toString(16));
        this.enqueueAsset({
          assetId: payload.id,
          name: payload.name,
          symbol: payload.symbol,
          supply: supply,
          account: from,
          txHash,
          precision,
        });

        this.enqueueBalance(from, payload.id);
      }
    }
  }
}
