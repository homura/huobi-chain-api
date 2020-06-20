import { rm0x, toHex } from '@muta-extra/common/lib/utils/bytes';
import { findOne, getKnexInstance } from '@muta-extra/knex-mysql';
import {
  hexAddress,
  hexHash,
  hexU64,
} from '@muta-extra/synchronizer/lib/clean/hex';
import { Address, Hash, Uint64 } from '@mutajs/types';
import BigNumber from 'bignumber.js';
import { Asset as ReceiptAsset } from 'huobi-chain-sdk';
import LRUCache from 'lru-cache';
import { ASSET } from '../db-mysql/constants';
import { Asset, Asset as DBAsset } from '../generated/types';
import { readonlyAssetService } from '../muta';

const knex = getKnexInstance();
BigNumber.config({ EXPONENTIAL_AT: 18 });

export function toAmount(value: string, precision: number | BigNumber) {
  precision = new BigNumber(precision).toNumber();
  return new BigNumber(value, 16).shiftedBy(-precision).toString();
}

export function receiptAssetToDBAsset(
  receiptAsset: ReceiptAsset,
  txHash: Hash,
): DBAsset {
  const supply = hexU64(receiptAsset.supply);
  const precision = new BigNumber(receiptAsset.precision).toNumber();
  return {
    assetId: rm0x(receiptAsset.id),
    precision: precision,
    supply: supply,
    // TODO
    txHash,
    account: hexAddress(receiptAsset.issuer),
    symbol: receiptAsset.symbol,
    name: receiptAsset.name,
    amount: toAmount(supply, precision),
  };
}

class AssetHelper {
  private cache: LRUCache<string, DBAsset>;

  constructor() {
    this.cache = new LRUCache();
  }

  cacheAsset(asset: DBAsset) {
    this.cache.set(hexHash(asset.assetId), asset);
  }

  async getDBAsset(assetId: string) {
    assetId = hexHash(assetId);
    if (this.cache.has(assetId)) return this.cache.get(assetId)!;

    const asset = await findOne<Asset>(knex, ASSET, { assetId });
    if (!asset) return null;

    this.cacheAsset(asset);
    return asset;
  }

  async amountByAssetIdAndValue(assetId: Hash, value: Uint64) {
    const asset = await this.getDBAsset(assetId);
    if (!asset) return '0';

    const precision = asset.precision;
    return new BigNumber(value, 16)
      .shiftedBy(-new BigNumber(precision))
      .toString();
  }

  async getBalance(assetId: Hash, address: Address, withAmount: boolean) {
    const receipt = await readonlyAssetService.get_balance({
      user: toHex(address),
      asset_id: toHex(assetId),
    });

    const value = receipt.succeedData.balance.toString(16);
    if (!withAmount) {
      return { value };
    }

    return {
      value: value,
      amount: await this.amountByAssetIdAndValue(assetId, value),
    };
  }
}

export const helper = new AssetHelper();
