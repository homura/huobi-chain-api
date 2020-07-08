import {
  Account as DBAccount,
  Asset as DBAsset,
  Balance as DBBalance,
  Transaction as DBTransaction,
  Transfer as DBTransfer,
} from './generated/types';

type WithoutID<T, ID extends string = 'id'> = Omit<T, ID>;

export type Asset = WithoutID<DBAsset>;
export type Transfer = WithoutID<DBTransfer>;
export type Account = WithoutID<DBAccount>;
export type Balance = WithoutID<DBBalance>;
export type Transaction = WithoutID<DBTransaction>;
