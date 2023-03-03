export type InvoiceListType = {
  count: number;
  data: InvoiceType[];
};

export type InvoiceType = {
  invoiceId: string;
  txHash: string;
  totalAmount: number;
  accounts: string[];
  pools: string[];
  confirmed: boolean;
  canceled: boolean;
  confirmedAt: string;
  createdAt: string;
  note: string;
};
