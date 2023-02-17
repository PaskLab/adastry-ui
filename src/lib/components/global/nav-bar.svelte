<script lang="ts">
  import { getContext, onDestroy } from 'svelte';
  import type { ViewType } from '$lib/types/view.type';
  import type { Writable } from 'svelte/store';
  import type { NavOptionType } from '$lib/types/nav-option.type';

  export let contextKey = 'mainView';
  export let options: NavOptionType[];
  export let active = options[0].id;
  let view = getContext<Writable<ViewType>>(contextKey);

  const unsubscriber = view.subscribe((v) =>
    options.forEach((opts) => {
      if (opts.view?.component === v.component) active = opts.id;
    }),
  );

  function handleClick(option: NavOptionType) {
    if (active != option.id) active = option.id;
    if (option.view) view.set(option.view);
  }

  onDestroy(() => {
    unsubscriber();
  });
</script>

<ul
  class="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-7 fs-md-5 fw-bolder"
>
  {#each options as option}
    <li class="nav-item">
      {#if option.type === 'view'}
        <div
          on:click="{() => handleClick(option)}"
          on:keypress|preventDefault="{() => handleClick(option)}"
          class="nav-link text-active-primary py-5 me-6 {option.id === active
            ? 'active cursor-default'
            : 'cursor-pointer'}"
        >
          {option.text}
        </div>
      {:else if option.type === 'link'}
        <a
          href="{option.href}"
          class="nav-link text-active-primary py-5 me-6 {option.id === active
            ? 'active cursor-default'
            : 'cursor-pointer'}"
        >
          {option.text}
        </a>
      {/if}
    </li>
  {/each}
</ul>
