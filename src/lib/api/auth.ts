import config from '../config.json';
import { request } from '$lib/utils/api.utils';
import type { ResponseType } from '$lib/api/types/response.type';

const PROVIDER = config.provider.adastry;

export async function login(username: string, password: string): Promise<ResponseType> {
  return request(
    PROVIDER.url + PROVIDER.endpoints.login,
    'POST',
    {
      username: username,
      password: password
    },
    {},
    [401, 404]
  );
}

export async function create(
  username: string,
  password: string,
  name?: string
): Promise<ResponseType> {
  return request(
    PROVIDER.url + PROVIDER.endpoints.createUser,
    'POST',
    {
      username: username,
      name: name ? name : '',
      password: password,
      currency: 'USD'
    },
    {},
    [400, 409]
  );
}
