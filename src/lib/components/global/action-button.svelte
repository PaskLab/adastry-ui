<script lang="ts">
  import type Component from 'svelte/types/compiler/compile/Component';
  export let type = 'button';
  export let text = 'Ok';
  export let icon: Component | undefined = undefined;
  export let wait = false;
  export let customClass = 'btn btn-primary';
  export let action = () => undefined;
</script>

<button
  type="{type}"
  on:submit|preventDefault
  on:click|preventDefault="{action}"
  disabled="{wait}"
  class="{customClass}"
>
  {#if icon}
    <span class="svg-icon svg-icon-2x position-relative" style="top: -1px">
      <svelte:component this="{icon}" />
    </span>
  {/if}
  <span class="indicator-label {wait ? 'wait' : ''}">{text}</span>
  <span class="indicator-progress {wait ? 'wait' : ''}">
    Please wait...
    <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
  </span>
</button>

<style lang="scss">
  .wait {
    &.indicator-label {
      display: none;
    }
    &.indicator-progress {
      display: inline;
    }
  }
</style>
