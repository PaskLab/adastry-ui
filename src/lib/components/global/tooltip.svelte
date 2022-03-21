<script>
  import { createPopperActions } from 'svelte-popperjs';
  export let text = '';
  export let placement = 'top';
  const [popperRef, popperContent] = createPopperActions({
    placement: placement,
    strategy: 'fixed'
  });
  const extraOpts = {
    modifiers: [{ name: 'offset', options: { offset: [0, 8] } }]
  };

  let showTooltip = false;
</script>

<div
  style="display: inline-block"
  use:popperRef
  on:mouseenter="{() => (showTooltip = true)}"
  on:mouseleave="{() => (showTooltip = false)}"
>
  <slot />
</div>
{#if showTooltip}
  <div id="tooltip" role="tooltip" use:popperContent="{extraOpts}">
    {text}
    <div id="arrow" data-popper-arrow></div>
  </div>
{/if}

<style>
  #tooltip {
    background: #333;
    color: #fff;
    font-weight: bold;
    padding: 4px 8px;
    font-size: 13px;
    border-radius: 4px;
  }

  :global(.dark-mode) #tooltip {
    background: #fff;
    color: #333;
  }

  #arrow,
  #arrow::before {
    position: absolute;
    width: 8px;
    height: 8px;
    background: inherit;
  }

  #arrow {
    visibility: hidden;
  }

  #arrow::before {
    visibility: visible;
    content: '';
    transform: rotate(45deg);
  }

  :global(#tooltip[data-popper-placement^='top']) > #arrow {
    bottom: -4px;
  }

  :global(#tooltip[data-popper-placement^='bottom']) > #arrow {
    top: -4px;
  }

  :global(#tooltip[data-popper-placement^='left']) > #arrow {
    right: -4px;
  }

  :global(#tooltip[data-popper-placement^='right']) > #arrow {
    left: -4px;
  }
</style>
