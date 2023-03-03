<script lang="ts">
  import SearchIcon from '$lib/components/icons/search.svelte';
  import ActionBtn from '$lib/components/global/action-button.svelte';
  import Modal from '$lib/components/global/modal.svelte';
  import type { CSVFileType } from '$lib/api/types/csv-file.type';

  export let action: () => Promise<CSVFileType>;

  let wait = false;
  let errorModal: typeof Modal;
  let errorModalBody: { statusCode: number; message: string; error: string };
  let internalErrorModal: typeof Modal;

  function handleExport() {
    wait = true;
    action()
      .then((res) => {
        wait = false;
        if (res.statusCode && res.statusCode === 404) {
          errorModalBody = {
            statusCode: res.statusCode,
            message: res.message,
            error: res.error,
          };
          errorModal.open();
        } else {
          location.href = res.url;
        }
      })
      .catch(() => {
        internalErrorModal.open();
        wait = false;
      });
  }
</script>

<div class="notice d-flex bg-light-warning rounded border-primary border border-dashed p-6">
  <span class="svg-icon svg-icon-2tx svg-icon-primary me-4">
    <SearchIcon />
  </span>
  <div class="d-flex flex-stack flex-grow-1 flex-wrap flex-md-nowrap">
    <div class="mb-3 mb-md-0 fw-bold">
      <h4 class="text-gray-900 fw-bolder">Always review your data</h4>
      <div class="fs-6 text-gray-700 pe-7">
        We cannot guarantee the accuracy of the data nor be liable for any resulting loss. It is
        your responsibility to verify the integrity of your data before using it for tax purposes.
      </div>
    </div>
    <ActionBtn
      text="Export"
      action="{handleExport}"
      wait="{wait}"
      customClass="btn btn-primary px-6 align-self-center text-nowrap"
    />
  </div>
</div>

<Modal bind:this="{errorModal}" hideAction="{true}" outClick="{true}">
  <svelte:fragment slot="title">Export failed</svelte:fragment>
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
      Export failed. Please try again or contact support.
    {/if}
  </div>
</Modal>

<Modal bind:this="{internalErrorModal}" hideAction="{true}">
  <svelte:fragment slot="title">Server Error</svelte:fragment>
  <p slot="body" class="text-center">
    Oops, something unexpected happened. Please try again later or contact support.
  </p>
</Modal>
