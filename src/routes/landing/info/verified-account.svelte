<script lang="ts">
  import { getContext } from 'svelte';
  import SignInForm from '../sign-in.svelte';
  import LeftIcon from '$lib/components/icons/left-arrow.svelte';
  import { darkMode } from '$lib/stores/session.store';
  import WalletSignup from '../sign-up-wallet.svelte';

  // Component Routing
  const mainView = getContext('mainView');
</script>

<div class="mb-8">
  <button
    type="button"
    on:click="{() => mainView.set(SignInForm)}"
    class="btn btn-sm btn-active-light-primary fw-bolder fs-6 {$darkMode
      ? 'btn-color-white'
      : 'btn-color-gray-700'} position-relative"
    style="right: 20px;"
  >
    <span class="svg-icon svg-icon-muted svg-icon-2hx">
      <LeftIcon />
    </span>
    Back to sign-in
  </button>
</div>

<div class="mb-10">
  <h1 class="text-dark mb-10 text-center">Using a verified account to sign in</h1>
  <h5 class="text-info">What are verified accounts ?</h5>
  <p>
    <strong>"Verified accounts"</strong> are accounts where you have proven ownership through a message
    signature verification process.
  </p>
  <h5 class="mt-5 text-info">How to sign in with wallet authentication ?</h5>
  <p>
    Adastry wallet authentication requires users to <strong>first</strong> link a verified account to
    their user account.
  </p>
  <p>
    This can be done either by creating a new user account using the <button
      type="button"
      class="btn btn-link fs-7 p-0 lh-0"
      on:click="{() => mainView.set(WalletSignup)}">ownership proof option</button
    >, or in an existing user account using the "Verified Accounts" feature available in
    <strong>Settings > Security</strong>.
  </p>
  <h5 class="mt-5 text-info">Security and wallet authentication</h5>
  <p>
    Wallet authentication is considered more secure than using a password. Your password, weaker
    than your wallet signature encryption, never leaves your computer.
  </p>
  <p>
    Message signing is safe. It is not a transaction, therefore has no cost. You encrypt, never
    decrypt.
  </p>
  <p>
    <strong>Tip:</strong> If you're a fast typer and do prefer password sign in, we strongly suggest
    verifying one or more accounts. This will give you a way to access your account if you lose your
    username or password.
  </p>
</div>
