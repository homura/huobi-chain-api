require('@muta-extra/hermit-purple').loadEnvFile();

import { envNum, extendService, makeSchema } from '@muta-extra/hermit-purple';
import { ApolloServer } from 'apollo-server';
import path from 'path';
import { types } from './schema';
import { HuobiService } from './service';

const schema = makeSchema({
  types,
  outputs: {
    schema: path.join(__dirname, 'generated/api.graphql'),
  },
});

const services = extendService(new HuobiService());

const server = new ApolloServer({
  schema,
  context: { ...services },
});

const port = envNum('HERMIT_PORT', 4040);

server.listen({ port }, () =>
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`,
  ),
);
