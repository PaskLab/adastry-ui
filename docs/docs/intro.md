---
sidebar_position: 1
---

# Introduction

The purpose of Adastry's documentation is to give more in depth understanding of the provided services.

Common questions should be answered along the way. If something is missing or need further explanation,
please start a discussion on our
[Github Q&A page](https://github.com/PaskLab/adastry-ui/discussions/categories/q-a).

## What is Adastry

Adastry as started as a rewards tracking service.
The goal is to track user [stake account](/learn/docs/definitions#account) rewards history in a simple way.

Depending on the jurisdiction, rewards count as income at the moment they are received, and most wallet
software will show the rewards account balance without the payment history. This is where Adastry comes
into play by fetching and processing these data, with some sugar! 🍰

The service is set to grow with its user needs, so it is not limited to rewards tracking. Adastry already
pack other useful features, and we are counting on our users to share their needs with us.

## What Adastry is not

- __**__ A tax reporting tool. (ie: [Koinly](https://koinly.io/), [CoinTracker](https://www.cointracker.io/),
[accointing](https://www.accointing.com/))
- A blockchain explorer.
- A wallet client software.

__**__ While the main use case for using Adastry is tax reporting need, we only facilitate the acquisition and
processing of your data. We do not provide profit/loss calculation. Each country has its own tax requirements,
make sure to check with your local professional.

## Current limitation

### UTC Timezone only

Adastry currently only supports UTC timezone. This mean that exporting a specific year might not cover the exact
same range as your local time. Consider exporting end or start of adjacent year depending on you location.

*\*Support export range supporting local timezone is planned.*

### Spot price

Spot price is currently available only for rewards.

*\*Support for transaction spot price is planned.*

### Encoding

Adastry only support UTF-8 characters encoding.
