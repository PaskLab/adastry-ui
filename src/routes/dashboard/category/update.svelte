<script lang="ts">
  import { z } from 'zod';
  import BackArrow from '$lib/components/icons/back-arrow.svelte';
  import { getContext } from 'svelte';
  import AccountList from './list.svelte';
  import TextInput from '$lib/components/form/text-input.svelte';
  import Modal from '$lib/components/global/modal.svelte';
  import SubmitBtn from '$lib/components/global/action-button.svelte';
  import { updateCategoryName } from '$lib/api/category';
  import type { ViewType } from '$lib/types/view.type';
  import type { Writable } from 'svelte/store';

  export let slug = '';
  export let currentName = '';

  // Routing
  const categoryView = getContext<Writable<ViewType>>('categoryView');

  function handleReturn() {
    categoryView.set({ component: AccountList, props: {} });
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
      updateCategoryName(slug.trim(), name.trim())
        .then((res) => {
          if (res.statusCode && res.error) {
            wait = false;
            errorModalBody = {
              statusCode: res.statusCode,
              message: res.message,
              error: res.error,
            };
            errorModal.open();
          } else {
            categoryView.set({ component: AccountList, props: {} });
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
    <div class="offset-3 offset-md-1 offset-xl-0 col-6 col-md-10 col-xl-12">
      <form class="form" novalidate="novalidate">
        <div class="my-10">
          <TextInput
            bind:this="{nameField}"
            bind:value="{name}"
            name="name"
            label="New Category Name"
            placeholder="My category name"
            schema="{z.string().min(1, 'Must contain at least 1 character')}"
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
  <svelte:fragment slot="title">Failed to update category</svelte:fragment>
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
      Failed to update category.
      <br />
      Please try again or contact support.
    {/if}
  </div>
</Modal>
