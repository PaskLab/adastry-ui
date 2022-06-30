import config from '../config.json';
import { getURL, request } from '$lib/utils/api.utils';
import type { UserType } from '$lib/api/types/user.type';
import type { ResponseType } from '$lib/api/types/response.type';

const PROVIDER = config.provider.adastry;

export async function create(
  username: string,
  password: string,
  name?: string,
): Promise<ResponseType> {
  return request(
    PROVIDER.url + PROVIDER.endpoints.createUser,
    'POST',
    {
      username: username,
      name: name ? name : '',
      password: password,
      currency: 'USD',
    },
    {},
    [400, 409],
  );
}

export async function createSignature(key: string, signature: string): Promise<ResponseType> {
  return request(
    PROVIDER.url + PROVIDER.endpoints.createUserSignature,
    'POST',
    {
      key: key,
      signature: signature,
    },
    {},
    [400, 409],
  );
}

export async function getUserProfile(): Promise<UserType> {
  return request(PROVIDER.url + getURL(PROVIDER.endpoints.getUserProfile));
}

export async function updateUserCurrency(code: string): Promise<string> {
  return request(PROVIDER.url + getURL(PROVIDER.endpoints.updateUserCurrency), 'PATCH', { code });
}
