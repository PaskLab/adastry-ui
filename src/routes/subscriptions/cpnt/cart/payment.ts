import { Blockfrost, Lucid, TxSigned } from 'lucid-cardano';
import ShortUniqueId from 'short-unique-id';
import config from '$lib/config.json';
import type { NewInvoiceType } from '$lib/api/types/new-invoice.type';
import type { TxHash, WalletApi } from 'lucid-cardano';

export default class Payment {
  private signedTx: TxSigned | undefined;

  private invoiceId = '';

  stakeAddresses: string[] = [];

  poolIds: string[] = [];

  constructor(private readonly api: WalletApi) {}

  async newPayment(
    stakeAddresses: string[],
    poolIds: string[],
    lovelace: bigint,
  ): Promise<NewInvoiceType> {
    const lucid = await Lucid.new(
      new Blockfrost('https://cardano-mainnet.blockfrost.io/api/v0', ''),
    );

    lucid.selectWallet(this.api);

    const uid = new ShortUniqueId({ length: 10 });
    this.invoiceId = uid();

    const validUntil = new Date();
    validUntil.setHours(validUntil.getHours() + 2);

    const tx = await lucid
      .newTx()
      .payToAddress(config.billing.paymentAddress, { lovelace })
      .attachMetadata(123456, { AdastryInvoice: this.invoiceId })
      .validTo(validUntil.valueOf())
      .complete();

    this.signedTx = await tx.sign().complete();

    this.stakeAddresses = stakeAddresses;
    this.poolIds = poolIds;

    return this.getInvoiceBody();
  }

  getTxHash(): string | undefined {
    return this.signedTx?.toHash();
  }

  getInvoiceBody(): NewInvoiceType {
    return {
      invoiceId: this.invoiceId,
      txHash: this.signedTx ? this.signedTx.toHash() : '',
      accounts: this.stakeAddresses,
      pools: this.poolIds,
    };
  }

  async submit(): Promise<TxHash | undefined> {
    if (this.signedTx) {
      return this.signedTx.submit();
    }
  }
}
