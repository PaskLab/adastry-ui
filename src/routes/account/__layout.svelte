<script lang="ts">
  import { beforeUpdate } from 'svelte';
  import { isTokenValid } from '$lib/stores/session.store';
  import Header from '../_header.svelte';
  import Footer from '../_footer.svelte';

  beforeUpdate(() => {
    if (!$isTokenValid) {
      location.href = '/';
    }
  });
</script>

<div class="d-flex flex-column flex-root">
  <div class="page d-flex flex-row flex-column-fluid">
    <div class="wrapper d-flex flex-column flex-row-fluid">
      <Header />

      <div class="d-flex flex-column-fluid align-items-start container-xxl">
        <slot />
      </div>

      <Footer />
    </div>
  </div>
</div>
