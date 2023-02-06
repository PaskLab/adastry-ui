export type UserPoolType = {
  poolId: string;
  name: string;
  isMember: boolean;
  isSubscribed: boolean;
  pending: boolean;
};

export type UserPoolListType = UserPoolType[];
