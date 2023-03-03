import config from '$lib/config.json';
import { getURL, request } from '$lib/utils/api.utils';
import type { AccountCategoryType } from '$lib/api/types/account-category.type';
import type { AccountListType } from '$lib/api/types/account-list.type';

const PROVIDER = config.provider.adastry;

export async function getCategories(): Promise<AccountCategoryType[]> {
  return request(PROVIDER.url + PROVIDER.endpoints.category.list);
}

export async function addCategory(name: string): Promise<AccountCategoryType> {
  return request(
    PROVIDER.url + PROVIDER.endpoints.category.add,
    'POST',
    {
      name,
    },
    {},
    [400],
  );
}

export async function updateCategoryName(slug: string, name: string): Promise<ResponseType> {
  return request(
    PROVIDER.url + PROVIDER.endpoints.category.update,
    'PATCH',
    {
      slug,
      name,
    },
    {},
    [400, 404],
  );
}

export async function updateCategoryAccounts(
  slug: string,
  accounts: string[],
): Promise<ResponseType> {
  return request(
    PROVIDER.url + PROVIDER.endpoints.category.update,
    'PATCH',
    {
      slug,
      accounts,
    },
    {},
    [400, 404],
  );
}

export async function deleteCategory(slug: string): Promise<ResponseType> {
  return request(PROVIDER.url + getURL(PROVIDER.endpoints.category.delete, { slug }), 'DELETE');
}

export async function getCategoryAccountsList(slug: string): Promise<AccountListType> {
  return request(PROVIDER.url + getURL(PROVIDER.endpoints.category.accountsList, { slug }));
}
