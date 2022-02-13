<script lang="ts">
  import Aside from './_aside.svelte';
  import Footer from './_footer.svelte';
  import SignInForm from './auth/_sign-in.svelte';
  import { setContext, getContext } from 'svelte';
  import { writable, Writable } from 'svelte/store';

  // Component Routing
  let selectedForm: typeof SignInForm;

  setContext('selectedForm', writable(SignInForm));
  getContext<Writable<typeof SignInForm>>('selectedForm').subscribe((v) => (selectedForm = v));
</script>

<div class="d-flex flex-column flex-root">
  <!--begin::Authentication - Sign-in -->
  <div class="d-flex flex-column flex-lg-row flex-column-fluid">
    <Aside/>
    <!--begin::Body-->
    <div class="d-flex flex-column flex-lg-row-fluid py-10">
      <!--begin::Content-->
      <div class="d-flex flex-center flex-column flex-column-fluid">
        <!--begin::Wrapper-->
        <div class="w-lg-500px p-10 p-lg-15 mx-auto">
          <svelte:component this="{selectedForm}" />
        </div>
        <!--end::Wrapper-->
      </div>
      <!--end::Content-->
     <Footer/>
    </div>
    <!--end::Body-->
  </div>
  <!--end::Authentication - Sign-in-->
</div>
