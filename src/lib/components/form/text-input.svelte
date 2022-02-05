<script lang="ts">
  import { z, ZodString } from 'zod';

  export let name = '';
  export let id = 'form-' + name;
  export let label = true;
  export let value = '';
  export let error = false;
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

  $: if (init) {
    value = value;
    validate();
  }
</script>

{#if label}
  <label class="form-label fs-6 fw-bolder text-dark" for="{id}">{name}</label>
{/if}

<input
  id="{id}"
  class="form-control form-control-lg form-control-solid {error
    ? 'is-invalid'
    : init && value.length
    ? 'is-valid'
    : ''}"
  type="text"
  name="{name}"
  autocomplete="off"
  on:focusout|once="{initValidation}"
  bind:value
/>
{#if error}
  <div class="fv-plugins-message-container invalid-feedback">
    {#each errorMessages as message}
      <div>{message}</div>
    {/each}
  </div>
{/if}

<style>
  label {
    text-transform: capitalize;
  }
</style>
