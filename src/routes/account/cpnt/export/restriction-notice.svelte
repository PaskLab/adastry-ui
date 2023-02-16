<script lang="ts">
  import config from '$lib/config.json';
</script>

<div
  class="notice bg-light-warning rounded border-primary border border-dashed p-6 mb-10 text-center"
>
  <div class="mb-3 mb-md-0 fw-bold">
    <h4 class="text-gray-900 fw-bolder mb-5">Premium Feature</h4>
    <div class="fs-6 text-gray-700 pe-7">
      <p>Only accounts included in premium plans are supported.</p>
      <p>
        Historical data of accounts included in the <a href="{config.routing.pricing}">Basic Plan</a
        >
        will be
        <strong>excluded</strong>.
      </p>
      <p class="mb-0">
        Verify <a href="{config.routing.subscriptions}">your accounts state</a> before exporting.
      </p>
    </div>
  </div>
</div>
