<script context="module">
	/** @type {import('@sveltejs/kit').ErrorLoad} */
	export function load({ error, status }) {
		return {
			props: {
				error: error,
				status: status
			}
		};
	}
</script>

<script lang="ts">
	import Aside from './landing/aside.svelte';
	import Footer from './landing/footer.svelte';
	export let status;
</script>

<div class="d-flex flex-column flex-root">
	<div class="d-flex flex-column flex-lg-row flex-column-fluid">
		<Aside />

		<div class="d-flex flex-column flex-lg-row-fluid py-10 landing-bg">
			<div class="d-flex flex-center flex-column flex-column-fluid">
				<div class="w-lg-600px p-10 p-lg-15 mx-auto  text-center">
					<h1>Looks like something went wrong..!</h1>
					<h2 class="mt-4 mb-10 text-muted">Error {status}</h2>
					<p>
						<a
							href="https://github.com/PaskLab/adastry-ui/issues"
							target="_blank"
							class="menu-link px-2">Report Issue</a
						>
					</p>
				</div>
			</div>
			<Footer />
		</div>
	</div>
</div>

<style lang="scss">
	:global(.dark-mode) .landing-bg {
		background-color: #0b0d17;
	}
</style>
