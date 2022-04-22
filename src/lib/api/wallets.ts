import config from '../config.json';
import { getURL, request } from '$lib/utils/api.utils';
import type { AccountType } from '$lib/api/types/account.type';
import type { ResponseType } from '$lib/api/types/response.type';
import type { AccountListType } from '$lib/api/types/account-list.type';
import type { AccountHistoryListType } from '$lib/api/types/account-history.type';
import type { TransactionListType } from '$lib/api/types/account-transaction.type';
import type { CSVFileType } from '$lib/api/types/csv-file.type';

const PROVIDER = config.provider.adastry;

export async function getUserAccounts(): Promise<AccountListType> {
  return request(PROVIDER.url + PROVIDER.endpoints.accountList);
}

export async function addUserAccount(name: string, address: string): Promise<ResponseType> {
  return request(
    PROVIDER.url + PROVIDER.endpoints.addAccount,
    'POST',
    {
      name,
      address,
    },
    {},
    [400, 409],
  );
}

export async function deleteUserAccount(stakeAddress: string): Promise<ResponseType> {
  return request(
    PROVIDER.url + getURL(PROVIDER.endpoints.deleteAccount, { stakeAddress }),
    'DELETE',
  );
}

export async function updateUserAccount(stakeAddress: string, name: string): Promise<ResponseType> {
  return request(
    PROVIDER.url + PROVIDER.endpoints.updateAccount,
    'PATCH',
    {
      stakeAddress,
      name,
    },
    {},
    [400, 404],
  );
}

export async function getAccount(stakeAddress: string): Promise<AccountType> {
  return request(PROVIDER.url + getURL(PROVIDER.endpoints.getAccount, { stakeAddress }));
}

export async function getHistory(
  stakeAddress: string,
  options?: { page?: number; limit?: number; from?: number; order?: 'ASC' | 'DESC' },
): Promise<AccountHistoryListType> {
  return request(
    PROVIDER.url + getURL(PROVIDER.endpoints.getHistory, { stakeAddress, ...options }),
  );
}

export async function getTransactions(
  stakeAddress: string,
  options?: { page?: number; limit?: number; from?: number; to?: number; order?: 'ASC' | 'DESC' },
): Promise<TransactionListType> {
  return request(
    PROVIDER.url + getURL(PROVIDER.endpoints.getTransactions, { stakeAddress, ...options }),
  );
}

export async function getRewardsCSV(
  stakeAddress: string,
  year: number,
  format: string,
  quarter?: number,
): Promise<CSVFileType> {
  return request(
    PROVIDER.url +
      getURL(PROVIDER.endpoints.exportRewards, { stakeAddress, year, format, quarter }),
  );
}

export async function getTransactionCSV(
  stakeAddress: string,
  year: number,
  format: string,
  quarter?: number,
): Promise<CSVFileType> {
  return request(
    PROVIDER.url +
      getURL(PROVIDER.endpoints.exportTransactions, { stakeAddress, year, format, quarter }),
  );
}
