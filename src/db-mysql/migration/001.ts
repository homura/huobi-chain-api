import { Knex } from '@muta-extra/knex-mysql';
import { Migration1591797537928 } from '@muta-extra/knex-mysql/lib/migration/Migration1591797537928';

import { ASSET, BALANCE, TRANSFER } from '../constants';

export class HuobiMigration001 extends Migration1591797537928 {
  up(): Knex.SchemaBuilder {
    return super
      .up()
      .createTable(ASSET, (table) => {
        table.specificType('account', 'varchar(42) NOT NULL');

        table.specificType('assetId', 'varchar(66) NOT NULL');

        table.text('name').notNullable();

        table.specificType('supply', 'varchar(18) NOT NULL');

        table.integer('precision').defaultTo(0).notNullable();

        table.text('symbol').notNullable();

        table.text('amount').notNullable();

        table.specificType('txHash', 'varchar(66) NOT NULL');
      })
      .createTable(TRANSFER, (table) => {
        table.specificType('asset', 'varchar(66) NOT NULL').index();

        table.specificType('from', 'varchar(42) NOT NULL').index();

        table.bigIncrements('id').primary();

        table.specificType('to', 'varchar(42) NOT NULL').index();

        table.specificType('txHash', 'varchar(66) NOT NULL').index();

        table
          .specificType('value', 'varchar(18) NOT NULL')
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
          .specificType('timestamp', 'varchar(18) NOT NULL')
          .comment('Block timestamp');
      })
      .createTable(BALANCE, (table) => {
        table.specificType('address', 'varchar(42) NOT NULL').index();

        table.specificType('assetId', 'varchar(66) NOT NULL').index();

        table.specificType('balance', 'varchar(18) NOT NULL');

        table.bigIncrements('id').primary();

        table.unique(['address', 'assetId']);
      });
  }

  down(): Knex.SchemaBuilder {
    return super
      .down()
      .dropTableIfExists(ASSET)
      .dropTableIfExists(TRANSFER)
      .dropTableIfExists(BALANCE);
  }
}
