import type { PoolType } from '$lib/api/types/pool.type';

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
  revisedRewards: number;
  opRewards: number;
  withdrawable: number;
  withdrawn: number;
  pool: PoolType | null;
  owner: boolean;
  stakeShare: number;
  spotPrice: SpotPrice;
};

export type EpochType = {
  epoch: number;
  startTime: number;
  endTime: number;
};

export type SpotPrice = {
  code: string;
  price: number;
};
