<script lang="ts">
  import { z, ZodLiteral } from 'zod';
  import config from '$lib/config.json';
  import Skeleton from '$lib/components/global/skeleton.svelte';
  import TextInput from '$lib/components/form/text-input.svelte';
  import ActionButton from '$lib/components/global/action-button.svelte';
  import CreatePasswordInput from '$lib/components/form/create-password.svelte';
  import PasswordInput from '$lib/components/form/password-input.svelte';
  import Modal from '$lib/components/global/modal.svelte';
  import { getContext, onMount, setContext } from 'svelte';
  import { getUserProfile, updateUserProfile } from '$lib/api/user';
  import { writable } from 'svelte/store';
  import VerifiedList from './_verified/_list.svelte';
  import type { Writable } from 'svelte/store';
  import type { ViewType } from '$lib/types/view.type';
  import type { UserType } from '$lib/api/types/user.type';
  import type { UpdateUserType } from '$lib/api/types/update-user.type';

  // Routing
  let verifiedView: ViewType;
  setContext('verifiedView', writable<ViewType>({ component: VerifiedList, props: {} }));
  getContext<Writable<ViewType>>('verifiedView').subscribe((v) => (verifiedView = v));

  // Fetch
  let pProfile: Promise<UserType> = Promise.reject();

  // Modals
  let successModal: typeof Modal;
  let errorModal: typeof Modal;
  let errorModalBody: { statusCode: number; message: string; error: string };

  // Save profile handler
  function saveProfile(
    updateObj: UpdateUserType,
    validatedFields: boolean[],
    waitHandler: (enable: boolean) => void,
  ): void {
    if (validatedFields.every((field) => field)) {
      waitHandler(true);
      updateUserProfile(updateObj)
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
        .finally(() => waitHandler(false));
    }
  }

  // Form credentials
  let usernameField: typeof TextInput;
  let username = '';
  let waitCredential = false;

  function saveCredentials(): void {
    saveProfile(
      { username: username.trim() },
      [usernameField.validate()],
      (enable: boolean) => (waitCredential = enable),
    );
  }

  // Form password
  let oldPassword = '';
  let oldPasswordField: typeof TextInput;
  let newPassword = '';
  let newPasswordField: typeof TextInput;
  let confirmPassword: string;
  let confirmField: typeof TextInput;
  let confirmSchema: ZodLiteral<string>;
  let waitPassword = false;

  $: confirmSchema = z.literal(newPassword, {
    invalid_type_error: "Passwords don't match",
    required_error: 'Required',
  });

  // Clear confirmPassword on password change
  $: confirmPassword = newPassword ? '' : '';

  function savePassword(): void {
    saveProfile(
      { oldPassword: oldPassword.trim(), newPassword: newPassword.trim() },
      [oldPasswordField.validate(), newPasswordField.validate(), confirmField.validate()],
      (enable: boolean) => (waitPassword = enable),
    );
  }

  // Verified Addresses

  onMount(() => {
    pProfile = getUserProfile();
    pProfile.then((res) => {
      username = res.username;
    });
  });
</script>

<svelte:component this="{verifiedView.component}" {...verifiedView.props} />

<div class="card mb-5 mb-xl-10">
  <div class="card-header border-0">
    <div class="card-title">
      <h3 class="m-0">Credentials</h3>
    </div>
  </div>

  <div class="card-body border-top p-9">
    {#await pProfile}
      <Skeleton height="120px" />
    {:then _}
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
            schema="{z.string().nonempty('Required')}"
          />
          <div class="form-text">
            <strong>Caution:</strong> This will change your login credentials.
          </div>
        </div>
      </div>
    {:catch error}
      <div class="text-center text-danger p-10">{config.messages.failedFetch}</div>
    {/await}
  </div>

  <div class="card-footer d-flex justify-content-end py-6 px-9">
    <ActionButton
      type="button"
      text="Save Changes"
      action="{saveCredentials}"
      wait="{waitCredential}"
    />
  </div>
</div>

<div class="card mb-5 mb-xl-10">
  <div class="card-header border-0">
    <div class="card-title">
      <h3 class="m-0">Change Password</h3>
    </div>
  </div>

  <div class="card-body border-top p-9">
    <div class="row mb-6">
      <label class="col-lg-4 col-form-label required fw-bold fs-6" for="form-oldPassword"
        >Password</label
      >
      <div class="col-lg-8 fv-row fv-plugins-icon-container">
        <div class="form-text mb-5">
          <strong>Caution:</strong> This will change your login credentials.
        </div>
        <p>
          <PasswordInput
            bind:this="{oldPasswordField}"
            bind:value="{oldPassword}"
            name="oldPassword"
            label="Old Password"
            schema="{z.string().nonempty('Required')}"
          />
        </p>
        <p>
          <CreatePasswordInput
            bind:this="{newPasswordField}"
            bind:value="{newPassword}"
            name="newPassword"
            label="New Password"
          />
        </p>
        <p>
          <PasswordInput
            bind:this="{confirmField}"
            bind:value="{confirmPassword}"
            name="confirm-password"
            label="Confirm new Password"
            schema="{confirmSchema}"
          />
        </p>
      </div>
    </div>
  </div>

  <div class="card-footer d-flex justify-content-end py-6 px-9">
    <ActionButton type="button" text="Save Changes" action="{savePassword}" wait="{waitPassword}" />
  </div>
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
