---
sidebar_position: 3
---

# Transaction CSV

Transaction history is one of the data category you can actually export on Adastry.

## Filter Options

You can filter by **Year** and **Period** (Q1, Q2, Q3, Q4 or Full year).

## Format Options

Each available **.csv** format options are described below along with additional details where needed.

### Default Format

| Date (UTC)           | Sent Amount | Sent Currency | Received Amount | Received Currency | Fee Amount | Fee Currency | Net Worth Amount | Net Worth Currency | Label | Description                                                       | TxHash                        | Metadata                                 |
|----------------------|-------------|---------------|-----------------|-------------------|------------|--------------|------------------|--------------------|-------|-------------------------------------------------------------------|-------------------------------|------------------------------------------|
| 2022-02-24 21:44:51Z |             |               | 1.5             | ADA               |            |              | 1.73             | USD                |       | MINTING/BURNING                                                   | 76c24dc40ab2...               | [{"label":"721","json_metadata": "..."}] |
|                      |             |               | 1               | SpaceBud4040      |            |              |                  |                    |       | SpaceBud4040 - asset1zkug... (Subpart of txHash: 76c24dc40ab2...) | (SpaceBud4040)76c24dc40ab2... | [{"label":"721","json_metadata": "..."}] |                                        |

- Based on **Koinly Format** below, with the addition of the transaction **Metadata** field.
- **Sent & Received**
  - A transaction can both be sent and received at the same time.
  - Each record line contains a single asset type (Sent or Received currency type).
- **Description**
  - The **"Subpart of** notice along with transaction hash will be added if required.
- **TxHash**
  - The transaction hash will be prepended with the asset name if required. 

:::info
Transaction handling multiple asset are split among multiple lines.
- The subpart of the transaction is identified as is in description field.
- Asset name is prepended to TxHash ID to make the record unique, which helps to prevent duplicates
  when importing the same file multiple times.
:::

### Koinly Format

| Date (UTC)           | Sent Amount | Sent Currency | Received Amount | Received Currency | Fee Amount | Fee Currency | Net Worth Amount | Net Worth Currency | Label | Description                                                              | TxHash                        |
|----------------------|-------------|---------------|-----------------|-------------------|------------|--------------|------------------|--------------------|-------|--------------------------------------------------------------------------|-------------------------------|
| 2022-02-24 21:44:51Z |             |               | 1.5             | ADA               |            |              | 1.73             | USD                |       | MINTING/BURNING                                                          | 76c24dc40ab2...               |
|                      |             |               | 1               | NFT1              |            |              |                  |                    |       | NFT1 = SpaceBud4040 [asset1zkug...] (Subpart of txHash: 76c24dc40ab2...) | (SpaceBud4040)76c24dc40ab2... |

- Same as above **Default** format, except for the **Metadata** field and currency symbol.
- **Sent & Received Native Assets (token & NFT)**
  - Support for Cardano native assets is not yet completed on **Koinly**, the current official workaround is the use of placeholders.
    - The **NFT** asset name is replaced by placeholder like NFT1, NFT2, etc. The real name and asset fingerprint will be added in the description field. 
    - The **Token** asset name is replaced by placeholder like NULL1, NULL2, etc. The real name and asset fingerprint will be added in the description field.
  - Some token are currently supported on Koinly, you can later edit the transaction and search for the right asset using its fingerprint, ie: asset1h7jsujzt4s8...
  - Koinly ref: [How to add NFT trades manually (using placeholders)](https://help.koinly.io/en/articles/5742771-how-to-add-nft-trades-manually-using-placeholders)
  - Koinly ref: [How Koinly imports NFTs](https://help.koinly.io/en/articles/5998331-how-koinly-imports-nfts)
- **Description**
  - Equivalence between placeholders and real asset name along with fingerprint will be added if required.

:::tip
#### Correct handling of NFT & Token with placeholders

In order to establish the right acquisition and disposal price of an asset, each asset should have a unique identifier.

Because not every asset is supported on different tax tools, Adastry need to attribute a unique supported placeholder to each asset exported for these software.

Adastry's mapping feature will generate the mapping automatically, but user should review the import on Koinly and make sure every appearance of an
asset bear the same identifier.

This will help Koinly's software to calculate the right profit/loss for unsupported NFTs and Tokens.

See [CSV Export > Mapping](/learn/docs/export/mapping) for more information.

:::
