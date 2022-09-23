<script lang="ts">
  export let metadata: string;
  let show = false;
</script>

<div class="accordion">
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button
        on:click="{() => (show = !show)}"
        class="accordion-button fs-4 fw-bold {show ? '' : 'rounded collapsed'}"
        type="button"
      >
        Show metadata
      </button>
    </h2>
    <div class="accordion-collapse collapse {show ? 'show' : ''}">
      <div class="accordion-body">
        <pre><code class="language-json">{JSON.stringify(JSON.parse(metadata), null, 2)}</code
          ></pre>
      </div>
    </div>
  </div>
</div>

<style>
  pre {
    font-size: 1em;
    line-height: 20px;
  }
</style>
