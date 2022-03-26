export type TransactionListType = {
  count: number;
  data: TransactionType[];
};

export type TransactionType = {
  addresses: string[];
  txHash: string;
  txIndex: number;
  blockHeight: number;
  blockTime: number;
  txType: 'RX' | 'TX' | 'MX';
  received: BlockfrostAmount[];
  sent: BlockfrostAmount[];
  fees: number;
  deposit: number;
  withdrawalCount: number;
  mirCertCount: number;
  delegationCount: number;
  stakeCertCount: number;
  poolUpdateCount: number;
  poolRetireCount: number;
  assetMintCount: number;
  redeemerCount: number;
  validContract: boolean;
  tags: string[];
  needReview: boolean;
};

export type BlockfrostAmount = {
  unit: string;
  quantity: string;
};
