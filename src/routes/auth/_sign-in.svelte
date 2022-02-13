<script lang="ts">
  import { onMount } from 'svelte';
  import { z } from 'zod';
  import TextInput from '$lib/components/form/text-input.svelte';
  import PasswordInput from '$lib/components/form/password-input.svelte';
  import Modal from '$lib/components/global/modal.svelte';
  import { jwt, isTokenValid, initSession } from '$lib/stores/session.store';
  import { login } from '$lib/auth/auth';
  import { getContext } from 'svelte';
  import SignUpForm from './_sign-up.svelte';

  // Component Routing
  const selectedForm = getContext('selectedForm');
  function displaySignUpForm(): void {
    selectedForm.set(SignUpForm);
  }

  // Form
  let usernameField: typeof TextInput;
  let passwordField: typeof PasswordInput;
  let username: string;
  let password: string;
  let wait = false;
  let errorModal: typeof Modal;
  let credentialModal: typeof Modal;

  function submit(): void {
    const fields = [usernameField.validate(), passwordField.validate()];
    if (fields.every((field) => field)) {
      wait = true;
      login(username.trim(), password.trim())
        .then((res) => {
          if (res.statusCode === 201) {
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

  onMount(() => {
    initSession();
  });
</script>

<div class="text-center mb-10">
  <h1 class="text-dark mb-3">Sign In</h1>
  <div class="text-gray-400 fw-bold fs-4">
    New Here?
    <button
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
    />
  </div>
  <div class="fv-row mb-10">
    <PasswordInput
      bind:this="{passwordField}"
      name="password"
      bind:value="{password}"
      schema="{z.string().min(8)}"
    />
  </div>

  <div class="text-center">
    <button
      type="submit"
      on:click|preventDefault="{submit}"
      disabled="{wait}"
      class="btn btn-lg btn-primary w-100 mb-5"
    >
      <span class="indicator-label {wait ? 'wait' : ''}">Continue</span>
      <span class="indicator-progress {wait ? 'wait' : ''}">
        Please wait...
        <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
      </span>
    </button>
  </div>
</form>

<Modal bind:this="{errorModal}" hideAction="true">
  <svelte:fragment slot="title">Server Error</svelte:fragment>
  <p slot="body" class="text-center">
    Oops, something unexpected happened. Please try again later or contact support.
  </p>
</Modal>

<Modal bind:this="{credentialModal}" hideAction="true" outClick="true">
  <svelte:fragment slot="title">Invalid username or password</svelte:fragment>
  <p slot="body" class="text-center">Please verify your authentication credentials.</p>
</Modal>

<style lang="scss">
  .wait {
    &.indicator-label {
      display: none;
    }
    &.indicator-progress {
      display: inline;
    }
  }
</style>
