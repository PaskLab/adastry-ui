<script lang="ts">
  import GeneralSettings from './_cpnt/_general/_general.svelte';
  import SecuritySettings from './_cpnt/_security/_security.svelte';
  import NotificationSetttings from './_cpnt/_notification/_notification.svelte';
  import { getContext, onDestroy, setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import MainViewNav from './_cpnt/_main-view-nav.svelte';
  import type { Writable } from 'svelte/store';
  import type { ViewType } from '$lib/types/view.type';

  // Main View Routing
  let mainView: ViewType;

  const mainViewOptions: { id: string; view: ViewType; text: string }[] = [
    { id: 'general', view: { component: GeneralSettings, props: {} }, text: 'General' },
    { id: 'security', view: { component: SecuritySettings, props: {} }, text: 'Security' },
    {
      id: 'notification',
      view: { component: NotificationSetttings, props: {} },
      text: 'Notification',
    },
  ];

  setContext('mainView', writable<ViewType>(mainViewOptions[0].view));
  let unsubsriber = getContext<Writable<ViewType>>('mainView').subscribe((v) => (mainView = v));

  onDestroy(() => {
    unsubsriber();
  });
</script>

<div class="content flex-row-fluid">
  <div class="card mb-5 mb-xl-10">
    <div class="card-header border-0">
      <MainViewNav options="{mainViewOptions}" />
    </div>
  </div>

  <svelte:component this="{mainView.component}" {...mainView.props} />
</div>
