type Address = string;
type Paginate = { page: number; limit: number };
export type DataSignature = { signature: string; key: string };

export type Cip0030Type = {
  getChangeAddress: () => Promise<Address>;
  getUsedAddresses: (paginate?: Paginate) => Promise<Address[]>;
  signData: (addr: Address, payload: string) => Promise<DataSignature>;
};
