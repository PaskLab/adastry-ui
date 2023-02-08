---
sidebar_position: 5
---

# Technical definitions

Definitions and precision on terms used in the current documentation and our application.

### User Account

A user account is required to use Adastry services. The user account is used secure and save
user's preferences, linked wallet accounts, subscriptions, etc.

### Account

An account refer to a specific stake credential, represented by a stake address.
ie: `stake1unp90je32nhdk4upchhyzhmtq5u0ldtv6ps0nq4ejh4nrgnc0ka7s` 

A stake account need to be first registered on the chain, then delegated to participate
in the POS consensus, thus claiming rewards.

Many payment addresses can be linked to a single stake account.

Adastry use the stake accounts as the root for fetching user data.

### Address

Cardano support different kind of addresses. The most common address contain both a payment
credential and a stake credential. The stake credential establish the link between a stake account
and a specific address.

### Spot price

The spot price represent the value of ADA based on another currency at a given time.

### MIR

MIR stand for **"Move Instantaneous Rewards"**. These are special rewards moved from the treasury or reserve.
They are sent for different reason, ie: Catalyst voting rewards.

### Shared Pool

Multiple owners account can be registered on a *Pool registration certificate*, but only a single rewards account
can be assigned. All stake rewards and operation fees will be sent to this account. Pool with multiple owners
accounts are considered **Shared Pool** on Adastry, as well as pools where the rewards account differ from the one
of the owner.

