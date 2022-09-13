import config from '$lib/config.json';
import { getURL, request } from '$lib/utils/api.utils';
import type { UserType } from '$lib/api/types/user.type';
import type { ResponseType } from '$lib/api/types/response.type';
import type { UpdateUserType } from '$lib/api/types/update-user.type';
import type { VerifiedAddressType } from './types/verified-address.type';

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

export async function deleteUser(): Promise<ResponseType> {
  return request(PROVIDER.url + getURL(PROVIDER.endpoints.deleteUser), 'DELETE');
}

export async function updateUserProfile(profile: UpdateUserType): Promise<string> {
  return request(
    PROVIDER.url + getURL(PROVIDER.endpoints.updateUserProfile),
    'PATCH',
    profile,
    {},
    [400, 409],
  );
}

export async function updateUserCurrency(code: string): Promise<string> {
  return request(PROVIDER.url + getURL(PROVIDER.endpoints.updateUserCurrency), 'PATCH', { code });
}

export async function getVerifiedAddresses(): Promise<VerifiedAddressType[]> {
  return request(PROVIDER.url + getURL(PROVIDER.endpoints.userVerifiedAddresses));
}

export async function verifyAddress(body: {
  key: string;
  signature: string;
  name?: string;
}): Promise<ResponseType> {
  return request(
    PROVIDER.url + getURL(PROVIDER.endpoints.userVerifyAddress),
    'POST',
    body,
    {},
    [400, 404, 409],
  );
}

export async function updateVerifiedAddress(
  stakeAddress: string,
  name: string,
): Promise<ResponseType> {
  return request(
    PROVIDER.url + getURL(PROVIDER.endpoints.userUpdateVerifiedAddress),
    'PATCH',
    { name, stakeAddress },
    {},
    [404],
  );
}

export async function removeVerifiedAddress(stakeAddress: string): Promise<ResponseType> {
  return request(
    PROVIDER.url + getURL(PROVIDER.endpoints.userRemoveVerifiedAddress, { stakeAddress }),
    'DELETE',
  );
}
