import { schema } from '@muta-extra/hermit-purple';
import { helper } from '../helpers/AssetHelper';
import { pageArgs } from './common';

export const Balance = schema.objectType({
  name: 'Balance',
  definition(t) {
    t.field('balance', {
      type: 'Uint64',
      description: 'Uint64 balance',
      async resolve(parent) {
        return (
          (await helper.getBalance(parent.assetId, parent.address, true))
            ?.value! ?? '0'
        );
      },
    });

    t.field('address', {
      type: 'Address',
    });

    t.field('asset', {
      type: 'Asset',
      async resolve(parent, args, ctx) {
        return (await ctx.assetService.findByAssetId(args.assetId))!;
      },
    });

    t.string('amount', {
      async resolve(parent) {
        return (
          (await helper.getBalance(parent.assetId, parent.address, true))
            ?.amount! ?? '0'
        );
      },
    });
  },
});

export const balancePagination = schema.queryField((t) => {
  t.list.field('balances', {
    type: 'Balance',
    args: {
      ...pageArgs,
      // assetId: arg({ type: 'Hash' }),
      address: schema.arg({ type: 'Address', required: true }),
    },
    async resolve(parent, args, ctx) {
      const address = args.address;
      if (!address) return [];
      return await ctx.balanceService.filterByAddress({
        pageArgs: args,
        address: args.address,
      });
    },
  });
});
