<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { Mark } from '$lib/server/scrape';
	import type { ActionData } from './$types';

	export let form: ActionData;
	type MarksMap = Record<string, { mark: string; weight: number }[]>;

	let marksMap: MarksMap = {};

	function parseForm(formMarks: Mark[]): MarksMap {
		const marksMap: MarksMap = {};

		formMarks.forEach((mark) => {
			let subject = marksMap[mark.subject];
			if (!subject) {
				subject = [];
				marksMap[mark.subject] = subject;
			}

			subject.push({
				mark: mark.mark,
				weight: mark.weight
			});
		});

		return Object.keys(marksMap)
			.sort()
			.reduce((obj: MarksMap, key) => {
				obj[key] = marksMap[key];
				return obj;
			}, {});
	}

	onMount(async () => {
		if (form) {
			marksMap = parseForm(form.marks);
			localStorage.setItem('marks', JSON.stringify(marksMap));
			return;
		}

		const marksJson = localStorage.getItem('marks');
		if (!marksJson) {
			await goto('/');
			return;
		}

		marksMap = JSON.parse(marksJson);
	});

	function logout() {
		localStorage.removeItem('marks');
		goto('/');
	}
</script>

<div class="mt-5">
	<button on:click={logout}>Logout</button>

	<main class="main-table">
		<div class="table-element header">Subjects</div>
		<div class="table-element header">Average</div>
		<div class="table-element header">Marks</div>

		{#each Object.entries(marksMap) as subject}
			<div class="table-element">
				{subject[0]}
			</div>

			<div class="table-element">0</div>

			<div class="mark-container table-element">
				{#each subject[1] as mark}
					<div
						class="mark"
						class:negative={Number(mark.mark) && Number(mark.mark) < 6}
						class:no-avg={!Number(mark.mark) || mark.weight === 0}
					>
						<span class="font-bold">
							{mark.mark}
						</span>
						<span class="text-xs">
							{mark.weight}%
						</span>
					</div>
				{/each}
			</div>
		{/each}
	</main>
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

	.main-table {
		display: grid;
		grid-template-columns: 3fr 1fr 7fr;
		@apply gap-1 mt-5;
	}

	.header {
		@apply font-bold;
	}

	.mark-container {
		display: flex;
		@apply gap-1;
	}

	.table-element {
		@apply bg-slate-200 flex items-center px-3 h-12;
	}
</style>
