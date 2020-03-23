import { HERMIT_DATABASE_URL } from 'hermit-purple-server/lib/hermit-config';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { typescriptOfSchema } from 'schemats';

async function main() {
  const schema = await typescriptOfSchema(HERMIT_DATABASE_URL);
  writeFileSync(
    join(__dirname, '../generated/types.ts'),
    `// @ts-nocheck \n${schema}`,
  );
  process.exit(0);
}

main();
