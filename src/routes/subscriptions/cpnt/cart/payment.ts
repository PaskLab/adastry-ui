import { Lucid, TxSigned } from 'lucid-cardano';
import ShortUniqueId from 'short-unique-id';
import config from '$lib/config.json';
import type { NewInvoiceType } from '$lib/api/types/new-invoice.type';
import type { WalletApi } from 'lucid-cardano';
import { AdastryProvider } from '$lib/lucid/adastry.provider';

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
    const lucid = await Lucid.new(new AdastryProvider());

    lucid.selectWallet(this.api);

    const uid = new ShortUniqueId({ length: 10 });
    this.invoiceId = uid();

    const validUntil = new Date();
    validUntil.setHours(validUntil.getHours() + 2);

    const tx = await lucid
      .newTx()
      .payToAddress(config.billing.paymentAddress, { lovelace })
      .attachMetadata(122334, { AdastryInvoice: this.invoiceId })
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
      txBody: this.signedTx ? this.signedTx.toString() : '',
      accounts: this.stakeAddresses,
      pools: this.poolIds,
    };
  }
}
