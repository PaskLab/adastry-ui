---
sidebar_position: 3
---

# Transaction CSV

Transaction history is one of the data category you can actually export on Adastry.

## Filter Options

You can filter by **Year** and **Period** (Q1, Q2, Q3, Q4 or Full year).

## Format Options

Each available **.csv** format options are described bellow along with supplementary details where needed.

### Default Format

| Date (UTC)           | Sent Amount | Sent Currency | Received Amount | Received Currency | Fee Amount | Fee Currency | Net Worth Amount | Net Worth Currency | Label | Description                                                       | TxHash                        | Metadata                                 |
|----------------------|-------------|---------------|-----------------|-------------------|------------|--------------|------------------|--------------------|-------|-------------------------------------------------------------------|-------------------------------|------------------------------------------|
| 2022-02-24 21:44:51Z |             |               | 1.5             | ADA               |            |              | 1.73             | USD                |       | MINTING/BURNING                                                   | 76c24dc40ab2...               | [{"label":"721","json_metadata": "..."}] |
|                      |             |               | 1               | SpaceBud4040      |            |              |                  |                    |       | SpaceBud4040 - asset1zkug... (Subpart of txHash: 76c24dc40ab2...) | (SpaceBud4040)76c24dc40ab2... | [{"label":"721","json_metadata": "..."}] |                                        |

- Based on **Koinly Format** bellow, with the addition of the transaction **Metadata** field.
- **Sent & Received**
  - A transaction can both send and received at the same time.
  - Each record line contain a single asset type (Sent or Received currency type).
- **Description**
  - The **"Subpart of** notice along with transaction hash will be added if required.
- **TxHash**
  - The transaction hash will be prepended with the asset name if required. 

:::info
Transaction handling multiple different asset are split among multiple lines.
- The subpart of the transaction is identified as is in description field.
- Asset name is prepended to TxHash ID to make the record unique, which help to prevent duplicate
  when importing the same file multiple times.
:::

### Koinly Format

| Date (UTC)           | Sent Amount | Sent Currency | Received Amount | Received Currency | Fee Amount | Fee Currency | Net Worth Amount | Net Worth Currency | Label | Description                                                              | TxHash                        |
|----------------------|-------------|---------------|-----------------|-------------------|------------|--------------|------------------|--------------------|-------|--------------------------------------------------------------------------|-------------------------------|
| 2022-02-24 21:44:51Z |             |               | 1.5             | ADA               |            |              | 1.73             | USD                |       | MINTING/BURNING                                                          | 76c24dc40ab2...               |
|                      |             |               | 1               | NFT1              |            |              |                  |                    |       | NFT1 = SpaceBud4040 [asset1zkug...] (Subpart of txHash: 76c24dc40ab2...) | (SpaceBud4040)76c24dc40ab2... |

- Same to above **Default** format, except for the **Metadata** field and currency symbol.
- **Sent & Received Native Assets (token & NFT)**
  - Support for Cardano native assets is not completed yet on **Koinly**, the current official workaround is the use of placeholders.
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
Unfortunately it is impossible at the moment for Adastry to attribute a unique placeholder to each asset existing on Cardano.

Every user should review the import on Koinly and first try to replace the placeholder with the right supported asset (if available).

If the asset isn't supported yet, the user should keep a personal record of each different asset and assign them a unique placeholder.

This will help Koinly software to calculate the right profit/loss for unsupported NFTs and Tokens.

###### Example of a personal index record

| Name                      | Fingerprint   | Assigned Placeholder | Type  |
|---------------------------|---------------|----------------------|-------|
| Spacebudz4040             | asset1zkug... | NFT1                 | NFT   |
| [WMT] World Mobile Token  | asset1h7js... | NULL1                | TOKEN |
| Clay Nation #1214         | asset1jszw... | NFT2                 | NFT   |

:::
