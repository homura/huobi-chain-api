#!/usr/bin/env node
require('@muta-extra/common').loadEnvFile();

import { schema } from '@muta-extra/nexus-schema';
import { join } from 'path';
import { types } from '../schema';

const outputTypegen = join(__dirname, '../generated/nexus.ts');

export const schemas = schema.makeSchema({
  types,
  outputs: {
    typegen: outputTypegen,
  },
  typegenAutoConfig: {
    contextType: 'ctx.IHuobiService',
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
