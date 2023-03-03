<script lang="ts">
  import { z } from 'zod';
  import BackArrow from '$lib/components/icons/back-arrow.svelte';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import AccountList from './list.svelte';
  import TextInput from '$lib/components/form/text-input.svelte';
  import { updateUserAccount } from '$lib/api/wallets';
  import Modal from '$lib/components/global/modal.svelte';
  import SubmitBtn from '$lib/components/global/action-button.svelte';
  import type { ViewType } from '$lib/types/view.type';

  export let stakeAddress = '';
  export let currentName = '';

  // Routing
  let mainView = getContext<Writable<ViewType>>('accountView');

  function handleReturn() {
    mainView.set({ component: AccountList, props: {} });
  }

  // Form
  let nameField: typeof TextInput;
  let name = currentName;
  let wait = false;
  let errorModal: typeof Modal;
  let errorModalBody: { statusCode: number; message: string; error: string };

  function submit(): void {
    const fields = [nameField.validate()];
    if (fields.every((field) => field)) {
      wait = true;
      updateUserAccount(stakeAddress, name.trim())
        .then((res) => {
          if ([200, 201].includes(res.statusCode)) {
            mainView.set({ component: AccountList, props: {} });
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
          errorModal.open();
        });
    }
  }
</script>

<div class="card card-bordered mb-xl-8">
  <div class="card-header">
    <h3 class="card-title align-items-start flex-column">
      <span class="card-label fw-bolder fs-3 mb-1">Update {currentName}</span>
    </h3>
    <div class="card-toolbar">
      <button
        on:click="{handleReturn}"
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

  <div class="card-body py-3">
    <div class="offset-md-3 col-md-6">
      <form class="form" novalidate="novalidate">
        <div class="my-10">
          <TextInput
            bind:this="{nameField}"
            bind:value="{name}"
            name="name"
            label="New account Name"
            placeholder="My wallet account name"
            schema="{z.string().nonempty()}"
          />
        </div>

        <div class="mb-10 text-center">
          <SubmitBtn type="submit" text="Save" action="{submit}" wait="{wait}" />
        </div>
      </form>
    </div>
  </div>
</div>

<Modal bind:this="{errorModal}" hideAction="{true}">
  <svelte:fragment slot="title">Failed to update account</svelte:fragment>
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
      Failed to update account.
      <br />
      Please try again or contact support.
    {/if}
  </div>
</Modal>
