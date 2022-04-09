<script lang="ts">
  import { z, ZodString } from 'zod';
  import InputError from './_validation-error.svelte';

  export let name = '';
  export let id = 'form-' + name;
  export let label: string | boolean = true;
  export let value: string | undefined = undefined;
  export let placeholder = '';
  export let clear = false;
  export let customClass = '';
  export let autocomplete = false;
  export let error = false;
  export let validation = true;
  export let schema: ZodString = z.string({
    required_error: 'Required',
    invalid_type_error: 'Must be a string'
  });

  let init = false;
  let errorMessages: string[] = [];

  function initValidation(): void {
    init = true;
  }

  export function validate(): boolean {
    let result = schema.safeParse(value);

    error = !result.success;
    errorMessages = [];

    if (!result.success) {
      errorMessages = result.error.issues.map((issue) => issue.message);
    }

    return result.success;
  }

  $: if (init && validation) {
    value = value;
    validate();
  }
</script>

{#if label}
  <label class="form-label fs-6 fw-bolder text-dark" for="{id}">{label.length ? label : name}</label
  >
{/if}
<div class="position-relative">
  <input
    id="{id}"
    class="form-control {customClass} {error
      ? 'is-invalid'
      : init && value.length && validation
      ? 'is-valid'
      : ''} {clear ? 'clear-enabled' : ''}"
    type="text"
    name="{name}"
    placeholder="{placeholder}"
    autocomplete="{autocomplete ? 'on' : 'off'}"
    on:focusout|once="{initValidation}"
    bind:value
  />
  {#if clear}
    <span
      on:mousedown|preventDefault="{() => (value = '')}"
      class="btn btn-sm btn-icon position-absolute translate-middle top-50 end-0 me-n2"
    >
      <i class="bi bi-x-circle fs-2"></i>
    </span>
  {/if}
</div>
<InputError error="{error}" errorMessages="{errorMessages}" />

<style lang="scss">
  label:first-letter {
    text-transform: capitalize;
  }

  .clear-enabled {
    &.is-invalid,
    &.is-valid {
      background-position: right calc(2.375em + 0.375rem) center !important;
    }
  }
</style>
