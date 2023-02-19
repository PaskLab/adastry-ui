<script lang="ts">
  import config from '$lib/config.json';
  import BackArrow from '$lib/components/icons/back-arrow.svelte';
  import NamiIcon from '$lib/components/icons/nami.svelte';
  import YoroiIcon from '$lib/components/icons/yoroi.svelte';
  import EternlIcon from '$lib/components/icons/eternl.svelte';
  import ActionBtn from '$lib/components/global/action-button.svelte';
  import Modal from '$lib/components/global/modal.svelte';
  import { getContext } from 'svelte';
  import CartList from './list.svelte';
  import Payment from './payment';
  import { createInvoice, getAccountsState, getInvoiceList } from '$lib/api/billing';
  import { getUserPools } from '$lib/api/wallets';
  import type { Writable } from 'svelte/store';
  import type { ViewType } from '$lib/types/view.type';
  import type { Web3Wallet } from '$lib/types/cip-0030.type';
  import type { ErrorModalBodyType } from '$lib/types/error-modal-body.type';
  import type { WalletApi } from 'lucid-cardano';
  import type { AccountListType } from '$lib/api/types/account-list.type';
  import type { PoolType } from '$lib/api/types/pool.type';
  import type { NewInvoiceType } from '$lib/api/types/new-invoice.type';
  import type { UserPoolListType } from '$lib/api/types/user-pool-list.type';
  import type { AccountStateType } from '$lib/api/types/account-state.type';
  import type { InvoiceListType } from '$lib/api/types/invoice.type';

  // Routing
  let mainView = getContext<Writable<ViewType>>('mainView');

  // Context
  const accountsState = getContext<Writable<Promise<AccountStateType[]>>>('accountsState');
  const userPools = getContext<Writable<Promise<UserPoolListType>>>('userPools');
  const invoices = getContext<Writable<Promise<InvoiceListType>>>('invoices');
  const selectedAccounts = getContext<Writable<AccountListType>>('selectedAccounts');
  const selectedPools = getContext<Writable<PoolType[]>>('selectedPools');

  // Modals
  let errorModalBody: ErrorModalBodyType;
  let errorModal: typeof Modal;
  let connectorErrorModal: typeof Modal;
  let networkErrorModal: typeof Modal;
  let submitErrorModal: typeof Modal;
  let fundsErrorModal: typeof Modal;
  let successModal: typeof Modal;
  let successTxHash = '';

  // Initialize
  let wait = false;

  async function pay(walletId: Web3Wallet) {
    console.log('clicked!');
    wait = true;
    if (cardano && cardano[walletId]) {
      const connector = cardano[walletId];
      // Attempt to fetch connector API
      let wallet: WalletApi;
      try {
        wallet = await connector.enable();
      } catch (e) {
        connectorErrorModal.open();
        return null;
      }

      if ((await wallet.getNetworkId()) !== 1) {
        networkErrorModal.open();
        return null;
      }

      // Handle payment
      const lovelace = BigInt(
        config.billing.accountUnitPrice * $selectedAccounts.length +
          config.billing.poolUnitPrice * $selectedPools.length,
      );

      const payment = new Payment(wallet);

      // Make payment
      payment
        .newPayment(
          $selectedAccounts.map((a) => a.stakeAddress),
          $selectedPools.map((p) => p.poolId),
          lovelace,
        )
        .then((invoiceBody: NewInvoiceType) => {
          // Submit new invoice
          createInvoice(invoiceBody)
            .then(() => {
              payment
                .submit()
                .then((txHash) => {
                  const fallbackHash = payment.getTxHash() ?? '';
                  successTxHash = txHash ? txHash : fallbackHash;
                  handleSuccess();
                })
                .catch((e) => {
                  submitErrorModal.open();
                });
            })
            .catch((e) => {
              console.error(e);
              errorModal.open();
            });
        })
        .catch((e) => {
          if (e.code && e.info) {
            errorModalBody = {
              statusCode: e.code,
              message: [e.info],
              error: 'Payment Failed',
            };
            errorModal.open();
          } else if (e === 'InputsExhaustedError') {
            fundsErrorModal.open();
          } else {
            console.error(e);
            connectorErrorModal.open();
          }
        });
    } else {
      connectorErrorModal.open();
    }
  }

  function handleSuccess() {
    accountsState.set(getAccountsState());
    userPools.set(getUserPools());
    invoices.set(getInvoiceList());
    selectedAccounts.set([]);
    selectedPools.set([]);
    successModal.open();
  }
</script>

