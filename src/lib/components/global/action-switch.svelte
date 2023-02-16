<script lang="ts">
  export let id = '';
  export let label: string | boolean = false;
  export let checked = false;
  export let customClass = 'form-check form-switch form-check-custom form-check-solid';
  export let action = () => undefined;
</script>

<div class="{customClass}">
  <input
    on:click="{action}"
    class="form-check-input h-20px w-30px"
    type="checkbox"
    bind:checked
    id="{id}"
  />
  {#if label}
    <label class="form-check-label" for="{id}">{label}</label>
  {/if}
</div>
