#!/usr/bin/env node
require('@muta-extra/common').loadEnvFile();

import { envStr } from '@muta-extra/common';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { typescriptOfSchema } from 'schemats';

async function main() {
  const connection = envStr('HERMIT_DATABASE_URL', '');

  if (!connection)
    throw new Error(
      'HERMIT_DATABASE_URL is required, try to config it to environment variable',
    );

  const schema = await typescriptOfSchema(connection);
  writeFileSync(
    join(__dirname, '../generated/types.ts'),
    `// @ts-nocheck \n${schema}`,
  );
  process.exit(0);
}

main();
