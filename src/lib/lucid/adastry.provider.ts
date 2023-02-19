import type {
  Address,
  Assets,
  Datum,
  ProtocolParameters,
  TxHash,
  Unit,
  UTxO,
  Credential,
  Transaction,
  Delegation,
  RewardAddress,
} from 'lucid-cardano';
import { getProtocolParameters, getTxInfo, getUtxos, getUtxosWithUnit } from '$lib/api/proxy';
import { C, toHex, fromHex } from 'lucid-cardano';

export class AdastryProvider implements AdastryProvider {
  async getProtocolParameters(): Promise<ProtocolParameters> {
    const result = await getProtocolParameters();

    return {
      minFeeA: parseInt(result.min_fee_a),
      minFeeB: parseInt(result.min_fee_b),
      maxTxSize: parseInt(result.max_tx_size),
      maxValSize: parseInt(result.max_val_size),
      keyDeposit: BigInt(result.key_deposit),
      poolDeposit: BigInt(result.pool_deposit),
      priceMem: parseFloat(result.price_mem),
      priceStep: parseFloat(result.price_step),
      maxTxExMem: BigInt(result.max_tx_ex_mem),
      maxTxExSteps: BigInt(result.max_tx_ex_steps),
      coinsPerUtxoByte: BigInt(result.coins_per_utxo_size),
      collateralPercentage: parseInt(result.collateral_percent),
      maxCollateralInputs: parseInt(result.max_collateral_inputs),
      costModels: result.cost_models,
    };
  }

  async getUtxos(addressOrCredential: Address | Credential): Promise<UTxO[]> {
    const queryPredicate = (() => {
      if (typeof addressOrCredential === 'string') return addressOrCredential;
      const credentialBech32 =
        addressOrCredential.type === 'Key'
          ? C.Ed25519KeyHash.from_hex(addressOrCredential.hash).to_bech32('addr_vkh')
          : C.ScriptHash.from_hex(addressOrCredential.hash).to_bech32('addr_vkh'); // should be 'script' (CIP-0005)
      return credentialBech32;
    })();
    let result: BlockfrostUtxoResult = [];
    let page = 1;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const pageResult: BlockfrostUtxoResult | BlockfrostUtxoError = await getUtxos(
        queryPredicate,
        page,
      );
      if ((pageResult as BlockfrostUtxoError).error) {
        if ((pageResult as BlockfrostUtxoError).status_code === 404) {
          return [];
        } else {
          throw new Error('Could not fetch UTxOs from Blockfrost. Try again.');
        }
      }
      result = result.concat(pageResult as BlockfrostUtxoResult);
      if ((pageResult as BlockfrostUtxoResult).length <= 0) break;
      page++;
    }

    return this.blockfrostUtxosToUtxos(result);
  }

  async getUtxosWithUnit(addressOrCredential: Address | Credential, unit: Unit): Promise<UTxO[]> {
    const queryPredicate = (() => {
      if (typeof addressOrCredential === 'string') return addressOrCredential;
      const credentialBech32 =
        addressOrCredential.type === 'Key'
          ? C.Ed25519KeyHash.from_hex(addressOrCredential.hash).to_bech32('addr_vkh')
          : C.ScriptHash.from_hex(addressOrCredential.hash).to_bech32('addr_vkh'); // should be 'script' (CIP-0005)
      return credentialBech32;
    })();
    let result: BlockfrostUtxoResult = [];
    let page = 1;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const pageResult: BlockfrostUtxoResult | BlockfrostUtxoError = await getUtxosWithUnit(
        queryPredicate,
        unit,
        page,
      );
      if ((pageResult as BlockfrostUtxoError).error) {
        if ((pageResult as BlockfrostUtxoError).status_code === 404) {
          return [];
        } else {
          throw new Error('Could not fetch UTxOs from Blockfrost. Try again.');
        }
      }
      result = result.concat(pageResult as BlockfrostUtxoResult);
      if ((pageResult as BlockfrostUtxoResult).length <= 0) break;
      page++;
    }

    return this.blockfrostUtxosToUtxos(result);
  }

  /**
   * DO NOT USE
   */
  // @ts-ignore
  async getUtxoByUnit(unit: Unit): Promise<UTxO> {}

  /**
   * DO NOT USE
   */
  // @ts-ignore
  async getUtxosByOutRef(outRefs: OutRef[]): Promise<UTxO[]> {}

  /**
   * DO NOT USE
   */
  // @ts-ignore
  async getDelegation(rewardAddress: RewardAddress): Promise<Delegation> {}

  /**
   * DO NOT USE
   */
  // @ts-ignore
  async getDatum(datumHash: DatumHash): Promise<Datum> {}

  awaitTx(txHash: TxHash): Promise<boolean> {
    return new Promise((res) => {
      const confirmation = setInterval(async () => {
        const isConfirmed = await getTxInfo(txHash);
        if (isConfirmed && !isConfirmed.error) {
          clearInterval(confirmation);
          res(true);
          return;
        }
      }, 3000);
    });
  }

  /**
   * DO NOT USE
   */
  async submitTx(tx: Transaction): Promise<TxHash> {
    return '';
  }

  private async blockfrostUtxosToUtxos(result: BlockfrostUtxoResult): Promise<UTxO[]> {
    return (await Promise.all(
      result.map(async (r) => ({
        txHash: r.tx_hash,
        outputIndex: r.output_index,
        assets: (() => {
          const a: Assets = {};
          r.amount.forEach((am) => {
            a[am.unit] = BigInt(am.quantity);
          });
          return a;
        })(),
        address: r.address,
        datumHash: !r.inline_datum ? r.data_hash : undefined,
        datum: r.inline_datum,
        scriptRef: r.reference_script_hash,
      })),
    )) as UTxO[];
  }
}

export function tryToDoubleCborEncodedScript(script: string): string {
  try {
    C.PlutusScript.from_bytes(C.PlutusScript.from_bytes(fromHex(script)).bytes());
    return script;
  } catch (_e) {
    return toHex(C.PlutusScript.new(fromHex(script)).to_bytes());
  }
}

/**
 * This function is temporarily needed only, until Blockfrost returns the datum natively in Cbor.
 * The conversion is ambigious, that's why it's better to get the datum directly in Cbor.
 */
export function datumJsonToCbor(json: DatumJson): Datum {
  return '';
}

type DatumJson = {
  int?: number;
  bytes?: string;
  list?: Array<DatumJson>;
  map?: Array<{ k: unknown; v: unknown }>;
  fields?: Array<DatumJson>;
  [constructor: string]: unknown; // number; constructor needs to be simulated like this as optional argument
};

type BlockfrostUtxoResult = Array<{
  tx_hash: string;
  output_index: number;
  address: Address;
  amount: Array<{ unit: string; quantity: string }>;
  data_hash?: string;
  inline_datum?: string;
  reference_script_hash?: string;
}>;

type BlockfrostUtxoError = {
  status_code: number;
  error: unknown;
};
