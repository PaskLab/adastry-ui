import config from '../config.json';
import { getURL, request } from '$lib/utils/api.utils';
import type { ResponseType } from '$lib/api/types/response.type';
import type { MessagePayloadType } from '$lib/api/types/message-payload.type';

const PROVIDER = config.provider.adastry;

export async function login(username: string, password: string): Promise<ResponseType> {
  return request(
    PROVIDER.url + PROVIDER.endpoints.login,
    'POST',
    {
      username,
      password,
    },
    {},
    [401, 404],
  );
}

export async function loginSignature(key: string, signature: string): Promise<ResponseType> {
  return request(
    PROVIDER.url + PROVIDER.endpoints.loginSignature,
    'POST',
    {
      key,
      signature,
    },
    {},
    [401, 404],
  );
}

export async function getAuthPayload(address: string): Promise<MessagePayloadType> {
  return request(getURL(PROVIDER.url + PROVIDER.endpoints.getAuthPayload, { address }));
}
