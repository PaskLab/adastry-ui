<script lang="ts">
  export let type = 'button';
  export let text = 'Ok';
  export let wait = false;
  export let customClass = 'btn btn-primary';
  export let action = () => undefined;
</script>

<button type="{type}" on:click|preventDefault="{action}" disabled="{wait}" class="{customClass}">
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
