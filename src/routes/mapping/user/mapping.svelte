<script lang="ts">
  import config from '$lib/config.json';
  import Skeleton from '$lib/components/global/skeleton.svelte';
  import Pager from '$lib/components/global/pager.svelte';
  import { getContext } from 'svelte';
  import { get } from 'svelte/store';
  import { getUserMapping, toggleMappingOptions } from '$lib/api/mapping';
  import TextInput from '$lib/components/form/text-input.svelte';
  import SearchIcon from '$lib/components/icons/search.svelte';
  import Modal from '$lib/components/global/modal.svelte';
  import Switch from '$lib/components/global/action-switch.svelte';
  import HelpIcon from '$lib/components/icons/question.svelte';
  import Tooltip from '$lib/components/global/tooltip.svelte';
  import type { Writable } from 'svelte/store';
  import type { UserMappingListType } from '$lib/api/types/user-mapping.type';

  // Help Modal
  let infoModal: typeof Modal;

  // Search
  let search = '';
  let searchValue = '';

  // Pagination Context
  const pageStore = getContext<Writable<number>>('userMappingPage');
  let currentPage = get(pageStore);
  let limit = 20;
  let pMapping: Promise<UserMappingListType>;
  let scrollTo: Element;

  $: pageStore.set(currentPage);

  $: pMapping = getUserMapping({
    limit: limit,
    page: currentPage,
    search,
  });

  function handleUseKoinly(fingerprint: string, value: boolean) {
    toggleMappingOptions({ fingerprint, useGlobalKoinlyId: value });
  }

  function handleSearch(): void {
    currentPage = 1;
    search = searchValue;
  }
</script>

<div class="card mb-10">
  <div class="card-body d-flex">
    <form on:submit|preventDefault="{handleSearch}" class="w-100 me-4">
      <TextInput
        bind:value="{searchValue}"
        placeholder="Search ..."
        validation="{false}"
        clear="{true}"
        label="{false}"
      />
    </form>

    <button
      type="submit"
      on:click|preventDefault="{handleSearch}"
      class="btn btn-primary px-4 py-0"
    >
      <span class="svg-icon svg-icon-1 position-relative" style="top: -1px; left: 2px">
        <SearchIcon />
      </span>
    </button>
  </div>
</div>

<div class="card" bind:this="{scrollTo}">
  {#await pMapping}
    <Skeleton height="800px" />
  {:then mapping}
    <div class="card-header border-0 pt-5">
      <div class="card-title align-items-start flex-column">
        <h3 class="card-label fw-bolder fs-3 mb-1">
          User Asset Mapping
          <button
            on:click="{() => infoModal.open()}"
            class="btn btn-active-light-primary ms-1 p-1 btn-icon-warning"
          >
            <span class="svg-icon svg-icon-2x position-relative " style="left: 3px"
              ><HelpIcon /></span
            >
          </button>
        </h3>
        <span class="text-muted mt-1 fw-bold fs-7"
          >{mapping.count} mapping record{mapping.count > 1 ? 's' : ''}</span
        >
      </div>
      <Pager pageSize="{limit}" totalItems="{mapping.count}" bind:currentPage />
    </div>
    <div class="card-body py-3">
      {#if mapping.count < 1}
        <div class="p-20 text-center fs-5 text-muted fw-bold">
          <p>No mapping record found.</p>
          <p>Mapping records are automatically created at export time if needed.</p>
        </div>
      {:else}
        <div class="table-responsive">
          <table class="table table-row-bordered table-row-gray-100 align-middle gy-3 fs-8 fs-md-6">
            <thead>
              <tr class="fw-bolder text-muted">
                <th class="ps-2">Asset</th>
                <th class="w-150px"><Tooltip text="User mapped Koinly ID">Koinly ID</Tooltip></th>
                <th class="w-150px text-center"
                  ><Tooltip text="Replace by official Koinly ID">Use Global</Tooltip></th
                >
              </tr>
            </thead>
            <tbody class="font-monospace">
              {#each mapping.data as record, i}
                <tr class="rounded {i % 2 ? '' : 'bg-lighten'}">
                  <td class="ps-2">
                    <h6>{record.name}</h6>
                    <div class="text-gray-700 text-break">{record.fingerprint}</div>
                    <div class="text-muted fs-8 text-break">{record.hexId}</div>
                  </td>
                  <td>
                    {record.useGlobalKoinlyId ? record.koinlyId : record.userKoinlyId}
                  </td>
                  <td class="text-center">
                    {#if record.koinlyId.length}
                      <Switch
                        action="{() =>
                          handleUseKoinly(record.fingerprint, !record.useGlobalKoinlyId)}"
                        id="koinlyGlobal{i}"
                        bind:checked="{record.useGlobalKoinlyId}"
                        customClass="form-check form-switch form-check-custom form-check-solid d-inline"
                      />
                    {/if}
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
      <Pager
        pageSize="{limit}"
        totalItems="{mapping.count}"
        bind:currentPage
        scrollTo="{scrollTo}"
      />
    </div>
  {:catch error}
    <div class="text-center text-danger p-20">{config.messages.failedFetch}</div>
  {/await}
</div>

<Modal bind:this="{infoModal}" hideClose="{true}" outClick="{true}" actionBtnText="Continue">
  <svelte:fragment slot="title">What is user mapping?</svelte:fragment>
  <svelte:fragment slot="body">
    <p class="text-dark">
      User mapping purpose is to add unsupported tokens support to tax software like <a
        href="https://Koinly.io"
        target="_blank">Koinly.io</a
      >.
    </p>
    <p class="text-dark">
      The mapping will be automatically generated at export time when necessary. NFTs and Tokens on
      the exported <strong>.CSV</strong> file will be replaced with their associated supported ID.
    </p>
    <p class="text-dark">
      When official support is added, a user can switch to supported ID as it is made available in <strong
        >Global Mapping</strong
      >.
    </p>
    <p class="text-dark mt-10">
      Learn more by reading <a href="{config.routing.docs.mapping}" target="_blank"
        >Mapping Documentation</a
      >.
    </p>
  </svelte:fragment>
</Modal>

<style>
  thead {
    vertical-align: middle !important;
  }
</style>
