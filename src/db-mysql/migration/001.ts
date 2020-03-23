import { knex } from 'hermit-purple-server/lib/db-mysql';
import {
  downBuilder as rawDownBuilder,
  upBuilder as rawUpBuilder,
} from 'hermit-purple-server/lib/db-mysql/migration/001';
import { ASSET, BALANCE, TRANSFER } from '../constants';

export const upBuilder = () => {
  return rawUpBuilder(knex)
    .createTable(ASSET, table => {
      table.specificType('account', 'varchar(40) NOT NULL');

      table.specificType('assetId', 'varchar(64) NOT NULL');

      table.text('name').notNullable();

      table.specificType('supply', 'varchar(16) NOT NULL');

      table
        .integer('precision')
        .defaultTo(0)
        .notNullable();

      table.text('symbol').notNullable();

      table.text('amount').notNullable();

      table.specificType('txHash', 'varchar(64) NOT NULL');
    })
    .createTable(TRANSFER, table => {
      table.specificType('asset', 'varchar(64) NOT NULL').index();

      table.specificType('from', 'varchar(40) NOT NULL').index();

      table.bigIncrements('id').primary();

      table.specificType('to', 'varchar(40) NOT NULL').index();

      table.specificType('txHash', 'varchar(64) NOT NULL').index();

      table
        .specificType('value', 'varchar(16) NOT NULL')
        .comment('original transfer value in hex');

      table
        .text('amount')
        .notNullable()
        .comment('transfer amount with precision');

      table
        .integer('block')
        .index()
        .notNullable()
        .comment('The block height');

      table
        .specificType('timestamp', 'varchar(16) NOT NULL')
        .comment('Block timestamp');
    })
    .createTable(BALANCE, table => {
      table.specificType('address', 'varchar(40) NOT NULL').index();

      table.specificType('assetId', 'varchar(64) NOT NULL').index();

      table.specificType('balance', 'varchar(16) NOT NULL');

      table.bigIncrements('id').primary();

      table.unique(['address', 'assetId']);
    });
};

export const downBuilder = () => {
  return rawDownBuilder(knex)
    .dropTableIfExists(ASSET)
    .dropTableIfExists(TRANSFER)
    .dropTableIfExists(BALANCE);
};
