<script lang="ts">
  import config from '$lib/config.json';
  import PlusIcon from '$lib/components/icons/plus.svelte';
  import Skeleton from '$lib/components/global/skeleton.svelte';
  import { getContext, onDestroy } from 'svelte';
  import AddCategory from './add.svelte';
  import UpdateCategory from './update.svelte';
  import AccountView from '../accounts/accounts.svelte';
  import PencilIcon from '$lib/components/icons/pencil.svelte';
  import TrashIcon from '$lib/components/icons/trash.svelte';
  import Modal from '$lib/components/global/modal.svelte';
  import CategoryIcon from '$lib/components/icons/category.svelte';
  import { deleteCategory, getCategories } from '$lib/api/category';
  import type { ViewType } from '$lib/types/view.type';
  import type { Readable, Writable } from 'svelte/store';
  import type { AccountCategoryType } from '$lib/api/types/account-category.type';

  let pCategories: Promise<AccountCategoryType[]> = getCategories().catch(
    () => new Promise(() => []),
  );
  const colors = [...config.theme.colors].reverse();

  // Context
  const unsubscriber1 = getContext<Readable<Date>>('refresh-category').subscribe(
    () => (pCategories = getCategories()),
  );

  // Routing
  const categoryView = getContext<Writable<ViewType>>('categoryView');
  const mainView = getContext<Writable<ViewType>>('mainView');

  // Modals
  let errorModal: typeof Modal;
  let deleteModal: typeof Modal;
  let deleteCategoryName = '';
  let deleteCategorySlug = '';

  // Delete account
  function handleDelete(categoryName: string, categorySlug: string): void {
    deleteCategoryName = categoryName;
    deleteCategorySlug = categorySlug;
    deleteModal.open();
  }

  function deleteAction(): void {
    deleteModal.startWait();
    deleteCategory(deleteCategorySlug)
      .then(() => {
        pCategories = getCategories();
      })
      .catch(() => {
        errorModal.open();
      })
      .finally(() => deleteModal.close());
  }

  // Select Category
  let selected: string | undefined;
  const unsubscriber2 = mainView.subscribe((v) => (selected = v.props.categorySlug));
  function handleSelect(props: {
    categoryName?: string;
    categorySlug?: string;
    categoryColor?: string;
  }) {
    selected = props.categorySlug;
    mainView.set({ component: AccountView, props });
  }

  onDestroy(() => {
    unsubscriber1();
    unsubscriber2();
  });
</script>

