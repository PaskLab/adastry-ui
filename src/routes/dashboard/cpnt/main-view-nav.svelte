<script lang="ts">
  import { getContext } from 'svelte';
  import type { NavOptionType } from '$lib/types/nav-option.type';
  import type { Writable } from 'svelte/store';
  import type { ViewType } from '$lib/types/view.type';

  export let options: NavOptionType[];
  export let active = options[0].id;
  let mainView = getContext<Writable<ViewType>>('mainView');

  function handleClick(option: NavOptionType) {
    if (active != option.id) active = option.id;
    if (option.view) mainView.set(option.view);
  }
</script>

<div class="mb-10">
  <ul class="nav row mb-10">
    {#each options as option}
      <li class="nav-item col-12 col-lg mb-5 mb-lg-0">
        {#if option.type === 'view'}
          <div
            tabindex="0"
            on:click="{() => handleClick(option)}"
            on:keypress|preventDefault="{() => handleClick(option)}"
            class="{option.id === active
              ? 'active cursor-default'
              : ''} nav-link btn btn-flex btn-color-gray-400 btn-outline btn-outline-default d-flex flex-grow-1 flex-column flex-center py-5 h-1250px h-lg-175px"
          >
            {#if option.icon}
              <span class="svg-icon svg-icon-3x mb-5 mx-0">
                <svelte:component this="{option.icon}" />
              </span>
            {/if}
            <span class="fs-6 fw-bold">{@html option.text}</span>
          </div>
        {:else}
          <a
            href="{option.href}"
            tabindex="0"
            class="{option.id === active
              ? 'active cursor-default'
              : ''} nav-link btn btn-flex btn-color-gray-400 btn-outline btn-outline-default d-flex flex-grow-1 flex-column flex-center py-5 h-1250px h-lg-175px"
          >
            {#if option.icon}
              <span class="svg-icon svg-icon-3x mb-5 mx-0">
                <svelte:component this="{option.icon}" />
              </span>
            {/if}
            <span class="fs-6 fw-bold">{@html option.text}</span>
          </a>
        {/if}
      </li>
    {/each}
  </ul>
</div>

<style lang="scss">
  .nav-link {
    &:hover {
      transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
        border-color 0.15s ease-in-out;
    }
  }
  .nav-link {
    &:hover,
    &.active {
      color: #fff;
      background: #7cb342;
      border-color: #7cb342;
      :global(svg path) {
        fill: #fff !important;
      }
    }
  }
</style>
