import type { PoolType } from '$lib/api/types/pool.type';

export type AccountHistoryListType = {
  count: number;
  data: AccountHistoryType[];
};

export type AccountHistoryType = {
  account: string;
  epoch: number;
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
};
