import { join } from 'path';

let [, , version, argOperation] = process.argv as [
  string,
  string,
  '001',
  ('up' | 'down')?,
];

async function main() {
  if (!version) {
    console.error('Wrong usage, try run `npm migrate 001`');
    return;
  }

  const migrate = require(join(__dirname, `../db-mysql/migration/${version}`));

  const migrationBuilder =
    argOperation === 'up'
      ? 'upBuilder'
      : argOperation === 'down'
      ? 'downBuilder'
      : '';

  if (migrationBuilder) {
    await migrate[migrationBuilder]();
    console.log(`migrate ${version} ${migrationBuilder} success`);
    process.exit(0);
  }

  console.log(migrate.upBuilder().toQuery());
}

main();
