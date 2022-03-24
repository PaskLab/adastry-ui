<script lang="ts">
  export let formats: { [key: string]: string };
  export let selectedFormat: string;
  let selectView = false;

  function selectHandler(format) {
    selectedFormat = format;
    selectView = false;
  }
</script>

{#if selectView}
  <div>
    <div class="fs-6 fw-bolder text-gray-700">Choose a format ...</div>
    <div>
      {#each Object.keys(formats) as key}
        <button on:click="{() => selectHandler(key)}" class="btn btn-light-warning me-2 mt-2">
          {formats[key]}
        </button>
      {/each}
    </div>
  </div>
{:else}
  <div>
    <div class="fs-6 fw-bolder text-gray-700">Selected file format</div>
    <div>
      <button on:click="{() => (selectView = true)}" class="btn btn-warning mt-2">
        {formats[selectedFormat]}
      </button>
    </div>
  </div>

  <div class="ms-auto">
    <button on:click="{() => (selectView = true)}" class="btn btn-light btn-active-light-primary">
      Change format
    </button>
  </div>
{/if}
