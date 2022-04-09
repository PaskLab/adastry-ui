<script lang="ts">
  import Modal from '$lib/components/global/modal.svelte';
  import { onMount } from 'svelte';

  let infoModal: typeof Modal;

  onMount(() => {
    infoModal.open();
  });
</script>

<div class="col-xl-8">
  <div class="card card-xl-stretch mb-xl-8">
    <div class="card-header border-0 pt-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bolder fs-3 mb-1">My Pools</span>
        <span class="text-muted fw-bold fs-7">0 pools</span>
      </h3>
    </div>
    <div class="card-body py-3">
      <div class="table-responsive">
        <table class="table align-middle gs-0 gy-5">
          <thead>
            <tr>
              <th class="p-0 w-50px"></th>
              <th class="p-0 min-w-200px"></th>
              <th class="p-0 min-w-100px"></th>
              <th class="p-0 min-w-40px"></th>
            </tr>
          </thead>
          <tbody> </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<Modal bind:this="{infoModal}" hideClose="{true}" outClick="{true}" actionBtnText="Got it!">
  <svelte:fragment slot="title">Pool view Coming Soon!</svelte:fragment>
  <svelte:fragment slot="body">
    <p class="text-center fw-bolder">We chose not to delay the Alpha release any longer...!</p>
    <p class="text-center">Information about your chosen pools will be part of the next release.</p>
  </svelte:fragment>
</Modal>
