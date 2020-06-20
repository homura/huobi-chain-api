import { schemas } from '@muta-extra/nexus-schema';
import * as asset from './Asset';
import * as balance from './Balance';
import * as transfer from './Transfer';

export const types = {
  ...asset,
  ...balance,
  ...transfer,
  ...schemas,
};
