<script lang="ts">
  const options: { value: number | string; text: string }[] = [
    { value: null, text: 'Full' },
    { value: 1, text: 'Q1' },
    { value: 2, text: 'Q2' },
    { value: 3, text: 'Q3' },
    { value: 4, text: 'Q4' },
  ];

  export let selected: number | null = null;
  let selectedPeriod = options[0].text;
  let selectView = false;

  function selectHandler(option) {
    selected = option.value;
    selectedPeriod = option.text;
    selectView = false;
  }
</script>

{#if selectView}
  <div>
    <div class="fs-6 fw-bolder text-gray-700">Choose a period ...</div>
    <div>
      {#each options as option}
        <button on:click="{() => selectHandler(option)}" class="btn btn-light-info mt-2 me-2">
          {option.text}
        </button>
      {/each}
    </div>
  </div>
{:else}
  <div>
    <div class="fs-6 fw-bolder text-gray-700">Selected Period</div>
    <div>
      <button on:click="{() => (selectView = true)}" class="btn btn-info mt-2">
        {selectedPeriod}
      </button>
    </div>
  </div>

  <div class="ms-auto">
    <button on:click="{() => (selectView = true)}" class="btn btn-light btn-active-light-primary">
      Change Period
    </button>
  </div>
{/if}
