<script lang="ts">
  import { range } from '$lib/utils/helper.utils';

  export let selectedYear: number;
  export let from: number;
  export let to: number;
  let selectView = false;

  const yearsRange = range(to - from + 1, from);

  function selectHandler(year) {
    selectedYear = year;
    selectView = false;
  }
</script>

{#if selectView}
  <div>
    <div class="fs-6 fw-bolder text-gray-700">Choose a year ...</div>
    <div>
      {#each yearsRange as year}
        <button on:click="{() => selectHandler(year)}" class="btn btn-light-primary mt-2 me-2">
          {year}
        </button>
      {/each}
    </div>
  </div>
{:else}
  <div>
    <div class="fs-6 fw-bolder text-gray-700">Selected Year</div>
    <div>
      <button on:click="{() => (selectView = true)}" class="btn btn-primary mt-2">
        {selectedYear}
      </button>
    </div>
  </div>

  <div class="ms-auto">
    <button on:click="{() => (selectView = true)}" class="btn btn-light btn-active-light-primary">
      Change year
    </button>
  </div>
{/if}
