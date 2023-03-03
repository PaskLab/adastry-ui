<script lang="ts">
  import MonthlyRewards from './monthly-rewards.svelte';
  import MonthlyStake from './monthly-stake.svelte';
  import type { ViewType } from '$lib/types/view.type';

  // Main View Routing
  type ViewOptionType = { id: string; view: ViewType; text: string; title: string };
  const mainViewOptions: ViewOptionType[] = [
    {
      id: 'rewards',
      view: { component: MonthlyRewards, props: {} },
      text: 'Rewards',
      title: 'Monthly Rewards',
    },
    {
      id: 'stake',
      view: { component: MonthlyStake, props: {} },
      text: 'Stake',
      title: 'Average Stake',
    },
  ];

  let title = mainViewOptions[0].title;
  let active = mainViewOptions[0].id;
  let mainView: ViewType = mainViewOptions[0].view;

  function changeView(option: ViewOptionType): void {
    mainView = option.view;
    active = option.id;
    title = option.title;
  }
</script>

<div class="card">
  <div class="card-header border-0 pt-5">
    <h3 class="card-title align-items-start flex-column">
      <span class="card-label fw-bolder fs-3 mb-1">{title}</span>
      <span class="text-muted fw-bold fs-7">Last 12 months</span>
    </h3>
    <!--begin::Toolbar-->
    <div class="card-toolbar">
      {#each mainViewOptions as option}
        <button
          on:click="{() => changeView(option)}"
          type="button"
          class="btn btn-sm btn-color-muted btn-active btn-active-primary {option.id === active
            ? 'active'
            : ''} px-4 me-1"
        >
          {option.text}
        </button>
      {/each}
    </div>
    <!--end::Toolbar-->
  </div>
  <div class="card-body text-gray-700">
    <svelte:component this="{mainView.component}" />
  </div>
</div>
