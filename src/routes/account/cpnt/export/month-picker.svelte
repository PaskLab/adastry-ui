<script lang="ts">
  const options: { value: number | string; text: string }[] = [
    { value: 1, text: 'January' },
    { value: 2, text: 'February' },
    { value: 3, text: 'March' },
    { value: 4, text: 'April' },
    { value: 5, text: 'May' },
    { value: 6, text: 'June' },
    { value: 7, text: 'July' },
    { value: 8, text: 'August' },
    { value: 9, text: 'September' },
    { value: 10, text: 'October' },
    { value: 11, text: 'November' },
    { value: 12, text: 'December' },
  ];

  export let selected = 1;
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
    <div class="fs-6 fw-bolder text-gray-700">Choose a start month ...</div>
    <div>
      {#each options as option}
        <button on:click="{() => selectHandler(option)}" class="btn btn-light-skyblue mt-2 me-2">
          {option.text}
        </button>
      {/each}
    </div>
  </div>
{:else}
  <div>
    <div class="fs-6 fw-bolder text-gray-700">Fiscal Year Start</div>
    <div>
      <button on:click="{() => (selectView = true)}" class="btn btn-skyblue mt-2">
        {selectedPeriod}
      </button>
    </div>
  </div>

  <div class="ms-auto">
    <button on:click="{() => (selectView = true)}" class="btn btn-light btn-active-light-hover">
      Change Month
    </button>
  </div>
{/if}

<style lang="scss">
  .btn-skyblue {
    color: #ffffff;
    background-color: #29b6f6;
    &:hover {
      background-color: #039be5;
    }
  }
  .btn-light-skyblue {
    color: #039be5;
    background-color: #e9f5fb;
    &:hover {
      color: #ffffff;
      background-color: #29b6f6;
    }
  }
</style>
