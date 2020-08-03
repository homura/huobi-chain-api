#!/usr/bin/env node
require('@muta-extra/hermit-purple').loadEnvFile();

import { makeSchema } from '@muta-extra/hermit-purple';
import { join } from 'path';
import { types } from '../schema';

const outputTypegen = join(__dirname, '../generated/nexus.ts');

export const schemas = makeSchema({
  types,
  outputs: {
    typegen: outputTypegen,
  },
  typegenAutoConfig: {
    contextType: 'ctx.IAllService',
    backingTypeMap: {
      Address: 'string',
      Bytes: 'string',
      Hash: 'string',
      Uint64: 'string',
    },
    sources: [
      {
        source: require.resolve('../service'),
        alias: 'ctx',
      },
      {
        source: require.resolve('../types'),
        alias: 'db',
      },
    ],
  },
});
