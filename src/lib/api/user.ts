import config from '../config.json';
import { getURL, request } from '$lib/utils/api.utils';
import type { UserType } from '$lib/api/types/user.type';

const PROVIDER = config.provider.adastry;

export async function getUserProfile(): Promise<UserType> {
  return request(PROVIDER.url + getURL(PROVIDER.endpoints.getUserProfile));
}

export async function updateUserCurrency(code: string): Promise<string> {
  return request(PROVIDER.url + getURL(PROVIDER.endpoints.updateUserCurrency), 'PATCH', { code });
}
