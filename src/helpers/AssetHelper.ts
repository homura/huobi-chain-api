import { findOne, getKnexInstance } from '@muta-extra/knex-mysql';
import { utils } from '@mutadev/muta-sdk';
import { Address, Hash, Uint64 } from '@mutadev/types';
import BigNumber from 'bignumber.js';
import { Asset as ReceiptAsset } from 'huobi-chain-sdk';
import LRUCache from 'lru-cache';
import { ASSET } from '../db-mysql/constants';
import { client } from '../muta';
import { Asset } from '../types';

const knex = getKnexInstance();
BigNumber.config({ EXPONENTIAL_AT: 18 });

export function toAmount(value: string, precision: number | BigNumber) {
  precision = new BigNumber(precision).toNumber();
  return new BigNumber(value, 16).shiftedBy(-precision).toString();
}

export function receiptAssetToDBAsset(
  receiptAsset: ReceiptAsset,
  txHash: Hash,
): Asset {
  const supply = '0x' + new BigNumber(receiptAsset.supply).toString(16);
  const precision = new BigNumber(receiptAsset.precision).toNumber();
  return {
    assetId: receiptAsset.id,
    precision: precision,
    supply: supply,
    // TODO
    txHash,
    account: receiptAsset.issuer,
    symbol: receiptAsset.symbol,
    name: receiptAsset.name,
    amount: toAmount(supply, precision),
  };
}

class AssetHelper {
  private cache: LRUCache<string, Asset>;

  constructor() {
    this.cache = new LRUCache();
  }

  cacheAsset(asset: Asset) {
    this.cache.set(asset.assetId, asset);
  }

  async getDBAsset(assetId: string) {
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
      .shiftedBy(-new BigNumber(precision!))
      .toString();
  }

  async getBalance(assetId: Hash, address: Address, withAmount: boolean) {
    const res = await client.queryService({
      serviceName: 'asset',
      method: 'get_balance',
      payload: {
        user: utils.toHex(address),
        asset_id: utils.toHex(assetId),
      },
    });

    const value = utils.safeParseJSON(res.succeedData);
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
