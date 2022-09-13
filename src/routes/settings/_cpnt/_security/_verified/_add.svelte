<script lang="ts">
  import BackArrow from '$lib/components/icons/back-arrow.svelte';
  import { getContext } from 'svelte';
  import AccountList from './_list.svelte';
  import ActionBtn from '$lib/components/global/action-button.svelte';
  import NamiIcon from '$lib/components/icons/nami.svelte';
  import Modal from '$lib/components/global/modal.svelte';
  import { getAuthPayload } from '$lib/api/auth';
  import { verifyAddress } from '$lib/api/user';
  import { Buffer } from 'buffer';
  import type { ErrorModalBodyType } from '$lib/types/error-modal-body.type';
  import type { Writable } from 'svelte/store';
  import type { ViewType } from '$lib/types/view.type';
  import type { Cip0030Type, DataSignature, Web3Wallet } from '$lib/types/cip-0030.type';
  import type { MessagePayloadType } from '$lib/api/types/message-payload.type';

  // Routing
  let verifiedView = getContext<Writable<ViewType>>('verifiedView');

  // Verify address
  let wait = false;
  let successModal: typeof Modal;
  let errorModal: typeof Modal;
  let errorModalBody: ErrorModalBodyType;
  let internalErrorModal: typeof Modal;
  let connectorErrorModal: typeof Modal;
  let networkErrorModal: typeof Modal;

  async function verify(walletId: Web3Wallet): Promise<void> {
    wait = true;
    const signedMessage = await signMessage(walletId);

    if (!signedMessage) {
      wait = false;
      return;
    }

    // Verify User Address
    verifyAddress({ key: signedMessage.key, signature: signedMessage.signature })
      .then((res) => {
        if ([200, 201].includes(res.statusCode)) {
          successModal.open();
        } else {
          wait = false;
          if (res.statusCode && res.error) {
            errorModalBody = {
              statusCode: res.statusCode,
              message: res.message,
              error: res.error,
            };
          }
          errorModal.open();
        }
      })
      .catch(() => {
        wait = false;
        internalErrorModal.open();
      });
  }

  async function signMessage(walletId: Web3Wallet): Promise<DataSignature | null> {
    if (cardano && cardano[walletId]) {
      const connector = cardano[walletId];
      // Attempt to fetch connector API
      let wallet: Cip0030Type;
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

      // Attempt to fetch message payload
      let message: MessagePayloadType;
      try {
        message = await getAuthPayload(await wallet.getChangeAddress());
      } catch (e) {
        errorModalBody = {
          statusCode: 500,
          message: [
            'An error occurred while fetching auth message from API.',
            'Please try again or contact support.',
          ],
          error: 'API ERROR',
        };

        errorModal.open();
        return null;
      }

      let signed: DataSignature | null = null;

      try {
        signed = await wallet.signData(
          message.stakeAddress,
          Buffer.from(JSON.stringify(message)).toString('hex'),
        );
      } catch (e) {
        if (e.code && e.info) {
          switch (e.code) {
            case 3:
              return null;
            default:
              errorModalBody = {
                statusCode: e.code,
                message: [e.info],
                error: 'Verification Failed',
              };
          }

          errorModal.open();
        } else {
          connectorErrorModal.open();
        }

        return null;
      }

      return signed;
    } else {
      connectorErrorModal.open();
    }

    return null;
  }
</script>

<div class="card mb-5 mb-xl-10">
  <div class="card-header border-0">
    <div class="card-title">
      <h3 class="m-0">Verify an Account</h3>
    </div>
    <div class="card-toolbar">
      <!--begin::Menu-->
      <button
        on:click="{() => verifiedView.set({ component: AccountList, props: {} })}"
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

  <div class="card-body border-top p-9 text-center">
    <ActionBtn
      type="submit"
      text="Verify an account with Nami"
      action="{() => verify('nami')}"
      wait="{wait}"
      icon="{NamiIcon}"
      customClass="btn btn-info btn-lg mb-5 fw-bolder fs-5"
    />
  </div>
</div>

<Modal
  bind:this="{successModal}"
  hideClose="{true}"
  actionBtnText="Continue"
  callback="{() => verifiedView.set({ component: AccountList, props: {} })}"
>
  <svelte:fragment slot="title">Account verification successful!</svelte:fragment>
  <p slot="body" class="text-center">
    The account has been added to your list of verified accounts.
  </p>
</Modal>

<Modal
  bind:this="{errorModal}"
  hideAction="{true}"
  outClick="{true}"
  callback="{() => (errorModalBody = undefined)}"
>
  <svelte:fragment slot="title"
    ><span class="text-danger">Failed to verify account</span></svelte:fragment
  >
  <div slot="body" class="text-center modal-error-message" style="overflow-wrap: break-word">
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
      Account verification failed. Please try again or contact support.
    {/if}
  </div>
</Modal>

<Modal bind:this="{internalErrorModal}" hideAction="{true}">
  <svelte:fragment slot="title"><span class="text-danger">Server Error</span></svelte:fragment>
  <p slot="body" class="text-center">
    Oops, something unexpected happened. Please try again later or contact support.
  </p>
</Modal>

<Modal bind:this="{connectorErrorModal}" hideAction="{true}" callback="{() => (wait = false)}">
  <svelte:fragment slot="title"><span class="text-danger">Wallet API Error</span></svelte:fragment>
  <svelte:fragment slot="body">
    <p slot="body" class="text-center">Oops, something unexpected happened.</p>
    <div class="text-center">
      <ul class="d-inline-block" style="text-align: left">
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

<style lang="scss">
  .modal-error-message:first-letter {
    text-transform: capitalize;
  }
</style>
