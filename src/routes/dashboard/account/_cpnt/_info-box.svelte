<script lang="ts">
  export let label = '';
  export let info = '';
</script>

<div class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
  <div class="d-flex align-items-center">
    <span class="svg-icon svg-icon-3 me-2">
      <slot />
    </span>
    <div class="fs-4 fw-bolder font-monospace">
      {info}
    </div>
  </div>

  <div class="fw-bold fs-6 text-center text-gray-400">
    {label}
  </div>
</div>
