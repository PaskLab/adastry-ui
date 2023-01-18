import config from '../config.json';
import { getURL, request } from '$lib/utils/api.utils';
import type { AccountStateType } from '$lib/api/types/account-state.type';
import type { NewInvoiceType } from '$lib/api/types/new-invoice.type';
import type { InvoiceListType } from '$lib/api/types/invoice.type';

const PROVIDER = config.provider.adastry;

export async function getAccountsState(): Promise<AccountStateType[]> {
  return request(getURL(PROVIDER.url + PROVIDER.endpoints.getAccountsState));
}
export async function getInvoiceList(): Promise<InvoiceListType> {
  return request(getURL(PROVIDER.url + PROVIDER.endpoints.getUserInvoiceList));
}

export async function createInvoice(invoice: NewInvoiceType): Promise<ResponseType> {
  return request(getURL(PROVIDER.url + PROVIDER.endpoints.createInvoice), 'POST', invoice);
}
