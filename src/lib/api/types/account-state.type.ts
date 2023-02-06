export type AccountStateType = {
  stakeAddress: string;
  name: string;
  active: boolean;
  pending: boolean;
  invoiceId: string;
  type: 'account' | 'pool' | 'member' | 'none';
  createdAt: string;
  confirmedAt: string;
};
