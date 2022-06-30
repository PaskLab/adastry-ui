<script lang="ts">
  import { onMount } from 'svelte';
  import { z } from 'zod';
  import TextInput from '$lib/components/form/text-input.svelte';
  import PasswordInput from '$lib/components/form/password-input.svelte';
  import SubmitBtn from '$lib/components/global/action-button.svelte';
  import Modal from '$lib/components/global/modal.svelte';
  import { jwt, isTokenValid, darkMode, isSessionExpired } from '$lib/stores/session.store';
  import { getAuthPayload, login, loginSignature } from '$lib/api/auth';
  import { getContext } from 'svelte';
  import SignUpForm from './_sign-up.svelte';
  import NamiIcon from '$lib/components/icons/nami.svelte';
  import { Buffer } from 'buffer';
  import type { Cip0030Type, DataSignature } from '$lib/types/cip-0030.type';
  import type { MessagePayloadType } from '$lib/api/types/message-payload.type';
  import type { ErrorModalBodyType } from '$lib/types/error-modal-body.type';

  // Component Routing
  const mainView = getContext('mainView');
  function displaySignUpForm(): void {
    mainView.set(SignUpForm);
  }

  // Form
  let usernameField: typeof TextInput;
  let passwordField: typeof PasswordInput;
  let username = '';
  let password = '';
  let wait = false;

  // Modals
  let errorModalBody: ErrorModalBodyType;
  let errorModal: typeof Modal;
  let credentialModal: typeof Modal;
  let expiredModal: typeof Modal;
  let connectorErrorModal: typeof Modal;

  function submit(): void {
    const fields = [usernameField.validate(), passwordField.validate()];
    if (fields.every((field) => field)) {
      wait = true;
      login(username.trim(), password.trim())
        .then((res) => {
          if ([200, 201].includes(res.statusCode)) {
            jwt.set(res.token);
            isTokenValid.set(true);
            location.href = '/dashboard';
          } else {
            credentialModal.open();
            wait = false;
          }
        })
        .catch(() => {
          wait = false;
          errorModal.open();
        });
    }
  }

  async function loginNami(): Promise<void> {
    // Sign message
    wait = true;
    const signedMessage = await signMessage();

    if (!signedMessage) {
      wait = false;
      return;
    }

    // Login with signature
    loginSignature(signedMessage.key, signedMessage.signature)
      .then((res) => {
        if ([200, 201].includes(res.statusCode)) {
          jwt.set(res.token);
          isTokenValid.set(true);
          location.href = '/dashboard';
        } else {
          credentialModal.open();
          wait = false;
        }
      })
      .catch(() => {
        wait = false;
        errorModal.open();
      });
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
        return null;
      }

      return signed;
    } else {
      connectorErrorModal.open();
    }

    return null;
  }

  onMount(() => {
    if ($isSessionExpired) {
      expiredModal.open();
      isSessionExpired.set(false);
    }
  });
</script>

<div class="text-center mb-10">
  <h1 class="text-dark mb-3">Sign In</h1>
  <div class="{$darkMode ? 'text-white' : 'text-gray-400'} fw-bold fs-4">
    New Here?
    <button
      type="button"
      on:click|preventDefault="{displaySignUpForm}"
      class="btn btn-sm btn-color-primary fw-bolder fs-4 mb-1 mt-1 btn-active-light-primary px-2"
    >
      Create an Account
    </button>
  </div>
</div>

<form class="form w-100" novalidate="novalidate" id="sign-in-form">
  <div class="fv-row mb-10">
    <TextInput
      bind:this="{usernameField}"
      name="username"
      bind:value="{username}"
      schema="{z.string().nonempty()}"
      customClass="form-control-lg form-control-solid"
    />
  </div>
  <div class="fv-row mb-10">
    <PasswordInput
      bind:this="{passwordField}"
      name="password"
      bind:value="{password}"
      schema="{z.string().min(8)}"
      customClass="form-control-lg form-control-solid"
    />
  </div>

  <div class="text-center">
    <SubmitBtn
      type="submit"
      text="Continue"
      action="{submit}"
      wait="{wait}"
      customClass="btn btn-primary btn-lg w-100 mb-5"
    />
  </div>
  <div class="text-center text-muted text-uppercase fw-bolder mb-5">or</div>
  <div class="text-center">
    <SubmitBtn
      type="button"
      text="Sign In with Nami"
      icon="{NamiIcon}"
      action="{loginNami}"
      wait="{wait}"
      customClass="btn btn-info btn-lg w-100 mb-5 fw-bolder fs-5"
    />
  </div>
</form>

<Modal bind:this="{errorModal}" hideAction="{true}">
  <svelte:fragment slot="title">Server Error</svelte:fragment>
  <p slot="body" class="text-center">
    Oops, something unexpected happened. Please try again later or contact support.
  </p>
</Modal>

<Modal bind:this="{credentialModal}" hideAction="{true}" outClick="{true}">
  <svelte:fragment slot="title">Invalid username or password</svelte:fragment>
  <p slot="body" class="text-center">Please verify your authentication credentials.</p>
</Modal>

<Modal bind:this="{expiredModal}" hideAction="{true}">
  <svelte:fragment slot="title">Session Expired</svelte:fragment>
  <p slot="body" class="text-center">The session has expired, please sign-in again.</p>
</Modal>

<Modal bind:this="{connectorErrorModal}" hideAction="{true}" callback="{() => (wait = false)}">
  <svelte:fragment slot="title">Wallet API Error</svelte:fragment>
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
