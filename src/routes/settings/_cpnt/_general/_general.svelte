<script lang="ts">
  import { z, ZodLiteral } from 'zod';
  import config from '$lib/config.json';
  import Skeleton from '$lib/components/global/skeleton.svelte';
  import TextInput from '$lib/components/form/text-input.svelte';
  import ActionButton from '$lib/components/global/action-button.svelte';
  import { deleteUser, getUserProfile, updateUserProfile } from '$lib/api/user';
  import Modal from '$lib/components/global/modal.svelte';
  import { onMount } from 'svelte';
  import { logout } from '$lib/utils/helper.utils';
  import type { UserType } from '$lib/api/types/user.type';

  // Fetch
  let pProfile: Promise<UserType> = Promise.reject();

  // Modals
  let successModal: typeof Modal;
  let errorModal: typeof Modal;
  let errorModalBody: { statusCode: number; message: string; error: string };

  // Profile Form
  let nameField: typeof TextInput;
  let name = '';
  let wait = false;

  function saveProfile(): void {
    const fields = [nameField.validate()];
    if (fields.every((field) => field)) {
      wait = true;
      updateUserProfile({ name: name.trim() })
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

  // Delete Form
  let deleteModal: typeof Modal;
  let deleteSuccessModal: typeof Modal;
  let deleteField: typeof TextInput;
  let deleteValidation = '_';
  let validationInput: string;
  let deleteSchema: ZodLiteral<string>;

  function deleteAccount(): void {
    const fields = [deleteField.validate()];
    if (fields.every((field) => field)) {
      deleteModal.startWait();
      deleteUser()
        .then((res) => {
          if ([200, 201].includes(res.statusCode)) {
            deleteSuccessModal.open();
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
        .finally(() => {
          deleteModal.stopWait();
          deleteModal.close();
        });
    }
  }

  onMount(() => {
    pProfile = getUserProfile();
    pProfile.then((res) => {
      name = res.name;
      deleteValidation = res.username;
      deleteSchema = z.literal(deleteValidation, {
        invalid_type_error: "Confirm deletion by typing you're username",
        required_error: 'Required',
      });
    });
  });
</script>

<div class="card mb-5 mb-xl-10">
  <div class="card-header border-0">
    <div class="card-title">
      <h3 class="m-0">Profile</h3>
    </div>
  </div>

  <div class="card-body border-top p-9">
    {#await pProfile}
      <Skeleton height="120px" />
    {:then _}
      <div class="row mb-6">
        <label class="col-lg-4 col-form-label fw-bold fs-6" for="form-fullname">Full Name</label>
        <div class="col-lg-8">
          <div class="row">
            <TextInput
              bind:this="{nameField}"
              bind:value="{name}"
              label="{false}"
              name="fullname"
              placeholder="*Optional*"
              schema="{z.string().optional()}"
            />
          </div>
        </div>
      </div>
    {:catch error}
      <div class="text-center text-danger p-20">{config.messages.failedFetch}</div>
    {/await}
  </div>

  <div class="card-footer d-flex justify-content-end py-6 px-9">
    <ActionButton type="button" text="Save Changes" action="{saveProfile}" wait="{wait}" />
  </div>
</div>

<div class="card mb-5 mb-xl-10">
  <div class="card-header border-0">
    <div class="card-title">
      <h3 class="m-0 text-danger">Delete Account</h3>
    </div>
  </div>

  <div class="card-body border-top p-9 text-center">
    {#await pProfile}
      <Skeleton height="150px" />
    {:then _}
      <p>
        <strong class="fs-5">
          The following action will definitely delete you're Adastry user account.
        </strong>
      </p>
      <p>
        <ActionButton
          type="button"
          text="Delete Account"
          action="{() => deleteModal.open()}"
          customClass="btn btn-danger"
        />
      </p>
    {:catch error}
      <div class="text-center text-danger p-20">{config.messages.failedFetch}</div>
    {/await}
  </div>
</div>

<Modal bind:this="{successModal}" hideClose="{true}" outClick="{true}" actionBtnText="Continue">
  <svelte:fragment slot="title">User profile saved!</svelte:fragment>
  <svelte:fragment slot="body">
    <p class="text-center">Changes have been saved!</p>
  </svelte:fragment>
</Modal>

<Modal
  bind:this="{deleteSuccessModal}"
  hideClose="{true}"
  outClick="{false}"
  actionBtnText="Go to login page"
  callback="{logout}"
>
  <svelte:fragment slot="title"><span class="text-danger">User deleted!</span></svelte:fragment>
  <svelte:fragment slot="body">
    <p class="text-center">User <strong>{deleteValidation}</strong> deleted!</p>
  </svelte:fragment>
</Modal>

<Modal
  bind:this="{deleteModal}"
  outClick="{true}"
  actionBtnClass="btn btn-danger"
  actionBtnText="Delete"
  action="{deleteAccount}"
>
  <svelte:fragment slot="title"><span class="text-danger">Delete Account</span></svelte:fragment>
  <svelte:fragment slot="body">
    <p class="text-center">
      Type <strong class="text-danger">{deleteValidation}</strong> to confirm deletion.
    </p>
    <p>
      <TextInput bind:this="{deleteField}" bind:value="{validationInput}" schema="{deleteSchema}" />
    </p>
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
