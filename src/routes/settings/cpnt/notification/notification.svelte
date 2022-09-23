<script lang="ts">
  import TextInput from '../../../../lib/components/form/text-input.svelte';
  import ActionButton from '../../../../lib/components/global/action-button.svelte';
</script>

<div class="card mb-5 mb-xl-10">
  <div class="card-header border-0">
    <div class="card-title">
      <h3 class="m-0">Email</h3>
    </div>
  </div>

  <div class="card-body border-top p-9">
    <div class="row mb-6">
      <label class="col-lg-4 col-form-label required fw-bold fs-6" for="form-email">Email</label>

      <div class="col-lg-8 fv-row fv-plugins-icon-container">
        <TextInput label="{false}" name="email" />
        <div class="form-text">
          <strong>Tip:</strong> Email must be verified, check your mailbox after saving.
        </div>
      </div>
    </div>

    <div class="row mb-6">
      <span class="col-lg-4 col-form-label fw-bold fs-6">Verification Status</span>

      <div class="col-lg-8">
        <span class="badge badge-success">Verified</span>
      </div>
    </div>
  </div>

  <div class="card-footer d-flex justify-content-end py-6 px-9">
    <ActionButton type="button" text="Save Changes" />
  </div>
</div>
