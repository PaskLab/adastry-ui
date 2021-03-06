import type { PoolType } from '$lib/api/types/pool.type';

export type AccountType = {
  stakeAddress: string;
  name: string;
  rewardsSum: number;
  loyalty: number;
  epoch: number | null;
  pool: PoolType | null;
};
