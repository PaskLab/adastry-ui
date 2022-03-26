<script lang="ts">
  import SearchIcon from '$lib/components/icons/search.svelte';
  import ActionBtn from '$lib/components/global/action-button.svelte';
  import Modal from '$lib/components/global/modal.svelte';
  import type { CSVFileType } from '$lib/api/types/csv-file.type';

  type ExportParamsType = {
    stakeAddress: string;
    year: number;
    format: string;
  };

  export let action: (stakeAddress: string, year: number, format: string) => Promise<CSVFileType>;
  export let params: ExportParamsType;
  let wait = false;
  let errorModal: typeof Modal;

  function handleExport() {
    wait = true;
    action(params.stakeAddress, params.year, params.format)
      .then((res) => {
        location.href = res.url;
        wait = false;
      })
      .catch(() => {
        errorModal.open();
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

<Modal bind:this="{errorModal}" hideAction="true">
  <svelte:fragment slot="title">Server Error</svelte:fragment>
  <p slot="body" class="text-center">
    Oops, something unexpected happened. Please try again later or contact support.
  </p>
</Modal>
