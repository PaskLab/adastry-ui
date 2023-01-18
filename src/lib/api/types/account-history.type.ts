import type { PoolType } from '$lib/api/types/pool.type';
import type { EpochType } from '$lib/api/types/epoch.type';

export type AccountHistoryListType = {
  count: number;
  data: AccountHistoryType[];
};

export type AccountHistoryType = {
  account: string;
  epoch: EpochType;
  activeStake: number;
  balance: number;
  rewards: number;
  mir: number;
  revisedRewards: number;
  opRewards: number;
  withdrawable: number;
  withdrawn: number;
  pool: PoolType | null;
  owner: boolean;
  stakeShare: number;
  spotPrice: SpotPrice;
};

export type SpotPrice = {
  code: string;
  price: number;
};
