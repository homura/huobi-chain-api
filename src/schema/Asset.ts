import { schema } from '@muta-extra/nexus-schema';
import { pageArgs } from '@muta-extra/nexus-schema/lib/schema/pagination';

export const Asset = schema.objectType({
  name: 'Asset',
  definition(t) {
    t.field('assetId', { type: 'Hash' });

    t.string('name', { description: 'The **full** name of this asset' });

    t.string('symbol', { description: 'The **short** name of this asset' });

    t.field('supply', { type: 'Uint64' });

    t.int('precision');

    t.string('amount');

    t.field('issuer', {
      type: 'Address',
      resolve(parent) {
        return parent.account;
      },
    });
  },
});

export const assetQuery = schema.queryField((t) => {
  t.field('asset', {
    type: 'Asset',
    nullable: true,
    args: {
      assetId: schema.stringArg({ required: true }),
    },
    resolve(parent, args, ctx) {
      return ctx.assetService.findByAssetId(args.assetId);
    },
  });
});

export const assetsPagination = schema.queryField((t) => {
  t.list.field('assets', {
    type: 'Asset',
    args: pageArgs,
    resolve(parent, args, ctx) {
      return ctx.assetService.filter({ pageArgs: args });
    },
  });
});
