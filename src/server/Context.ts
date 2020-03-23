import { knex, MySQLDAO } from 'hermit-purple-server/lib/db-mysql';
import {
  buildManyQuery,
  findMany,
  FindManyOption,
  findOne,
} from 'hermit-purple-server/lib/db-mysql/knex-helper';
import {
  DAO,
  MaybeAsync,
  PageArgs,
} from 'hermit-purple-server/lib/hermit-types/server';
import { ASSET, BALANCE, TRANSFER } from '../db-mysql/constants';
import { Asset, Balance, Transfer } from '../generated/types';

interface TransferDAO {
  transferByTxHash(args: { txHash: string }): MaybeAsync<Transfer>;

  transfers(args: {
    where: { assetId?: string; blockHeight?: number };
    pageArgs: PageArgs;
  }): Promise<Transfer[]>;

  transfersByFromOrTo(args: {
    fromOrTo: string;
    pageArgs: PageArgs;
  }): Promise<Transfer[]>;
}

interface BalanceDAO {
  balances(args: {
    where: { address: string };
    pageArgs: PageArgs;
  }): Promise<Balance[]>;
}

interface AssetDAO {
  assetById(args: { id: string }): MaybeAsync<Asset>;

  assets(args: { pageArgs: PageArgs }): Promise<Asset[]>;
}

interface ExtraDAO extends DAO {
  transfer: TransferDAO;
  balance: BalanceDAO;
  asset: AssetDAO;
}

export interface ServerContext {
  dao: ExtraDAO;
}

export const dao: ExtraDAO = {
  ...MySQLDAO,
  transfer: {
    async transferByTxHash({ txHash }) {
      return findOne<Transfer>(knex, TRANSFER, { txHash });
    },
    async transfersByFromOrTo({ pageArgs, fromOrTo }) {
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

      const { first, last, skip } = pageArgs;
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
    async transfers(args) {
      const assetId = args.where.assetId;
      const blockHeight = args.where.blockHeight;

      const where: FindManyOption<Transfer>['where'] = assetId
        ? { asset: assetId }
        : blockHeight === undefined
        ? {}
        : { block: blockHeight };

      return findMany<Transfer>(knex, TRANSFER, {
        orderBy: ['id', 'desc'],
        page: args.pageArgs,
        where,
      });
    },
  },
  asset: {
    async assetById({ id }) {
      return findOne<Asset>(knex, ASSET, { assetId: id });
    },
    assets({ pageArgs }) {
      return findMany<Asset>(knex, ASSET, {
        page: pageArgs,
        orderBy: ['name', 'asc'],
      });
    },
  },

  balance: {
    balances({ where, pageArgs }) {
      return findMany<Balance>(knex, BALANCE, {
        where: { address: where.address },
        orderBy: ['id', 'desc'],
        page: pageArgs,
      });
    },
  },
};

export function createContext(): ServerContext {
  return { dao };
}
