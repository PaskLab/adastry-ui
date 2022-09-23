<script lang="ts">
  export let label = '';
  export let info = '';
</script>

<div class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-1 me-md-6 mb-3">
  <div class="d-flex align-items-center">
    <span class="icon me-2">
      <slot />
    </span>
    <div class="fs-7  fs-md-4 fw-bolder font-monospace">
      {info}
    </div>
  </div>

  <div class="fw-bold fs-8 fs-md-6 text-center text-gray-400">
    {label}
  </div>
</div>

<style lang="scss">
  .icon :global(svg) {
    vertical-align: middle;
    line-height: 1;
    height: 1.35rem !important;
    width: 1.35rem !important;
  }
</style>
