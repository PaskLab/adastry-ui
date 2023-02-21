---
sidebar_position: 2
---

# Rewards CSV

Rewards history is one of the data category you can actually export on Adastry.

The rewards will be exported on a per-Epoch basis along with its net worth based on your preferred currency
and the epoch ADA spot price.

## Filter Options

You can filter by **Year** and **Period** (Q1, Q2, Q3, Q4 or Full year).

You can customize the **Fiscal Year Start Month** to match your company or local legislation needs.
The **Period** will adapt to the chosen start month.

## Format Options

Each available **.csv** format options are described bellow along with supplementary details where needed.

### Default Format

| Date (UTC)           | Epoch | Rewards  | MIR | Net Worth Amount  | Net Worth Currency | Active Stake  | Withdrawable  | Withdrawn | Description               |
|----------------------|-------|----------|-----|-------------------|--------------------|---------------|---------------|-----------|---------------------------|
| 2022-02-24 21:44:51Z | 323   | 0.051446 | 0   | 0.06              | USD                | 98.824643     | 0.051446      | 0         | Epoch 323 for stake1u9... |

- **Rewards**
  - Rewards received during the epoch, excluding MIR.

- **Net Worth Amount**
  - Net Worth Amount is given by the ADA price at the *epoch* beginning multiplied by the total amount of rewards (Rewards + MIR).

### Koinly Format

| Date (UTC)           | Sent Amount | Sent Currency | Received Amount | Received Currency | Fee Amount | Fee Currency | Net Worth Amount | Net Worth Currency | Label  | Description               | TxHash     |
|----------------------|-------------|---------------|-----------------|-------------------|------------|--------------|------------------|--------------------|--------|---------------------------|------------|
| 2022-02-24 21:44:51Z |             |               | 14.619278       | ADA               |            |              | 19.73            | USD                | reward | Epoch 319 for stake1u9... | c42c02a... |

- **Label**
  - The **reward** label is used to properly identify the transaction on Koinly. Rewards could be treated as income depending on your settings.

- **TxHash**
  - The transaction hash is also used as an ID on Koinly. It will prevent duplicate when importing the same file multiple times.

### SPO Format

| Date (UTC)           | Epoch | Rewards    | MIR | Net Worth Amount | Net Worth Currency | Active Stake | Account Balance | Stake Rewards | Op Rewards | Withdrawable | Withdrawn | Description               |
|----------------------|-------|------------|-----|------------------|--------------------|--------------|-----------------|---------------|------------|--------------|-----------|---------------------------|
| 2023-01-05 21:44:51Z | 386   | 548.349132 | 0   | 167.57           | USD                | 20739.034394 | 20521.586431    | 183.981623    | 364.367509 | 0            | 0         | Epoch 386 for stake1u9... |

- **Rewards**
  - Total rewards received during the epoch. Includes both stake rewards and operation fee.
  - The rewards are displayed even if sent to a separate rewards account. See [Shared Pool](/learn/docs/services/shared-pool).
  - If the pool is shared among multiple owners, or the rewards account differ from the pledge account, the Multi-owner format is preferred.
- **Account Balance**
  - The account balance is calculated to determine the right stake share of an account. See [Shared Pool](/learn/docs/services/shared-pool).
- **Stake Rewards**
  - Share of the received rewards related to the **Active Stake** of the account.
- **Op Rewards**
  - Share of the operation fees. Operation fees are split equally among owners accounts.

### Multi-Owner SPO Format

| Date (UTC)           | Epoch | Rewards    | MIR | Net Worth Amount | Net Worth Currency | Active Stake | Account Balance | Real Rewards | Stake Rewards | Op Rewards | Stake Share        | Withdrawable | Withdrawn | Description               |
|----------------------|-------|------------|-----|------------------|--------------------|--------------|-----------------|--------------|---------------|------------|--------------------|--------------|-----------|---------------------------|
| 2023-01-05 21:44:51Z | 386   | 548.349132 | 0   | 167.57           | USD                | 20739.034394 | 20521.586431    | 0            | 183.981623    | 364.367509 | 0.6996442172906921 | 0            | 0         | Epoch 386 for stake1u9... |

- Same as **SPO Format**, with 2 more fields.
- **Real Rewards**
  - Real amount received by the account when rewards are sent to a separate rewards account. See [Shared Pool](/learn/docs/services/shared-pool).
- **Stake Share**
  - Represents the weight of the account active stake on the total amount of owners accounts stake. Determines the share of the rewards, excluding the fees. See [Shared Pool](/learn/docs/services/shared-pool).

### As transaction Format

| Date (UTC)           | Sent Amount | Sent Currency | Received Amount | Received Currency | Fee Amount | Fee Currency | Net Worth Amount | Net Worth Currency | Label  | Description               | TxHash     | Metadata |
|----------------------|-------------|---------------|-----------------|-------------------|------------|--------------|------------------|--------------------|--------|---------------------------|------------|----------|
| 2022-02-24 21:44:51Z |             |               | 14.619278       | ADA               |            |              | 19.73            | USD                | reward | Epoch 319 for stake1u9... | c42c02a... |          |

- Based on **Koinly Format** with the addition of the transaction **Metadata**.
- This *rewards history* format is available for standardization with *transactions history* format only.
