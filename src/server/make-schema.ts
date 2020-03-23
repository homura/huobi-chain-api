import { nexusTypes } from 'hermit-purple-server';
import { makeSchema } from 'hermit-purple-server/lib/hermit-lib/nexus';
import { join } from 'path';
import * as customTypes from './schema/types';

const outputGraphQLSchema = join(__dirname, '../generated/schema.graphql');
const outputTypegen = join(__dirname, '../generated/nexus.ts');

export const schema = makeSchema({
  types: {
    ...nexusTypes,
    ...customTypes,
  },
  outputs: {
    schema: outputGraphQLSchema,
    typegen: outputTypegen,
  },
  typegenAutoConfig: {
    contextType: 'ctx.ServerContext',
    backingTypeMap: {
      Address: 'string',
      Bytes: 'string',
      Hash: 'string',
      Uint64: 'string',
    },
    sources: [
      {
        source: require.resolve('./Context'),
        alias: 'ctx',
      },
      {
        source: require.resolve('../generated/types'),
        alias: 'db',
      },
    ],
  },
});
