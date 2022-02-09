<script lang="ts">
  import { z, ZodLiteral } from 'zod';
  import { getContext } from 'svelte';
  import SignInForm from './_sign-in.svelte';
  import TextInput from '$lib/components/form/text-input.svelte';
  import CreatePasswordInput from '$lib/components/form/create-password.svelte';
  import PasswordInput from '$lib/components/form/password-input.svelte';
  import LeftIcon from '$lib/components/icons/left-arrow.svelte';
  import Checkbox from '$lib/components/form/checkbox.svelte';
  import Modal from '$lib/components/global/modal.svelte';
  import { create } from '$lib/auth/auth';

  // Component Routing
  const selectedForm = getContext('selectedForm');
  function displaySignInForm(): void {
    selectedForm.set(SignInForm);
  }

  // Form
  let usernameField: typeof TextInput;
  let username: string;
  let nameField: typeof TextInput;
  let name = '';
  let passwordField: typeof CreatePasswordInput;
  let password = '';
  let confirmPasswordField: typeof PasswordInput;
  let confirmPassword: string;
  let acceptTermsField: typeof Checkbox;
  let confirmSchema: ZodLiteral<string>;

  $: confirmSchema = z.literal(password, {
    invalid_type_error: "Passwords don't match",
    required_error: 'Required'
  });

  let wait = false;
  let successModal: typeof Modal;
  let errorModal: typeof Modal;
  let errorModalBody: { statusCode: number; message: string; error: string };
  let internalErrorModal: typeof Modal;

  function submit(): void {
    const fields = [
      usernameField.validate(),
      nameField.validate(),
      passwordField.validate(),
      confirmPasswordField.validate(),
      acceptTermsField.validate()
    ];
    if (fields.every((field) => field)) {
      wait = true;
      create(username, password, name)
        .then((res) => {
          console.log(res);
          if (res.statusCode === 200 || res.statusCode === 201) {
            successModal.open();
          } else {
            wait = false;
            if (res.statusCode && res.error) {
              errorModalBody = {
                statusCode: res.statusCode,
                message: res.message,
                error: res.error
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
</script>

<div class="mb-8">
  <button
    on:click="{displaySignInForm}"
    class="btn btn-sm btn-active-light-primary fw-bolder fs-6 btn-color-gray-700 position-relative"
    style="right: 20px;"
  >
    <span class="svg-icon svg-icon-muted svg-icon-2hx">
      <LeftIcon />
    </span>
    Back to sign-in
  </button>
</div>

<form class="form w-100" novalidate="novalidate" id="kt_sign_up_form">
  <div class="mb-10 text-center">
    <h1 class="text-dark mb-3">Create an Account</h1>
  </div>

  <div class="row fv-row mb-7">
    <div class="col-xl-6">
      <TextInput
        bind:this="{usernameField}"
        name="username"
        bind:value="{username}"
        schema="{z.string().nonempty()}"
      />
    </div>
    <div class="col-xl-6">
      <TextInput
        bind:this="{nameField}"
        name="name"
        placeholder="*Optional*"
        bind:value="{name}"
        schema="{z.string().optional()}"
      />
    </div>
  </div>
  <div class="fv-row mb-5">
    <CreatePasswordInput bind:this="{passwordField}" name="password" bind:value="{password}" />
  </div>
  <div class="fv-row mb-5">
    <PasswordInput
      bind:this="{confirmPasswordField}"
      name="confirm-password"
      label="Confirm Password"
      bind:value="{confirmPassword}"
      schema="{confirmSchema}"
    />
  </div>
  <div class="fv-row mb-10">
    <Checkbox
      bind:this="{acceptTermsField}"
      schema="{z.literal(true, {
        invalid_type_error: 'You need to accept the Terms & Conditions',
        required_error: 'Required'
      })}"
    >
      <span class="form-check-label fw-bold text-gray-700 fs-6">
        I Agree to the
        <a href="/terms-and-conditions" class="ms-1 link-primary">Terms and conditions</a>.
      </span>
    </Checkbox>
  </div>

  <div class="text-center">
    <button
      type="submit"
      on:click|preventDefault="{submit}"
      disabled="{wait}"
      class="btn btn-lg btn-primary w-100 mb-5"
    >
      <span class="indicator-label {wait ? 'wait' : ''}">Create an account</span>
      <span class="indicator-progress {wait ? 'wait' : ''}">
        Please wait...
        <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
      </span>
    </button>
  </div>
</form>

<Modal
  bind:this="{successModal}"
  hideClose="true"
  actionBtnText="Continue"
  callback="{() => (location.href = '/')}"
>
  <svelte:fragment slot="title">Account successfully created!</svelte:fragment>
  <p slot="body" class="text-center">
    User <strong>{username}</strong> successfully created!
    <br />
    You will be redirected to the login screen.
  </p>
</Modal>

<Modal bind:this="{errorModal}" hideAction="true" outClick="true">
  <svelte:fragment slot="title">Failed to create account</svelte:fragment>
  <p slot="body" class="text-center modal-error-message">
    {#if errorModalBody}
      {errorModalBody.message}
      <br />
      (<em>Code: {errorModalBody.statusCode} - {errorModalBody.error}</em>)
    {:else}
      Account creation failed. Please try again or contact support.
    {/if}
  </p>
</Modal>

<Modal bind:this="{internalErrorModal}" hideAction="true">
  <svelte:fragment slot="title">Server Error</svelte:fragment>
  <p slot="body" class="text-center">
    Oops, something unexpected happened. Please try again later or contact support.
  </p>
</Modal>

<style>
  .modal-error-message:first-letter {
    text-transform: capitalize;
  }

  .indicator-label.wait {
    display: none;
  }

  .indicator-progress.wait {
    display: inline;
  }
</style>
