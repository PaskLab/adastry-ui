<script lang="ts">
  export let currentPage = 1;
  export let totalItems = 0;
  export let pageSize = 10;
  export let surroundingLimit = 1; // Display max N items before and after current page
  export let scrollTo: Element;

  const pages = Math.ceil(totalItems / pageSize);

  let options = generateOptions({
    totalItems,
    pageSize,
    currentPage,
    surroundingLimit,
  });

  type OptionsList = { type: string; value: number }[];

  function generateOptions({
    totalItems,
    pageSize,
    currentPage,
    surroundingLimit = null,
  }): OptionsList {
    const totalPages = Math.ceil(totalItems / pageSize);
    const limitThreshold = getLimitThreshold({ surroundingLimit });
    const limited = surroundingLimit && totalPages > limitThreshold;
    return limited
      ? generateLimitedOptions({ totalPages, surroundingLimit, currentPage })
      : generateUnlimitedOptions({ totalPages });
  }

  function generateUnlimitedOptions({ totalPages }): OptionsList {
    return new Array(totalPages).fill(null).map((value, index) => ({
      type: 'number',
      value: index + 1,
    }));
  }

  function generateLimitedOptions({ totalPages, surroundingLimit, currentPage }): OptionsList {
    const boundarySize = surroundingLimit * 2 + 2;
    const firstBoundary = 1 + boundarySize;
    const lastBoundary = totalPages - boundarySize;
    const totalShownPages = firstBoundary + 2;

    if (currentPage <= firstBoundary - surroundingLimit) {
      return Array(totalShownPages)
        .fill(null)
        .map((value, index) => {
          if (index === totalShownPages - 1) {
            return {
              type: 'number',
              value: totalPages,
            };
          } else if (index === totalShownPages - 2) {
            return {
              type: 'symbol',
              value: firstBoundary + 1,
            };
          }
          return {
            type: 'number',
            value: index + 1,
          };
        });
    } else if (currentPage >= lastBoundary + surroundingLimit) {
      return Array(totalShownPages)
        .fill(null)
        .map((value, index) => {
          if (index === 0) {
            return {
              type: 'number',
              value: 1,
            };
          } else if (index === 1) {
            return {
              type: 'symbol',
              value: lastBoundary - 1,
            };
          }
          return {
            type: 'number',
            value: lastBoundary + index - 2,
          };
        });
    } else if (
      currentPage >= firstBoundary - surroundingLimit &&
      currentPage <= lastBoundary + surroundingLimit
    ) {
      return Array(totalShownPages)
        .fill(null)
        .map((value, index) => {
          if (index === 0) {
            return {
              type: 'number',
              value: 1,
            };
          } else if (index === 1) {
            return {
              type: 'symbol',
              value: currentPage - surroundingLimit + (index - 2),
            };
          } else if (index === totalShownPages - 1) {
            return {
              type: 'number',
              value: totalPages,
            };
          } else if (index === totalShownPages - 2) {
            return {
              type: 'symbol',
              value: currentPage + surroundingLimit + 1,
            };
          }
          return {
            type: 'number',
            value: currentPage - surroundingLimit + (index - 2),
          };
        });
    }
  }

  function getLimitThreshold({ surroundingLimit }): number {
    const maximumUnlimitedPages = 3; // This means we cannot limit 3 pages or less
    const numberOfBoundaryPages = 2; // The first and last pages are always shown
    return surroundingLimit * 2 + maximumUnlimitedPages + numberOfBoundaryPages;
  }

  function setCurrentPage(page): void {
    scrollTo.scrollIntoView();

    if (page == currentPage || page < 1 || page > pages) return;

    currentPage = page;
    options = generateOptions({ totalItems, pageSize, currentPage, surroundingLimit });
  }
</script>

<ul class="pagination pagination-outline">
  <li class="page-item previous {currentPage <= 1 ? 'disabled' : ''} m-1 d-none d-sm-block">
    <button
      on:click="{() => setCurrentPage(currentPage - 1)}"
      type="button"
      class="page-link"
      disabled="{currentPage <= 1}"
    >
      <i class="previous"></i>
    </button>
  </li>

  {#each options as option}
    <li class="page-item m-1 {option.value === currentPage ? 'active' : ''}">
      <button
        on:click="{() => setCurrentPage(option.value)}"
        type="button"
        class="page-link"
        disabled="{option.value === currentPage}"
      >
        {option.type === 'number' ? option.value : '...'}</button
      >
    </li>
  {/each}

  <li class="page-item next {currentPage >= pages ? 'disabled' : ''} m-1 d-none d-sm-block">
    <button
      on:click="{() => setCurrentPage(currentPage + 1)}"
      type="button"
      class="page-link"
      disabled="{currentPage >= pages}"
    >
      <i class="next"></i>
    </button>
  </li>
</ul>
