import { schema } from '@muta-extra/hermit-purple';

export const pageArgs = {
  first: schema.intArg(),
  last: schema.intArg(),
  skip: schema.intArg(),
};
