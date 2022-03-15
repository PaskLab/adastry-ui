export type PoolType = {
  poolId: string;
  name: string;
  blocksMinted: number;
  liveStake: number;
  liveSaturation: number;
  liveDelegators: number;
  isMember: boolean;
  epoch: number | null;
};
