import {
  HERMIT_CORS_ORIGIN,
  HERMIT_MAX_COMPLEXITY,
  HERMIT_MAX_SKIP_SIZE,
  HERMIT_PORT,
  MUTA_ENDPOINT,
} from 'hermit-purple-server/lib/hermit-config';
import { createListLimitationValidator } from 'hermit-purple-server/lib/hermit-graphql/graphql-middlewares/complexity';
import {
  Options,
  GraphQLServer,
  defaultErrorFormatter,
} from 'hermit-purple-server/lib/hermit-lib/graphql-yoga';
import bodyParser from 'body-parser';
import cors from 'cors';
import { GraphQLError } from 'graphql';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { createContext } from './server/Context';
import { schema } from './server/make-schema';

const validateListLimitation = createListLimitationValidator({
  fields: [
    'blocks',
    'transactions',
    'accounts',
    'assets',
    'transfers',
    'balances',
  ],
  maxFieldSize: HERMIT_MAX_COMPLEXITY,
  maxSkipSize: HERMIT_MAX_SKIP_SIZE,
});

const server = new GraphQLServer({
  schema,
  context: createContext,
});

if (HERMIT_CORS_ORIGIN) {
  server.express.use(cors({ origin: HERMIT_CORS_ORIGIN }));
}

const chain_proxy = createProxyMiddleware({
  target: MUTA_ENDPOINT,
  changeOrigin: true,
  pathRewrite: {
    '^/chain': '',
  },

  onProxyReq: (proxyReq, req, res) => {
    try {
      const transferQuery = `mutation sendTransaction($inputRaw: InputRawTransaction!, $inputEncryption: InputTransactionEncryption!) {\n  sendTransaction(inputRaw: $inputRaw, inputEncryption: $inputEncryption)\n}\n`;
      // @ts-ignore
      const inputRaw = req.body.variables.inputRaw;
      if (
        // @ts-ignore
        req.body.query !== transferQuery ||
        inputRaw.serviceName !== 'asset' ||
        inputRaw.method !== 'transfer'
      ) {
        throw 'only transfer method supported';
      }
    } catch (err) {
      // @ts-ignore
      res.status(400).end(`invalid query. err: ${err}`);
      return;
    }
    // @ts-ignore
    if (req.body) {
      // @ts-ignore
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
});

server.express.use('/chain', bodyParser.json()).use('/chain', chain_proxy);

if (process.env.NODE_ENV !== 'development') {
  server.use(function(err, req, res, next) {
    if (err) {
      res.status(500).send('Oops');
      return;
    }
    next();
  });
}

const options: Options = {
  formatError(error: GraphQLError) {
    if (error.originalError && !(error.originalError instanceof GraphQLError)) {
      return 'Unknown error';
    }
    return defaultErrorFormatter(error);
  },
  port: HERMIT_PORT,
  validationRules: req => [context => validateListLimitation(context, req)],
  ...(HERMIT_CORS_ORIGIN
    ? { cors: { origin: HERMIT_CORS_ORIGIN } }
    : { cors: false }),
};

server.start(options, () =>
  console.log(`🚀 Server ready at: http://127.0.0.1:${HERMIT_PORT}`),
);
