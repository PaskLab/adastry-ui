import config from '../config.json';
import { getURL, request } from '$lib/utils/api.utils';
import type { EpochType } from './types/epoch.type';

const PROVIDER = config.provider.adastry;

export async function getLastEpoch(): Promise<EpochType> {
  return request(PROVIDER.url + getURL(PROVIDER.endpoints.lastEpoch));
}
