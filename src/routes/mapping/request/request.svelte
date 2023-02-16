<script lang="ts">
  import { z } from 'zod';
  import config from '$lib/config.json';
  import TextInput from '$lib/components/form/text-input.svelte';
  import SubmitBtn from '$lib/components/global/action-button.svelte';
  import Modal from '$lib/components/global/modal.svelte';
  import GlobalMapping from '../global/mapping.svelte';
  import { submitMappingRequest } from '$lib/api/mapping';
  import { getContext } from 'svelte';
  import HelpIcon from '$lib/components/icons/question.svelte';
  import type { Writable } from 'svelte/store';
  import type { ViewType } from '$lib/types/view.type';

  // Help Modal
  let infoModal: typeof Modal;

  // View Context
  let view = getContext<Writable<ViewType>>('mainView');

  // Form
  let hexIdField: typeof TextInput;
  let hexId = '';
  let koinlyIdField: typeof TextInput;
  let koinlyId = '';
  let wait = false;
  let successModal: typeof Modal;
  let errorModal: typeof Modal;
  let errorModalBody: { statusCode: number; message: string; error: string };

  function submit(): void {
    const fields = [hexIdField.validate(), koinlyIdField.validate()];
    if (fields.every((field) => field)) {
      wait = true;
      submitMappingRequest({ hexId: hexId.trim(), koinlyId: koinlyId.trim() })
        .then((res) => {
          if ([200, 201].includes(res.statusCode)) {
            successModal.open();
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
    <div class="card-title align-items-start flex-column">
      <h3 class="card-label fw-bolder fs-3 mb-1">
        Request Koinly official mapping
        <button
          on:click="{() => infoModal.open()}"
          class="btn btn-active-light-primary ms-1 p-1 btn-icon-warning"
        >
          <span class="svg-icon svg-icon-2x position-relative " style="left: 3px"><HelpIcon /></span
          >
        </button>
      </h3>
    </div>
  </div>

  <div class="card-body py-3">
    <div class="offset-md-3 col-md-6">
      <form class="form" novalidate="novalidate">
        <div class="notice bg-light-warning rounded border-primary border border-dashed p-3 mb-10">
          <p class="fw-bold fs-6 text-gray-700 mb-0">
            <strong>Asset fingerprint</strong> cannot be used at the moment, please use the
            <strong>asset Hex ID</strong>
          </p>
          <p class="fw-bold fs-6 text-gray-700 mb-0">
            Hex ID is represented by the Policy Hex ID + Hex encoded asset name.
          </p>
        </div>
        <div class="my-10">
          <TextInput
            bind:this="{hexIdField}"
            bind:value="{hexId}"
            name="hexID"
            label="Asset Hex ID"
            placeholder="0afbd68c440321ec8aa6b235..."
            schema="{z.preprocess(
              (val) => val.trim(),
              z.string().regex(new RegExp('^[a-f0-9]+$'), 'Must be a valid mainnet asset hex ID'),
            )}"
          />
        </div>

        <div class="mb-10">
          <TextInput
            bind:this="{koinlyIdField}"
            bind:value="{koinlyId}"
            name="koinlyId"
            label="Koinly ID"
            placeholder="ID:12345"
            schema="{z.preprocess(
              (val) => val.trim(),
              z
                .string()
                .regex(new RegExp('^ID:\\d+$'), 'Must be a valid Koinly ID. (ie: ID:12345)')
                .max(15, 'Max 15 characters'),
            )}"
          />
        </div>

        <div class="mb-10 text-center">
          <SubmitBtn action="{submit}" type="submit" text="Send request" wait="{wait}" />
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
  callback="{() => view.set({ component: GlobalMapping, props: {} })}"
>
  <svelte:fragment slot="title">Mapping request sent!</svelte:fragment>
  <svelte:fragment slot="body">
    <p class="text-center">
      Mapping request for <strong>Koinly</strong> successfully sent!
    </p>
  </svelte:fragment>
</Modal>

<Modal bind:this="{errorModal}" hideAction="{true}">
  <svelte:fragment slot="title">Failed to create request</svelte:fragment>
  <div slot="body" class="text-center modal-error-message text-break">
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
      Failed to create mapping request.
      <br />
      Please try again or contact support.
    {/if}
  </div>
</Modal>

<Modal bind:this="{infoModal}" hideClose="{true}" outClick="{true}" actionBtnText="Continue">
  <svelte:fragment slot="title">What are official mapping request?</svelte:fragment>
  <svelte:fragment slot="body">
    <p class="text-dark">
      Mapping request allows a user to notify Adastry team about official support availability.
    </p>
    <p class="text-dark">
      With millions of different assets, it is currently impossible for our team to know the state
      of each one.
    </p>
    <p class="text-dark">
      Once requested, the team will verify the information and activate the official mapping.
    </p>
    <p class="text-dark mt-10">
      Check out our <a href="{config.routing.docs}/" target="_blank"
        >Mapping Request Documentation</a
      > to learn how to check for official support.
    </p>
  </svelte:fragment>
</Modal>
