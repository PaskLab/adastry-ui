import { getURL, request } from '$lib/utils/api.utils';
import type { UserMappingListType } from '$lib/api/types/user-mapping.type';
import config from '$lib/config.json';
import type { GlobalMappingListType } from '$lib/api/types/global-mapping.type';

const PROVIDER = config.provider.adastry;
export async function getUserMapping(options?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<UserMappingListType> {
  return request(PROVIDER.url + getURL(PROVIDER.endpoints.userMapping, { ...options }));
}

export async function getGlobalMapping(options?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<GlobalMappingListType> {
  return request(PROVIDER.url + getURL(PROVIDER.endpoints.globalMapping, { ...options }));
}

export async function toggleMappingOptions(options: {
  fingerprint: string;
  useGlobalKoinlyId?: boolean;
}): Promise<string> {
  return request(PROVIDER.url + getURL(PROVIDER.endpoints.toggleMappingOptions), 'PATCH', options);
}

export async function submitMappingRequest(options: {
  hexId: string;
  koinlyId?: string;
}): Promise<string> {
  return request(
    PROVIDER.url + getURL(PROVIDER.endpoints.mappingRequest),
    'POST',
    options,
    {},
    [404, 409],
  );
}
