import { Knex } from '@muta-extra/knex-mysql';
import { Migration1591797537928 } from '@muta-extra/knex-mysql/lib/migration/Migration1591797537928';

import { ASSET, BALANCE, TRANSFER } from '../constants';

export class HuobiMigration001 extends Migration1591797537928 {
  up(): Knex.SchemaBuilder {
    return super
      .up()
      .createTable(ASSET, (table) => {
        table.increments('id');

        table.specificType('account', 'varchar(42) NOT NULL');

        table.specificType('asset_id', 'varchar(66) NOT NULL');

        table.text('name').notNullable();

        table.specificType('supply', 'varchar(18) NOT NULL');

        table.integer('precision').defaultTo(0).notNullable();

        table.text('symbol').notNullable();

        table.text('amount').notNullable();

        table.specificType('tx_hash', 'varchar(66) NOT NULL');
      })
      .createTable(TRANSFER, (table) => {
        table.bigIncrements('id');

        table
          .specificType('asset', 'varchar(66) NOT NULL')
          .index('idx_transfer_asset');

        table
          .specificType('from', 'varchar(42) NOT NULL')
          .index('idx_transfer_from');

        table
          .specificType('to', 'varchar(42) NOT NULL')
          .index('idx_transfer_to');

        table
          .specificType('tx_hash', 'varchar(66) NOT NULL')
          .index('idx_transfer_tx_hash');

        table
          .specificType('value', 'varchar(18) NOT NULL')
          .comment('original transfer value in hex');

        table
          .text('amount')
          .notNullable()
          .comment('transfer amount with precision');

        table
          .integer('block')
          .index('idx_transfer_block')
          .notNullable()
          .comment('The block height');

        table
          .specificType('timestamp', 'varchar(18) NOT NULL')
          .comment('Block timestamp');
      })
      .createTable(BALANCE, (table) => {
        table.bigIncrements('id');

        table
          .specificType('address', 'varchar(42) NOT NULL')
          .index('idx_balance_address');

        table
          .specificType('asset_id', 'varchar(66) NOT NULL')
          .index('idx_balance_asset_id');

        table.specificType('balance', 'varchar(18) NOT NULL');

        table.unique(['address', 'asset_id'], 'uniq_balance_address_asset_id');
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
