<script lang="ts">
  import { z } from 'zod';
  import BackArrow from '$lib/components/icons/back-arrow.svelte';
  import { getContext } from 'svelte';
  import AccountList from './_list.svelte';
  import TextInput from '$lib/components/form/text-input.svelte';
  import { addUserAccount } from '$lib/api/wallets';
  import Modal from '$lib/components/global/modal.svelte';
  import SubmitBtn from '$lib/components/global/action-button.svelte';
  import type { ViewType } from '$lib/types/view.type';
  import type { Writable } from 'svelte/store';

  // Routing
  let mainView = getContext<Writable<ViewType>>('mainView');

  function handleReturn() {
    mainView.set({ component: AccountList, props: {} });
  }

  // Form
  let nameField: typeof TextInput;
  let name = '';
  let addressField: typeof TextInput;
  let address = '';
  let wait = false;
  let successModal: typeof Modal;
  let errorModal: typeof Modal;
  let errorModalBody: { statusCode: number; message: string; error: string };

  function submit(): void {
    const fields = [nameField.validate(), addressField.validate()];
    if (fields.every((field) => field)) {
      wait = true;
      addUserAccount(name.trim(), address.trim())
        .then((res) => {
          if ([200, 201].includes(res.statusCode)) {
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
          errorModal.open();
        });
    }
  }
</script>

<div class="card card-bordered mb-xl-8">
  <div class="card-header pt-5">
    <h3 class="card-title align-items-start flex-column">
      <span class="card-label fw-bolder fs-3 mb-1">Add an account</span>
    </h3>
    <div class="card-toolbar">
      <!--begin::Menu-->
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
            label="Account Name"
            placeholder="My wallet account name"
            schema="{z.string().nonempty()}"
          />
        </div>

        <div class="mb-10">
          <TextInput
            bind:this="{addressField}"
            bind:value="{address}"
            name="address"
            label="Used wallet address or Stake address"
            placeholder="stake1ux97hsr... | addr1ux6tsw9r..."
            schema="{z
              .string()
              .regex(
                new RegExp('^stake[a-z0-9]{54}|addr[a-z0-9]{99}$'),
                'Must be a valid mainnet payment or stake address'
              )}"
          />
        </div>

        <div class="mb-10 text-center">
          <SubmitBtn type="submit" text="Add account" action="{submit}" wait="{wait}" />
        </div>
      </form>
    </div>
  </div>
</div>

<Modal
  bind:this="{successModal}"
  hideClose="{true}"
  outClick="{true}"
  actionBtnText="Continue"
  callback="{() => location.reload()}"
>
  <svelte:fragment slot="title">Account successfully added!</svelte:fragment>
  <svelte:fragment slot="body">
    <p class="text-center">
      Account <strong>{name}</strong> successfully added!
    </p>
    <p class="text-center text-primary fw-bolder">
      The synchronization process will take a few minutes...
    </p>
  </svelte:fragment>
</Modal>

<Modal bind:this="{errorModal}" hideAction="{true}">
  <svelte:fragment slot="title">Failed to add account</svelte:fragment>
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
      Failed to add a new wallet account.
      <br />
      Please try again or contact support.
    {/if}
  </div>
</Modal>
