import { Muta } from 'muta-sdk';
import { AssetService } from 'huobi-chain-sdk';
import {
  MUTA_CHAINID,
  MUTA_ENDPOINT,
  MUTA_TIMEOUT_GAP,
} from 'hermit-purple-server/lib/hermit-config';

export const muta = new Muta({
  endpoint: MUTA_ENDPOINT,
  chainId: MUTA_CHAINID,
  timeoutGap: MUTA_TIMEOUT_GAP,
});

export const client = muta.client();
export const rawClient = client.getRawClient();
export const readonlyAssetService = new AssetService(client);
