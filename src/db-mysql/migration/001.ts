import { Migration001 } from '@muta-extra/hermit-purple';

import { ACCOUNT, ASSET, BALANCE, TRANSFER } from '../constants';

export class HuobiMigration001 extends Migration001 {
  constructor() {
    super();
  }

  up() {
    return super
      .up()
      .createTable(ASSET, (table) => {
        table.increments('id');

        table.specificType('account', 'varchar(48) NOT NULL');

        table.specificType('asset_id', 'varchar(66) NOT NULL');

        table.text('name', 'varchar(255)').notNullable();

        table.specificType('supply', 'varchar(18) NOT NULL');

        table.integer('precision').defaultTo(0).notNullable();

        table.text('symbol').notNullable();

        table.specificType('tx_hash', 'varchar(66) NOT NULL');
      })
      .createTable(TRANSFER, (table) => {
        table.bigIncrements('id');

        table
          .specificType('asset', 'varchar(66) NOT NULL')
          .index('idx_transfer_asset');

        table
          .specificType('from', 'varchar(48) NOT NULL')
          .index('idx_transfer_from');

        table
          .specificType('to', 'varchar(48) NOT NULL')
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
          .specificType('address', 'varchar(48) NOT NULL')
          .index('idx_balance_address');

        table
          .specificType('asset_id', 'varchar(66) NOT NULL')
          .index('idx_balance_asset_id');

        table.specificType('balance', 'varchar(18) NOT NULL');

        table.unique(['address', 'asset_id'], 'uniq_balance_address_asset_id');
      })
      .createTable(ACCOUNT, (table) => {
        table.bigIncrements('id');

        table
          .specificType('address', 'varchar(48) NOT NULL')
          .unique('uniq_account_address');
      });
  }

  down() {
    return super
      .down()
      .dropTableIfExists(ASSET)
      .dropTableIfExists(TRANSFER)
      .dropTableIfExists(BALANCE)
      .dropTableIfExists(ACCOUNT);
  }
}
