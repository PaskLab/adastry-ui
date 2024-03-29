import config from '../config.json';
import { getURL, request } from '$lib/utils/api.utils';
import type { MonthlyStatsListType } from '$lib/api/types/monthly-stats.type';
import type { PoolROSType } from './types/pool-ros.type';

const PROVIDER = config.provider.adastry;

export async function getMonthlyRewardsStats(
  year: number,
  month: number,
): Promise<MonthlyStatsListType> {
  return request(PROVIDER.url + getURL(PROVIDER.endpoints.monthlyRewardsStats, { year, month }));
}

export async function getMonthlyStakeStats(
  year: number,
  month: number,
): Promise<MonthlyStatsListType> {
  return request(PROVIDER.url + getURL(PROVIDER.endpoints.monthlyStakeStats, { year, month }));
}

export async function getPoolsROS(from: number): Promise<PoolROSType[]> {
  return request(PROVIDER.url + getURL(PROVIDER.endpoints.poolsROSStats, { from, order: 'ASC' }));
}
