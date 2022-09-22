<script lang="ts">
  import { Buffer } from 'buffer';
  import BackArrow from '$lib/components/icons/back-arrow.svelte';
  import ActionBtn from '$lib/components/global/action-button.svelte';
  import NamiIcon from '$lib/components/icons/nami.svelte';
  import YoroiIcon from '$lib/components/icons/yoroi.svelte';
  import PasswordForm from './_form.svelte';
  import { getContext } from 'svelte';
  import Modal from '$lib/components/global/modal.svelte';
  import { resetPasswordSignature } from '$lib/api/user';
  import { getAuthPayload } from '$lib/api/auth';
  import type { UpdateUserType } from '$lib/api/types/update-user.type';
  import type { Writable } from 'svelte/store';
  import type { ViewType } from '$lib/types/view.type';
  import type { ErrorModalBodyType } from '$lib/types/error-modal-body.type';
  import type { Cip0030Type, DataSignature, Web3Wallet } from '$lib/types/cip-0030.type';
  import type { MessagePayloadType } from '$lib/api/types/message-payload.type';

  // Routing
  let passwordView = getContext<Writable<ViewType>>('passwordView');

  // Modals
  let successModal: typeof Modal;
  let errorModal: typeof Modal;
  let errorModalBody: ErrorModalBodyType;
  let internalErrorModal: typeof Modal;
  let connectorErrorModal: typeof Modal;
  let networkErrorModal: typeof Modal;

  // Save profile handler ** Forwarding Ref Only **
  export let saveProfile: (
    updateObj: UpdateUserType,
    validatedFields: boolean[],
    waitHandler: (enable: boolean) => void,
  ) => void;

  // Wallet Buttons
  let wait = false;
  let newPassword = '';

  async function resetPassword(walletId: Web3Wallet): Promise<void> {
    wait = true;
    const signedMessage = await signMessage(walletId);

    if (!signedMessage) {
      wait = false;
      return;
    }

    // Reset user password
    resetPasswordSignature({ key: signedMessage.key, signature: signedMessage.signature })
      .then((res) => {
        if ([200, 201].includes(res.statusCode)) {
          newPassword = res.message;
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
      <h3 class="m-0">Reset Password</h3>
    </div>
    <div class="card-toolbar">
      <!--begin::Menu-->
      <button
        on:click="{() =>
          passwordView.set({ component: PasswordForm, props: { saveProfile: saveProfile } })}"
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

  <div class="card-body border-top px-10 py-20 text-center">
    <p>
      <ActionBtn
        type="button"
        text="Reset password with Nami"
        action="{() => resetPassword('nami')}"
        wait="{wait}"
        icon="{NamiIcon}"
        customClass="btn btn-info btn-lg mb-5 fw-bolder fs-5"
      />
    </p>
    <p>
      <ActionBtn
        type="button"
        text="Reset password with Yoroi"
        action="{() => resetPassword('yoroi')}"
        wait="{wait}"
        icon="{YoroiIcon}"
        customClass="btn btn-info btn-lg mb-5 fw-bolder fs-5"
      />
    </p>
  </div>
</div>

<Modal
  bind:this="{successModal}"
  hideClose="{true}"
  actionBtnText="Continue"
  callback="{() =>
    passwordView.set({ component: PasswordForm, props: { saveProfile: saveProfile } })}"
>
  <svelte:fragment slot="title">Account verification successful!</svelte:fragment>
  <svelte:fragment slot="body">
    <p class="text-center">The account password has been set to:</p>
    <p class="text-center p-15">
      <strong class="text-warning">{newPassword}</strong>
    </p>
    <p class="text-center">Make sure to write it down, or change it right away.</p>
  </svelte:fragment>
</Modal>

<Modal
  bind:this="{errorModal}"
  hideAction="{true}"
  outClick="{true}"
  callback="{() => (errorModalBody = undefined)}"
>
  <svelte:fragment slot="title"
    ><span class="text-danger">Failed to reset password</span></svelte:fragment
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
      Reset password failed. Please try again or contact support.
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
