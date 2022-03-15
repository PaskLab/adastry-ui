<script lang="ts">
  export let currentPage = 1;
  export let totalItems = 177;
  export let pageSize = 10;
  export let maxSurroundingOptions = 2; // Display max N items before and after current page

  const boundaryOptions = 1; // Display the first and last options (Do not change)
  const pages = Math.ceil(totalItems / pageSize);

  let options = generateOptions();

  function generateOptions(): number[] {
    const sumLimit = boundaryOptions + maxSurroundingOptions;
    const length = 2 * sumLimit + 1;

    let options = Array.apply(null, Array(length)).map(
      (v, i) => currentPage - (length - 1) / 2 + i
    );

    const lowerBoundary = Array.apply(null, Array(boundaryOptions)).map((v, i) => i + 1);
    const upperBoundary = Array.apply(null, Array(boundaryOptions)).map((v, i) => pages - i);

    options = [...new Set([...lowerBoundary, ...options, ...upperBoundary])];
    options = options
      .filter((v) => v <= pages)
      .filter((v) => v > 0)
      .sort(function (a, b) {
        return a - b;
      });

    return options;
  }

  function isLimit(value): boolean {
    const absDiff = Math.abs(currentPage - value);
    return (
      absDiff > maxSurroundingOptions && value > boundaryOptions && value <= pages - boundaryOptions
    );
  }

  function setCurrentPage(page): void {
    if (page == currentPage || page < 1 || page > pages) return;

    currentPage = page;
    options = generateOptions();
  }
</script>

<ul class="pagination pagination-outline">
  <li class="page-item previous {currentPage <= 1 ? 'disabled' : ''} m-1">
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
    <li class="page-item m-1 {option === currentPage ? 'active' : ''}">
      <button
        on:click="{() => setCurrentPage(option)}"
        type="button"
        class="page-link"
        disabled="{option === currentPage}"
      >
        {isLimit(option) ? '...' : option}</button
      >
    </li>
  {/each}

  <li class="page-item next {currentPage >= pages ? 'disabled' : ''} m-1">
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
