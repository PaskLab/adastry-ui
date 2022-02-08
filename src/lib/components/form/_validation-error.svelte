<script lang="ts">
  export let error = false;
  export let errorMessages: string[] = [];
</script>

{#if error}
  {#if errorMessages.length > 1}
    <ul class="fv-plugins-message-container invalid-feedback">
      {#each errorMessages as message}
        <li>{message}.</li>
      {/each}
    </ul>
  {:else}
    <div class="fv-plugins-message-container invalid-feedback">
      <div>{errorMessages[0]}</div>
    </div>
  {/if}
{/if}