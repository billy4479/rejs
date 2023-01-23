<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Subject } from './+page.svelte';

	export let name: string;
	export let marks: Subject;

	const recalculate = createEventDispatcher<{ recalculate: {} }>();
</script>

<button
	class="table-element"
	class:disabled={!marks.enabled}
	on:click={() => {
		marks.enabled = !marks.enabled;
		recalculate('recalculate', {});
	}}
>
	{name}
</button>

<button
	class="table-element"
	class:disabled={!marks.enabled}
	on:click={() => {
		marks.enabled = !marks.enabled;
		recalculate('recalculate', {});
	}}
>
	{marks.average.toFixed(2)}
</button>

<div class="table-element !p-0">
	<div class="mark-container">
		{#each marks.marks as mark}
			<button
				class="mark"
				class:negative={Number(mark.mark) && Number(mark.mark) < 6}
				class:no-avg={!Number(mark.mark) || mark.weight === 0}
				class:disabled={!mark.enabled || !marks.enabled}
				on:click={() => {
					mark.enabled = !mark.enabled;
					recalculate('recalculate', {});
				}}
			>
				<span class="font-bold">
					{mark.mark}
				</span>
				<span class="text-xs">
					{mark.weight}%
				</span>
			</button>
		{/each}
	</div>
</div>

<style>
	.mark {
		@apply w-12 h-full bg-green-600 text-slate-100 flex flex-col items-center justify-center;
	}

	.negative {
		@apply bg-red-600;
	}

	.no-avg {
		@apply bg-blue-600;
	}

	.disabled {
		@apply bg-gray-600 text-slate-100;
	}

	.mark-container {
		display: flex;
		gap: 1px;
		padding-right: 1px;
		@apply h-full bg-slate-500;
	}
</style>
