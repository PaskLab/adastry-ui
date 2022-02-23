import config from '../config.json';
import { request } from '$lib/utils/api.utils';

const PROVIDER = config.provider.adastry;

export async function getUserAccounts() {
  return request(PROVIDER.url + PROVIDER.endpoints.accountList);
}

export async function addUserAccount(name: string, address: string) {
  return request(
    PROVIDER.url + PROVIDER.endpoints.addAccount,
    'POST',
    {
      name: name,
      address: address
    },
    {},
    [400, 409]
  );
}

export async function updateUserAccount(name: string, address: string) {
  return request(PROVIDER.url + PROVIDER.endpoints.updateAccount, 'PATCH', {
    name: name,
    address: address
  });
}
