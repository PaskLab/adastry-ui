<script lang="ts">
  import config from '$lib/config.json';
  import Skeleton from '$lib/components/global/skeleton.svelte';
  import Pager from '$lib/components/global/pager.svelte';
  import { getContext } from 'svelte';
  import { get } from 'svelte/store';
  import { getGlobalMapping } from '$lib/api/mapping';
  import TextInput from '$lib/components/form/text-input.svelte';
  import SearchIcon from '$lib/components/icons/search.svelte';
  import type { Writable } from 'svelte/store';
  import type { GlobalMappingListType } from '$lib/api/types/global-mapping.type';

  // Search
  let search = '';
  let searchValue = '';

  // Pagination Context
  const pageStore = getContext<Writable<number>>('globalMappingPage');
  let currentPage = get(pageStore);
  let limit = 20;
  let pMapping: Promise<GlobalMappingListType>;
  let scrollTo: Element;

  $: pageStore.set(currentPage);

  $: pMapping = getGlobalMapping({
    limit: limit,
    page: currentPage,
    search,
  });

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

    <button type="submit" on:click|preventDefault="{handleSearch}" class="btn btn-primary px-4">
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
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bolder fs-3 mb-1">Global Asset Mapping</span>
        <span class="text-muted mt-1 fw-bold fs-7"
          >{mapping.count} mapping record{mapping.count > 1 ? 's' : ''}</span
        >
      </h3>
      <Pager pageSize="{limit}" totalItems="{mapping.count}" bind:currentPage />
    </div>
    <div class="card-body py-3">
      {#if mapping.count < 1}
        <div class="p-20 text-center fs-5 text-muted fw-bold">
          <p>No mapping record found.</p>
        </div>
      {:else}
        <div class="table-responsive">
          <table class="table table-row-bordered table-row-gray-100 align-middle gy-3 fs-8 fs-md-6">
            <thead>
              <tr class="fw-bolder text-muted">
                <th class="ps-2">Asset</th>
                <th class="w-150px">Koinly ID</th>
                <th class="w-150px text-center">Koinly ID State</th>
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
                    {record.koinlyId}
                  </td>
                  <td class="text-center">
                    {#if record.activeKoinlyId}
                      <span class="badge badge-success">Active</span>
                    {:else}
                      <span class="badge badge-warning">Pending</span>
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

<style>
  thead {
    vertical-align: middle !important;
  }
</style>
