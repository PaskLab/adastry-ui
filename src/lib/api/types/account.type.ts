import type { PoolType } from '$lib/api/types/pool.type';

export type AccountType = {
  stakeAddress: string;
  name: string;
  active: boolean;
  premiumPlan: 'account' | 'pool' | 'member' | 'none';
  rewardsSum: number;
  withdrawable: number;
  loyalty: number;
  epoch: number | null;
  pool: PoolType | null;
  syncing: boolean;
};
