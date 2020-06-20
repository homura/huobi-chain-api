import {
  buildManyQuery,
  DefaultService,
  findMany,
  findOne,
  getKnexInstance,
} from '@muta-extra/knex-mysql';
import { IService, QueryManyFn, QueryOneFn } from '@muta-extra/nexus-schema';
import { ASSET, BALANCE, TRANSFER } from './db-mysql/constants';
import { Asset, Balance, Transfer } from './generated/types';

interface ITransferService {
  findByTxHash: QueryOneFn<Transfer, string>;
  filterByBlockHeight: QueryManyFn<Transfer, { blockHeight: number }>;
  filterByAssetId: QueryManyFn<Transfer, { assetId: string }>;
  filterByFromOrTo: QueryManyFn<Transfer, { fromOrTo: string }>;
  filter: QueryManyFn<Transfer, {}>;
}

interface IBalanceService {
  filterByAddress: QueryManyFn<Balance, { address: string }>;
}

interface IAssetService {
  findByAssetId: QueryOneFn<Asset, string>;
  filter: QueryManyFn<Asset, {}>;
}

export interface IHuobiService extends IService {
  transferService: ITransferService;
  balanceService: IBalanceService;
  assetService: IAssetService;
}

const knex = getKnexInstance();

export class HuobiService extends DefaultService implements IHuobiService {
  transferService: ITransferService;
  balanceService: IBalanceService;
  assetService: IAssetService;

  constructor() {
    super();
    this.transferService = {
      async filter(args) {
        return findMany<Transfer>(knex, TRANSFER, {
          page: args.pageArgs,
        });
      },
      async findByTxHash(txHash: string) {
        return findOne<Transfer>(knex, TRANSFER, { txHash });
      },

      async filterByBlockHeight(args) {
        return findMany<Transfer>(knex, TRANSFER, {
          page: args.pageArgs,
          where: { block: args.blockHeight },
          orderBy: ['id', 'desc'],
        });
      },

      async filterByAssetId(args) {
        return findMany<Transfer>(knex, TRANSFER, {
          page: args.pageArgs,
          where: { asset: args.assetId },
          orderBy: ['id', 'desc'],
        });
      },

      async filterByFromOrTo(args) {
        const { fromOrTo, pageArgs } = args;
        const fromBuilder = buildManyQuery<Transfer>(knex, TRANSFER, {
          orderBy: ['id', 'desc'],
          where: { from: fromOrTo },
          page: pageArgs,
        });

        const toBuilder = buildManyQuery<Transfer>(knex, TRANSFER, {
          orderBy: ['id', 'desc'],
          where: { to: fromOrTo },
          page: pageArgs,
        });

        const { first, last, skip } = pageArgs || {};
        const limit = first || last || 10;
        const offset = skip || 0;

        const data = await knex.raw(
          `select * from (
(${fromBuilder.toQuery()}) 
union all 
(${toBuilder.toQuery()})) as t order by t.id desc limit ${limit} offset ${offset}`,
        );
        return data[0] ?? [];
      },
    };
    this.balanceService = {
      filterByAddress(args) {
        return findMany<Balance>(knex, BALANCE, {
          where: { address: args.address },
          orderBy: ['id', 'desc'],
          page: args.pageArgs,
        });
      },
    };
    this.assetService = {
      findByAssetId(assetId) {
        return findOne<Asset>(knex, ASSET, { assetId });
      },
      filter(args) {
        return findMany<Asset>(knex, ASSET, {
          page: args.pageArgs,
          orderBy: ['name', 'asc'],
        });
      },
    };
  }
}
