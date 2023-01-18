import config from '../config.json';
import { getURL, request } from '$lib/utils/api.utils';

const PROVIDER = config.provider.adastry;

export async function getProtocolParameters() {
  return request(PROVIDER.url + getURL(PROVIDER.endpoints.proxy.getProtocolParameters));
}

export async function getUtxos(address: string, page?: number) {
  return request(PROVIDER.url + getURL(PROVIDER.endpoints.proxy.getUtxos, { address, page }));
}

export async function getUtxosWithUnit(address: string, asset: string, page?: number) {
  return request(
    PROVIDER.url + getURL(PROVIDER.endpoints.proxy.getUtxosWithUnit, { address, asset, page }),
  );
}

export async function getTxInfo(hash: string) {
  return request(PROVIDER.url + getURL(PROVIDER.endpoints.proxy.getTxInfo, { hash }));
}

export async function submit(body: any) {
  return request(PROVIDER.url + getURL(PROVIDER.endpoints.proxy.submit, { body }), 'POST');
}