<div class="card">
  <div class="card-header border-0 pt-5">
    <h3 class="card-title align-items-start flex-column">
      <span class="card-label fw-bolder fs-3 mb-1">Account Categories</span>
      {#await pCategories then categories}
        <span class="text-muted fw-bold fs-7"
          >{categories.length} categor{categories.length > 1 ? 'ies' : 'y'}</span
        >
      {/await}
    </h3>
    <div class="card-toolbar">
      <button
        on:click="{() => categoryView.set({ component: AddCategory, props: {} })}"
        type="button"
        class="btn btn-sm btn-color-gray-700 btn-color-primary btn-active-light-primary"
      >
        <span class="svg-icon svg-icon-2">
          <PlusIcon />
        </span>
        Add
      </button>
    </div>
  </div>

  <div class="card-body py-3">
    <div class="table-responsive">
      <table class="table align-middle gs-0 gy-2">
        <thead>
          <tr>
            <th class="p-0 w-50px"></th>
            <th class="p-0 min-w-150px"></th>
            <th class="p-0 min-w-30px"></th>
          </tr>
        </thead>
        <tbody>
          {#await pCategories}
            {#each [1, 2, 3] as _}
              <tr>
                <td>
                  <div class="symbol symbol-50px me-2">
                    <span class="symbol-label">
                      <Skeleton height="54px" />
                    </span>
                  </div>
                </td>
                <td>
                  <Skeleton width="50%" height="20px" />
                  <span class="text-muted fw-bold d-block fs-7">
                    <Skeleton height="18px" width="80%" />
                  </span>
                </td>
                <td class="text-end">
                  <span class="btn btn-sm btn-icon btn-bg-light btn-active-color-primary">
                    <Skeleton height="34px" />
                  </span>
                  <span class="btn btn-sm btn-icon btn-bg-light btn-active-color-primary">
                    <Skeleton height="34px" />
                  </span>
                </td>
              </tr>
            {/each}
          {:then categories}
            <tr>
              <td>
                <button
                  on:click="{handleSelect}"
                  type="button"
                  class="btn btn-link p-0 symbol symbol-50px me-2"
                >
                  <span class="symbol-label">
                    <CategoryIcon />
                  </span>
                </button>
              </td>
              <td>
                <button
                  on:click="{handleSelect}"
                  type="button"
                  class="btn btn-link p-0 {selected === undefined
                    ? 'text-primary'
                    : 'text-dark'} fw-bolder text-hover-primary mb-1 fs-6">All Accounts</button
                >
              </td>
              <td class="text-end"></td>
            </tr>
            {#each categories as category, i}
              <tr>
                <td>
                  <button
                    on:click="{() =>
                      handleSelect({
                        categoryName: category.name,
                        categorySlug: category.slug,
                        categoryColor: colors[i % colors.length],
                      })}"
                    type="button"
                    class="btn btn-link p-0 symbol symbol-50px me-2"
                  >
                    <span class="symbol-label">
                      <CategoryIcon --color="{colors[i % colors.length]}" />
                    </span>
                  </button>
                </td>
                <td>
                  <button
                    on:click="{() =>
                      handleSelect({
                        categoryName: category.name,
                        categorySlug: category.slug,
                        categoryColor: colors[i % colors.length],
                      })}"
                    type="button"
                    class="btn btn-link p-0 {selected === category.slug
                      ? 'text-primary'
                      : 'text-dark'} fw-bolder text-hover-primary mb-1 fs-6">{category.name}</button
                  >
                  <span class="d-none d-sm-block text-muted fw-bold d-block fs-7">
                    {category.accounts.length} account{category.accounts.length > 1 ? 's' : ''}
                  </span>
                </td>
                <td class="text-end">
                  <button
                    on:click="{() =>
                      categoryView.set({
                        component: UpdateCategory,
                        props: { slug: category.slug, currentName: category.name },
                      })}"
                    type="button"
                    tabindex="0"
                    class="btn btn-sm btn-icon btn-bg-light btn-active-color-warning"
                  >
                    <span class="svg-icon svg-icon-2">
                      <PencilIcon />
                    </span>
                  </button>
                  <button
                    on:click="{() => handleDelete(category.name, category.slug)}"
                    type="button"
                    tabindex="0"
                    class="btn btn-sm btn-icon btn-bg-light btn-active-color-danger"
                  >
                    <span class="svg-icon svg-icon-2">
                      <TrashIcon />
                    </span>
                  </button>
                </td>
              </tr>
            {/each}
          {:catch error}
            <tr>
              <td class="text-center" colspan="3"
                ><span style="color: red">{error.message}</span></td
              >
            </tr>
          {/await}
        </tbody>
      </table>
    </div>
  </div>
</div>

<Modal
  bind:this="{deleteModal}"
  action="{deleteAction}"
  actionBtnText="Delete"
  outClick="{true}"
  actionBtnClass="btn btn-danger"
>
  <svelte:fragment slot="title">
    <span class="text-danger">Delete Confirmation</span>
  </svelte:fragment>
  <div class="text-center" slot="body">
    <p>You are about to delete the following category:</p>
    <p class="text-danger fw-bolder">
      {deleteCategoryName}
    </p>
  </div>
</Modal>

<Modal bind:this="{errorModal}" hideAction="{true}">
  <svelte:fragment slot="title">
    <span class="text-danger">Server Error</span>
  </svelte:fragment>
  <p slot="body" class="text-center">
    Oops, something unexpected happened. Please try again later or contact support.
  </p>
</Modal>
