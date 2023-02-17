---
sidebar_position: 5
---

# Technical definitions

Definitions and precision on terms used in the current documentation and our application.

### User Account

A user account is required to use Adastry services. The user account is used to secure and saves
user's preferences, linked wallet accounts, subscriptions, etc.

### Account

An account refers to a specific stake credential, represented by a stake address.
ie: `stake1unp90je32nhdk4upchhyzhmtq5u0ldtv6ps0nq4ejh4nrgnc0ka7s` 

A stake account needs to be first registered on the chain, then delegated to participate
in the POS consensus, thus claiming rewards.

Many payment addresses can be linked to a single stake account.

Adastry uses the stake accounts as the root for fetching user data.

### Address

Cardano supports different kinds of addresses. The most common address contains both a payment
credential and a stake credential. The stake credential establishes the link between a stake account
and a specific address.

### Spot price

The spot price represents the value of ADA based on another currency at a given time.

### MIR

MIR stands for **"Move Instantaneous Rewards"**. These are special rewards moved from the treasury or reserve.
They are sent for multiple reasons, ie: Catalyst voting rewards.

### Shared Pool

Multiple owners accounts can be registered on a *Pool registration certificate*, but only a single rewards account
can be assigned. All stake rewards and operation fees will be sent to this account. Pool with multiple owners
accounts are considered **Shared Pool** on Adastry, as well as pools where the rewards account differ from the owner's.

### Mapping Placeholder / ID

A mapping placeholder or ID is a unique identifier that will be used instead of the asset symbole on another platform
to bring support when the asset is not recognized. The ID/placeholder can be official or attributed by the user.
