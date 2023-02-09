---
sidebar_position: 3
---

# Shared Pool

:::info
The following document applies to **stake pool operators only**.
:::

Multiple owners account can be registered on a *Pool registration certificate*, but only a single rewards account
can be assigned. All stake rewards and operation fees will be sent to this account. Pool with multiple owners
accounts are considered **Shared Pool** on Adastry, as well as pools where the rewards account differ from the one
of the owner.

This protocole behavior can make accounting complicated in certain situation. Let consider a pool with 2 owners.
One of the owners account is set as the rewards account. Therefore, all rewards will fall into this account,
raising the active stake of the account, epoch after epoch. If both owners have an equal amount in their respective
account and never touch it, the maths are rather simple. But in other situations, it might require more advanced 
calculations and tracking.

## Definitions related to shared pool

### Balance

**Balance** refers to the portion of the active stake at the beginning of an epoch,
excluding the rewards available for withdraw. This value is calculated for every epoch.

:::info
The **calculated balance** can only be viewed on the rewards history 
[Multi-Owner SPO CSV Format](/learn/docs/export/rewards-csv#multi-owner-spo-format)
:::

### Stake Share

**Stake Share** refers to the active stake share of an owner account over the total active stake held by 
accounts registered on the pool certificate.

:::info
Note that it is the **calculated balance** that is used as **active stake** in the calculation.
:::

## Multi-Owner Calculation

Adastry solves this issue by calculating the right share of each owner, epoch after epoch.

To determine the right share percentage of each account, we must first calculate the balance held by each account
at the beginning of every epoch, excluding the withdrawable rewards amount. Received rewards will have no impact
on the share calculation until withdrawn. Withdrawn rewards must be sent immediately to the right account to prevent
it from affecting the wrong account.

:::caution
Rewards must be withdrawn and added to the account balance to affect the stake share value.

###### Example

If an account is used for voting, the MIR amount received will be excluded from the balance calculation until withdrawn.
:::

## Rewards and Fees split

Rewards will be displayed accordingly with the stake share of an account, regardless to which account they are sent.
Operation fees will be split equally between all owners accounts regardless of their stake share.

If pools owners have a different arrangement regarding pool fees, the **stake share** can be used to recalculate
the fees share.
