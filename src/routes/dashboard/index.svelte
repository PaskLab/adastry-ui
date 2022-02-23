<script lang="ts">
  import WalletIcon from '$lib/components/icons/wallet.svelte';
  import Header from './_components/_header.svelte';
  import Footer from './_components/_footer.svelte';
  import MainViewNav from './_components/_main-view-nav.svelte';
  import { getContext, setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import Accounts from './_components/_accounts/_accounts.svelte';
  import Pools from './_components/_pools.svelte';
  import type { SvelteComponent } from 'svelte';
  import type { Writable } from 'svelte/store';

  // Main View Routing
  let mainView: typeof SvelteComponent;
  setContext('mainView', writable<typeof SvelteComponent>(Accounts));
  getContext<Writable<typeof SvelteComponent>>('mainView').subscribe((v) => (mainView = v));
  const mainViewOptions = [
    { id: 'account', component: Accounts, icon: WalletIcon, text: 'Wallet <br/> Accounts' },
    { id: 'pools', component: Pools, icon: WalletIcon, text: 'Stake <br/> Pools' }
  ];
</script>

<div class="d-flex flex-column flex-root">
  <!--begin::Page-->
  <div class="page d-flex flex-row flex-column-fluid">
    <!--begin::Wrapper-->
    <div class="wrapper d-flex flex-column flex-row-fluid" id="kt_wrapper">
      <!--begin::Header-->
      <Header />
      <!--end::Header-->
      <!--begin::Container-->
      <div
        id="kt_content_container"
        class="d-flex flex-column-fluid align-items-start container-xxl"
      >
        <!--begin::Post-->
        <div class="content flex-row-fluid" id="kt_content">
          <!--begin::Row-->
          <div class="row gy-0 gx-10">
            <!--begin::Col-->
            <MainViewNav options="{mainViewOptions}" />

            <svelte:component this="{mainView}" />

            <!--end::Col-->
            <!--begin::Col-->
            <div class="col-xl-4">
              <!--!!!!!!!!!!!!!!!Right Column !!!!!!!!!!!!!!!!-->
            </div>
            <!--end::Col-->
          </div>
          <!--end::Row-->
        </div>
        <!--end::Post-->
      </div>
      <!--end::Container-->
      <!--begin::Footer-->
      <Footer />
      <!--end::Footer-->
    </div>
    <!--end::Wrapper-->
  </div>
  <!--end::Page-->
</div>
