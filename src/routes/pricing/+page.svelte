<script lang="ts">
  import Aside from '../landing/aside.svelte';
  import Footer from '../landing/footer.svelte';
  import Plan from './plan.svelte';

  const options = {
    account: { name: 'Account History', enabled: true },
    rewards: { name: 'Rewards History', enabled: true },
    transactions: { name: 'Transactions History', enabled: true },
    multi: { name: 'Rewards & fees split (Multi-accounts SPO)', enabled: true },
    stats: { name: 'Basic Statistics', enabled: true },
    export: { name: 'CSV Export', enabled: false },
  };
</script>

<div class="d-flex flex-column flex-root">
  <div class="d-flex flex-column flex-lg-row flex-column-fluid">
    <Aside />

    <div class="d-flex flex-column flex-lg-row-fluid py-10 page-content">
      <div class="d-flex flex-center flex-column flex-column-fluid">
        <div class="px-10 px-lg-15 mx-auto text-gray-800">
          <div class="card" id="kt_pricing">
            <div class="card-body p-lg-17">
              <div class="d-flex flex-column">
                <div class="mb-13 text-center">
                  <h1 class="fs-2hx fw-bolder mb-5">Pricing & Plans</h1>
                  <div class="text-gray-400 fw-bold fs-5">
                    ** Subscription enable premium features for a year, including all previous years
                    data. **
                  </div>
                  <!--                  <div class="text-gray-400 fw-bold fs-5">-->
                  <!--                    If you need more info about our services, please check-->
                  <!--                    <a href="https://adastry.io" class="link-primary fw-bolder">Adastry Docs</a>.-->
                  <!--                  </div>-->
                </div>
                <div class="row justify-content-center g-10">
                  <Plan
                    isFree="{true}"
                    title="Basic"
                    description="For every Cardano user, no matter who you are"
                    options="{options}"
                  />
                  <Plan
                    isFree="{true}"
                    title="Supporter"
                    description="Include all accounts delegated to Armada Alliance member Pools for at least 4
														epochs"
                    options="{{
                      ...options,
                      export: { name: options.export.name, enabled: true },
                    }}"
                  />
                  <Plan
                    title="Single Account"
                    price="{2}"
                    priceBase="Account"
                    description="Include all paid accounts for a duration of 1 year"
                    options="{{
                      ...options,
                      export: { name: options.export.name, enabled: true },
                    }}"
                  />
                  <Plan
                    title="Whole Pool"
                    price="{50}"
                    priceBase="Year"
                    description="Include all pool delegated accounts for a duration of 1 year"
                    options="{{
                      ...options,
                      export: { name: options.export.name, enabled: true },
                    }}"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  </div>
</div>

<style>
  .page-content {
    overflow-y: scroll;
  }
</style>
