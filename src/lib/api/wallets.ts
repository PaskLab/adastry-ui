import config from '../config.json';
import { getURL, request } from '$lib/utils/api.utils';
import type { AccountType } from '$lib/api/types/account.type';
import type { ResponseType } from '$lib/api/types/response.type';
import type { AccountListType } from '$lib/api/types/account-list.type';
import type { AccountHistoryType } from '$lib/api/types/account-history.type';

const PROVIDER = config.provider.adastry;

export async function getUserAccounts(): Promise<AccountListType> {
  return request(PROVIDER.url + PROVIDER.endpoints.accountList);
}

export async function addUserAccount(name: string, address: string): Promise<ResponseType> {
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

export async function updateUserAccount(name: string, address: string): Promise<ResponseType> {
  return request(PROVIDER.url + PROVIDER.endpoints.updateAccount, 'PATCH', {
    name: name,
    address: address
  });
}

export async function getAccount(stakeAddress: string): Promise<AccountType> {
  return request(
    PROVIDER.url + getURL(PROVIDER.endpoints.getAccount, { stakeAddress: stakeAddress })
  );
}

export async function getHistory(
  stakeAddress: string,
  options?: { page?: number; limit?: number; from?: number; order?: 'ASC' | 'DESC' }
): Promise<AccountHistoryType> {
  return request(
    PROVIDER.url + getURL(PROVIDER.endpoints.getHistory, { stakeAddress: stakeAddress, ...options })
  );
}
