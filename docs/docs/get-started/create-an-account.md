---
sidebar_position: 1
---

# Create an account

A user account is required to access Adastry services. The account will allow you to link wallet accounts
and save preferences.

There are 2 ways to create a new user account: **Classic Form** or **Wallet Auth**.

## Classic Form

Classic Form is the usual username & password authentication. You can later 
**[verify your accounts](/learn/docs/get-started/verified-accounts)** to enable
**Wallet Auth** authentication.

Passwords must be 8 characters long, contain at least 1 upper case letter, 1 lower case letter, 1 number or
special character.

## Wallet Auth

Adastry features a secure authentication system using a generic message signature. The core concept is proving
ownership over a specific stake credential *(wallet account)* and linking it to your user account, so you can later
use it to authenticate yourself.

By choosing the **Wallet Auth** option, you will first be asked to prove ownership of a wallet account of your choice.

Then a new account will be generated with a random username & password. You can then change them in the app settings
by signing in with that same wallet account.

## Account recovery

Email password recovery is not implemented at the moment. Instead, we chose to go the **Web3** way and use the 
proof of ownership.

Once authenticated on the application, access the **"settings > security"** page and add one or more
[verified accounts](/learn/docs/get-started/verified-accounts). This way, if you ever lose your password, you'll
be able to sign in and set a new one.

