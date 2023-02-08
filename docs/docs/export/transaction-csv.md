---
sidebar_position: 3
---

# Transaction History

### Koinly Format

| Date (UTC)           | Sent Amount | Sent Currency | Received Amount  | Received Currency | Fee Amount | Fee Currency | Net Worth Amount | Net Worth Currency | Label | Description                                                             | TxHash                        |
|----------------------|-------------|---------------|------------------|-------------------|------------|--------------|------------------|--------------------|-------|-------------------------------------------------------------------------|-------------------------------|
| 2022-02-24 21:44:51Z |             |               | 1.5              | ADA               |            |              | 19.73            | USD                |       | MINTING/BURNING                                                         | 0db4c895a900...               |
|                      |             |               | 1                | NFT1              |            |              |                  |                    |       | NFT1 = SpaceBud314 [asset1j025...] (Subpart of txHash: 0db4c895a900...) | (SpaceBud314)0db4c895a900...  |

- **Sent & Received**
    - A transaction can both send and received at the same time.
    - Each record line contain a single asset type (currency).
    - Transaction handling multiple different asset are split among multiple line. See **Subpart of** in description field.
