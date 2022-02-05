<script lang="ts">
  import { onMount } from 'svelte';
  import { z } from 'zod';
  import TextInput from '$lib/components/form/text-input.svelte';
  import PasswordInput from '$lib/components/form/password-input.svelte';
  import Modal from '$lib/components/global/modal.svelte';
  import { jwt, isTokenValid, initSession } from '$lib/stores/session.store';
  import { login } from '$lib/auth/login';

  let usernameField;
  let passwordField;
  let username: string;
  let password: string;
  let wait = false;
  let errorModal;
  let credentialModal;

  onMount(() => {
    initSession();
  });

  function submit(): void {
    const fields = [usernameField.validate(), passwordField.validate()];
    if (fields.every((field) => field)) {
      wait = true;
      login(username, password)
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
</script>

<form class="form w-100" novalidate="novalidate" id="sign-in-form">
  <div class="text-center mb-10">
    <h1 class="text-dark mb-3">Sign In</h1>
    <div class="text-gray-400 fw-bold fs-4">
      New Here?
      <a href="/auth/sign-up" class="link-primary fw-bolder"> Create an Account </a>
    </div>
  </div>

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
  <p slot="body" class="text-center">Please verify your login credentials.</p>
</Modal>

<style>
  .indicator-label.wait {
    display: none;
  }

  .indicator-progress.wait {
    display: inline;
  }
</style>