<div class="card card-bordered mb-xl-8">
  <div class="card-header">
    <h3 class="card-title align-items-start flex-column">
      <span class="card-label fw-bolder fs-3 mb-1">Choose your wallet</span>
    </h3>
    <div class="card-toolbar">
      <button
        on:click="{() => mainView.set({ component: CartList, props: {} })}"
        type="button"
        class="btn btn-sm btn-color-gray-700 btn-color-primary btn-active-light-primary"
      >
        <span class="svg-icon svg-icon-2 position-relative" style="top: -1px;">
          <BackArrow />
        </span>
        Back
      </button>
    </div>
  </div>

  <div
    class="card-body py-10 text-center d-flex flex-column flex-sm-row align-items-center justify-content-sm-center"
  >
    <ActionBtn
      type="button"
      icon="{NamiIcon}"
      text="Nami"
      action="{() => pay('nami')}"
      wait="{wait}"
      customClass="btn btn-primary btn-primary flex-row-fluid min-w-200px min-w-sm-100px mw-250px m-2"
    />
    <ActionBtn
      type="button"
      icon="{EternlIcon}"
      text="Eternl"
      action="{() => pay('eternl')}"
      wait="{wait}"
      customClass="btn btn-primary btn-primary flex-row-fluid min-w-200px min-w-sm-100px mw-250px m-2"
    />
    <ActionBtn
      type="button"
      icon="{YoroiIcon}"
      text="Yoroi"
      action="{() => pay('yoroi')}"
      wait="{wait}"
      customClass="btn btn-primary btn-primary flex-row-fluid min-w-200px min-w-sm-100px mw-250px m-2"
    />
  </div>
</div>

<Modal
  bind:this="{errorModal}"
  hideAction="{true}"
  callback="{() => {
    errorModalBody = undefined;
    wait = false;
  }}"
>
  <svelte:fragment slot="title"
    ><span class="text-danger">{errorModalBody ? errorModalBody.error : 'Server Error'}</span
    ></svelte:fragment
  >
  <p slot="body" class="text-center">
    {#if errorModalBody}
      {#if typeof errorModalBody.message !== 'string' && errorModalBody.message.length}
        {#each errorModalBody.message as message}
          <p>{message}</p>
        {/each}
      {:else}
        {errorModalBody.message}
      {/if}
      {#if errorModalBody.statusCode && errorModalBody.error}
        <p class="mt-5 text-muted mb-0">
          <em>Code: {errorModalBody.statusCode} - {errorModalBody.error}</em>
        </p>
      {/if}
    {:else}
      Oops, something unexpected happened. Please try again later or contact support.
    {/if}
  </p>
</Modal>

<Modal bind:this="{connectorErrorModal}" hideAction="{true}" callback="{() => (wait = false)}">
  <svelte:fragment slot="title"><span class="text-danger">Wallet API Error</span></svelte:fragment>
  <svelte:fragment slot="body">
    <p slot="body" class="text-center">Oops, something unexpected happened.</p>
    <div class="text-center">
      <ul class="d-inline-block" style="text-align: left">
        <li>Make sure the selected account have enough funds.</li>
        <li>Check if Nami Wallet extension is enabled.</li>
        <li>Make sure this website is whitelisted in Nami.</li>
      </ul>
    </div>
  </svelte:fragment>
</Modal>

<Modal bind:this="{networkErrorModal}" hideAction="{true}" callback="{() => (wait = false)}">
  <svelte:fragment slot="title"><span class="text-danger">Wrong Network</span></svelte:fragment>
  <svelte:fragment slot="body">
    <p slot="body" class="text-center">
      Only <strong>Mainnet</strong> is supported, make sure to set your wallet to the right network.
    </p>
  </svelte:fragment>
</Modal>

<Modal bind:this="{submitErrorModal}" hideAction="{true}" callback="{() => (wait = false)}">
  <svelte:fragment slot="title"
    ><span class="text-danger">TX submission failed</span></svelte:fragment
  >
  <svelte:fragment slot="body">
    <p slot="body" class="text-center">
      The payment has not been sent, an error occurred while submitting.
    </p>
  </svelte:fragment>
</Modal>

<Modal bind:this="{fundsErrorModal}" hideAction="{true}" callback="{() => (wait = false)}">
  <svelte:fragment slot="title"><span class="text-danger">Not enough funds</span></svelte:fragment>
  <svelte:fragment slot="body">
    <p slot="body" class="text-center">Make sure the selected account have enough funds.</p>
  </svelte:fragment>
</Modal>

<Modal
  bind:this="{successModal}"
  hideClose="{true}"
  actionBtnText="Continue"
  callback="{() => mainView.set({ component: CartList, props: {} })}"
>
  <svelte:fragment slot="title">Transaction sent!</svelte:fragment>
  <svelte:fragment slot="body">
    <p class="text-center fw-bolder">
      Your payment has been sent,<br />transaction hash:
    </p>
    <p class="text-center fs-6 text-wrap text-break">{successTxHash}</p>
    <p class="text-center fw-bolder">Waiting for confirmation...</p>
  </svelte:fragment>
</Modal>
