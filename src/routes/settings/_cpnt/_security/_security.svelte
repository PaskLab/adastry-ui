<script lang="ts">
  import { z } from 'zod';
  import TextInput from '$lib/components/form/text-input.svelte';
  import ActionButton from '$lib/components/global/action-button.svelte';
  import CreatePasswordInput from '$lib/components/form/create-password.svelte';
  import PasswordInput from '$lib/components/form/password-input.svelte';
  import PlusIcon from '$lib/components/icons/plus.svelte';
  import Modal from '$lib/components/global/modal.svelte';
  import { onMount } from 'svelte';
  import { getUserProfile, updateUserProfile } from '$lib/api/user';
  import type { UserType } from '$lib/api/types/user.type';

  // Fetch
  let pProfile: Promise<UserType> = Promise.reject();

  // Form
  let usernameField: typeof TextInput;
  let username = '';
  let wait = false;
  let successModal: typeof Modal;
  let errorModal: typeof Modal;
  let errorModalBody: { statusCode: number; message: string; error: string };

  function saveCredentials(): void {
    const fields = [usernameField.validate()];
    if (fields.every((field) => field)) {
      wait = true;
      updateUserProfile({ username: username.trim() })
        .then((res) => {
          if ([200, 201].includes(res.statusCode)) {
            successModal.open();
          } else {
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
          errorModal.open();
        })
        .finally(() => (wait = false));
    }
  }

  onMount(() => {
    pProfile = getUserProfile();
    pProfile.then((res) => {
      username = res.username;
    });
  });
</script>

<div class="card mb-5 mb-xl-10">
  <div class="card-header border-0">
    <div class="card-title">
      <h3 class="m-0">Credentials</h3>
    </div>
  </div>

  <div class="card-body border-top p-9">
    <div class="row mb-6">
      <label class="col-lg-4 col-form-label required fw-bold fs-6" for="form-username"
        >Username</label
      >
      <div class="col-lg-8 fv-row fv-plugins-icon-container">
        <TextInput
          label="{false}"
          name="username"
          bind:this="{usernameField}"
          bind:value="{username}"
          placeholder="Sign-In username"
          schema="{z.string().nonempty()}"
        />
        <div class="form-text">
          <strong>Caution: This will change your login credentials.</strong>
        </div>
      </div>
    </div>
  </div>

  <div class="card-footer d-flex justify-content-end py-6 px-9">
    <ActionButton type="button" text="Save Changes" action="{saveCredentials}" wait="{wait}" />
  </div>
</div>

<div class="card mb-5 mb-xl-10">
  <div class="card-header border-0">
    <div class="card-title">
      <h3 class="m-0">Password</h3>
    </div>
  </div>

  <div class="card-body border-top p-9">
    <div class="row mb-6">
      <label class="col-lg-4 col-form-label required fw-bold fs-6" for="form-username"
        >Password</label
      >
      <div class="col-lg-8 fv-row fv-plugins-icon-container">
        <CreatePasswordInput name="password" label="New Password" />
        <PasswordInput name="confirm-password" label="Confirm Password" />
        <div class="form-text">
          <strong>Tip:</strong> Username are case sensitive.
          <strong>Caution: This will change your login credentials.</strong>
        </div>
      </div>
    </div>
  </div>

  <div class="card-footer d-flex justify-content-end py-6 px-9">
    <ActionButton type="button" text="Save Changes" />
  </div>
</div>

<div class="card mb-5 mb-xl-10">
  <div class="card-header border-0">
    <div class="card-title">
      <h3 class="m-0">Verified Accounts</h3>
    </div>
    <div class="card-toolbar">
      <!--begin::Menu-->
      <button
        type="button"
        class="btn btn-sm btn-color-gray-700 btn-color-primary btn-active-light-primary"
      >
        <span class="svg-icon svg-icon-2">
          <PlusIcon />
        </span>
        Add account
      </button>
    </div>
  </div>

  <div class="card-body border-top p-9"></div>
</div>

<Modal bind:this="{successModal}" hideClose="{true}" outClick="{true}" actionBtnText="Continue">
  <svelte:fragment slot="title">Changes saved!</svelte:fragment>
  <svelte:fragment slot="body">
    <p class="text-center">Changes have been saved!</p>
  </svelte:fragment>
</Modal>

<Modal bind:this="{errorModal}" hideAction="{true}">
  <svelte:fragment slot="title">Failed to save data</svelte:fragment>
  <div slot="body" class="text-center modal-error-message">
    {#if errorModalBody}
      {#if typeof errorModalBody.message !== 'string' && errorModalBody.message.length}
        {#each errorModalBody.message as message}
          <p>{message}</p>
        {/each}
      {:else}
        {errorModalBody.message}
      {/if}
      <p class="mt-5 text-muted mb-0">
        <em>Code: {errorModalBody.statusCode} - {errorModalBody.error}</em>
      </p>
    {:else}
      Failed save data.
      <br />
      Please try again or contact support.
    {/if}
  </div>
</Modal>
