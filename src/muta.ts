import { AssetService } from 'huobi-chain-sdk';
import { Muta } from 'muta-sdk';

export const muta = new Muta();

export const client = muta.client();
export const rawClient = client.getRawClient();
export const readonlyAssetService = new AssetService(client);
