<script lang="ts">
  import { z } from 'zod';
  import { getContext } from 'svelte';
  import SignInForm from './_sign-in.svelte';
  import SubmitBtn from '$lib/components/global/action-button.svelte';
  import LeftIcon from '$lib/components/icons/left-arrow.svelte';
  import Checkbox from '$lib/components/form/checkbox.svelte';
  import Modal from '$lib/components/global/modal.svelte';
  import { createSignature } from '$lib/api/user';
  import { darkMode } from '$lib/stores/session.store';
  import type { Cip0030Type, DataSignature } from '$lib/types/cip-0030.type';
  import { Buffer } from 'buffer';
  import type { MessagePayloadType } from '$lib/api/types/message-payload.type';
  import { getAuthPayload } from '../../lib/api/auth';
  import type { ErrorModalBodyType } from '../../lib/types/error-modal-body.type';

  // Component Routing
  const mainView = getContext('mainView');
  function displaySignInForm(): void {
    mainView.set(SignInForm);
  }

  // Form
  let acceptTermsField: typeof Checkbox;

  // Modals
  let wait = false;
  let successMessage = 'Account successfully created.';
  let successModal: typeof Modal;
  let errorModal: typeof Modal;
  let errorModalBody: ErrorModalBodyType;
  let internalErrorModal: typeof Modal;
  let connectorErrorModal: typeof Modal;
  let networkErrorModal: typeof Modal;

  async function submit(): Promise<void> {
    const fields = [acceptTermsField.validate()];
    if (fields.every((field) => field)) {
      // Sign message
      wait = true;
      const signedMessage = await signMessage();

      if (!signedMessage) {
        wait = false;
        return;
      }

      // Create user from signature
      createSignature(signedMessage.key, signedMessage.signature)
        .then((res) => {
          if ([200, 201].includes(res.statusCode)) {
            successMessage = res.message;
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
  }

  async function signMessage(): Promise<DataSignature | null> {
    if (cardano?.nami) {
      // Attempt to fetch connector API
      let wallet: Cip0030Type;
      try {
        wallet = await cardano.nami.enable();
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
        connectorErrorModal.open();
        return null;
      }

      return signed;
    } else {
      connectorErrorModal.open();
    }

    return null;
  }
</script>

<div class="mb-8">
  <button
    type="button"
    on:click="{displaySignInForm}"
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

<form class="form w-100" novalidate="novalidate">
  <div class="mb-10 text-center">
    <h1 class="text-dark mb-3">Create an Account</h1>
  </div>
  <div class="fv-row mb-10">
    <Checkbox
      bind:this="{acceptTermsField}"
      schema="{z.literal(true, {
        invalid_type_error: 'You need to accept the Terms & Conditions',
        required_error: 'Required',
      })}"
    >
      <span
        class="form-check-label fw-bold {$darkMode ? 'btn-color-white' : 'btn-color-gray-700'} fs-6"
      >
        I Agree to the
        <a href="/terms-and-conditions" target="_blank" class="ms-1 link-primary"
          >Terms and conditions</a
        >.
      </span>
    </Checkbox>
  </div>

  <div class="text-center">
    <SubmitBtn
      type="submit"
      text="Create an account with Nami"
      action="{submit}"
      wait="{wait}"
      customClass="btn btn-primary btn-lg btn-primary w-100 mb-5"
    />
  </div>
</form>

<Modal
  bind:this="{successModal}"
  hideClose="{true}"
  actionBtnText="Continue"
  callback="{() => (location.href = '/')}"
>
  <svelte:fragment slot="title">Account successfully created!</svelte:fragment>
  <p slot="body" class="text-center">
    {successMessage}
    <br />
    You will be redirected to the login screen.
  </p>
</Modal>

<Modal bind:this="{errorModal}" hideAction="{true}" outClick="{true}">
  <svelte:fragment slot="title"
    ><span class="text-danger">Failed to create account</span></svelte:fragment
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
      Account creation failed. Please try again or contact support.
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
